
import { Attribute, FrameworkRow, AssessmentRow, AssetClass, AssetSubclass, Control, ControlGroup, TabType } from "@/types/security-types";
import { saveAs } from 'file-saver';

// Install file-saver
// <lov-add-dependency>file-saver@^2.0.5</lov-add-dependency>

interface ExportData {
  tabType: TabType;
  rows: FrameworkRow[] | AssessmentRow[];
  attributes: Attribute[];
  controlGroups: ControlGroup[];
  assetClasses: AssetClass[];
}

export const exportData = async (format: string, data: ExportData) => {
  const { tabType, rows, attributes, controlGroups, assetClasses } = data;
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `ctrl-parfait-${tabType}-${timestamp}`;

  switch (format) {
    case 'json':
      exportAsJson(filename, rows, attributes, controlGroups, assetClasses);
      break;
    case 'xlsx':
      await exportAsSpreadsheet(filename, rows, attributes, controlGroups, assetClasses);
      break;
    case 'pdf':
      await exportAsPdf(filename, rows, attributes, controlGroups, assetClasses);
      break;
    case 'pptx':
      await exportAsSlide(filename, rows, attributes, controlGroups, assetClasses);
      break;
    default:
      console.error("Unsupported export format");
  }
};

// Export as JSON
function exportAsJson(
  filename: string, 
  rows: FrameworkRow[] | AssessmentRow[],
  attributes: Attribute[],
  controlGroups: ControlGroup[],
  assetClasses: AssetClass[]
) {
  const data = {
    exportedAt: new Date().toISOString(),
    attributes,
    controlGroups,
    assetClasses,
    rows
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, `${filename}.json`);
}

// Prepare data for tabular export
function prepareTabularData(
  rows: FrameworkRow[] | AssessmentRow[],
  attributes: Attribute[],
  controlGroups: ControlGroup[],
  assetClasses: AssetClass[]
) {
  // Flatten controls and safeguards for lookup
  const controls: Record<string, Control> = {};
  const safeguards: Record<string, any> = {};
  
  controlGroups.forEach(group => {
    group.controls.forEach(control => {
      controls[control.id] = control;
      control.safeguards.forEach(safeguard => {
        safeguards[safeguard.id] = {
          ...safeguard,
          controlName: control.name,
          controlNumber: control.number
        };
      });
    });
  });
  
  // Flatten asset classes and subclasses for lookup
  const assetClassMap: Record<string, AssetClass> = {};
  const assetSubclassMap: Record<string, AssetSubclass> = {};
  
  assetClasses.forEach(assetClass => {
    assetClassMap[assetClass.id] = assetClass;
    assetClass.subclasses.forEach(subclass => {
      assetSubclassMap[subclass.id] = subclass;
    });
  });
  
  // Transform rows to tabular format
  return rows.map(row => {
    const safeguard = safeguards[row.safeguardId] || {};
    const assetClass = assetClassMap[row.assetClassId] || { name: 'Unknown' };
    const assetSubclass = assetSubclassMap[row.assetSubclassId] || { name: 'Unknown' };
    
    // Base row data
    const rowData: Record<string, any> = {
      'Control Number': safeguard.controlNumber || '',
      'Control': safeguard.controlName || '',
      'Safeguard Number': safeguard.number || '',
      'Safeguard': safeguard.name || '',
      'Asset Class': assetClass.name,
      'Asset Subclass': assetSubclass.name,
      'Enforcement Point': row.enforcementPoint
    };
    
    // Add attributes
    attributes.forEach(attr => {
      rowData[attr.name] = (row as any).attributes[attr.id] || '';
    });
    
    return rowData;
  });
}

// Export as Spreadsheet (XLSX)
async function exportAsSpreadsheet(
  filename: string,
  rows: FrameworkRow[] | AssessmentRow[],
  attributes: Attribute[],
  controlGroups: ControlGroup[],
  assetClasses: AssetClass[]
) {
  try {
    // Dynamically import the XLSX library
    const XLSX = await import('xlsx').then(module => module.default);
    
    // Prepare data
    const data = prepareTabularData(rows, attributes, controlGroups, assetClasses);
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Framework');
    
    // Generate buffer and save
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to XLSX:', error);
    alert('Failed to export as spreadsheet. See console for details.');
  }
}

// Export as PDF
async function exportAsPdf(
  filename: string,
  rows: FrameworkRow[] | AssessmentRow[],
  attributes: Attribute[],
  controlGroups: ControlGroup[],
  assetClasses: AssetClass[]
) {
  try {
    // Dynamically import the jspdf and jspdf-autotable libraries
    const jsPDF = await import('jspdf').then(module => module.default);
    const autoTable = await import('jspdf-autotable').then(module => module.default);
    
    // Prepare data
    const data = prepareTabularData(rows, attributes, controlGroups, assetClasses);
    
    // Create document
    const doc = new jsPDF('l', 'mm', 'a3'); // landscape, millimeters, A3 size
    
    // Add title
    doc.setFontSize(18);
    doc.text('Control Performance and Reliability Framework (CTRL_PaRFait)', 14, 22);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    
    // Extract headers and data for autotable
    const headers = Object.keys(data[0] || {});
    const tableData = data.map(row => headers.map(header => row[header]));
    
    // Add table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 40,
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 8
      },
      columnStyles: {
        // Adjust column widths as needed
        0: { cellWidth: 15 }, // Control Number
        1: { cellWidth: 40 }, // Control
        2: { cellWidth: 15 }, // Safeguard Number
        3: { cellWidth: 40 }, // Safeguard
        4: { cellWidth: 25 }, // Asset Class
        5: { cellWidth: 25 }, // Asset Subclass
        6: { cellWidth: 30 }  // Enforcement Point
      },
      margin: { top: 40 }
    });
    
    // Save PDF
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Failed to export as PDF. See console for details.');
  }
}

// Export as Slide (PPTX)
async function exportAsSlide(
  filename: string,
  rows: FrameworkRow[] | AssessmentRow[],
  attributes: Attribute[],
  controlGroups: ControlGroup[],
  assetClasses: AssetClass[]
) {
  try {
    // Dynamically import the pptxgenjs library
    const PptxGenJS = await import('pptxgenjs').then(module => module.default);
    
    // Prepare data
    const data = prepareTabularData(rows, attributes, controlGroups, assetClasses);
    
    // Create presentation
    const pptx = new PptxGenJS();
    
    // Add title slide
    const titleSlide = pptx.addSlide();
    
    titleSlide.addText("Control Performance and Reliability Framework (CTRL_PaRFait)", {
      x: 1.0,
      y: 1.5,
      w: 8.0,
      h: 1.0,
      fontSize: 24,
      bold: true,
      align: 'center'
    });
    
    titleSlide.addText(`Generated: ${new Date().toLocaleString()}`, {
      x: 1.0,
      y: 2.5,
      w: 8.0,
      h: 0.5,
      fontSize: 14,
      align: 'center'
    });
    
    // Prepare table data
    const headers = Object.keys(data[0] || {});
    const tableData = [
      headers,
      ...data.map(row => headers.map(header => row[header]))
    ];
    
    // Add table slide (we might need multiple slides)
    const MAX_ROWS_PER_SLIDE = 10; // Adjust as needed
    const totalSlides = Math.ceil(data.length / MAX_ROWS_PER_SLIDE);
    
    for (let slideIndex = 0; slideIndex < totalSlides; slideIndex++) {
      const startRow = slideIndex * MAX_ROWS_PER_SLIDE + 1; // +1 for header row
      const endRow = Math.min((slideIndex + 1) * MAX_ROWS_PER_SLIDE + 1, tableData.length);
      const slideRows = [tableData[0], ...tableData.slice(startRow, endRow)]; // Include header row
      
      const tableSlide = pptx.addSlide();
      
      // Add title to table slide
      tableSlide.addText("Framework Data", {
        x: 1.0,
        y: 0.5,
        fontSize: 18,
        bold: true
      });
      
      // Add page counter
      tableSlide.addText(`Page ${slideIndex + 1} of ${totalSlides}`, {
        x: 8.0,
        y: 0.5,
        fontSize: 12,
        align: 'right'
      });
      
      // Add table
      tableSlide.addTable(slideRows, {
        x: 0.5,
        y: 1.0,
        w: 9.0,
        fontSize: 10,
        autoPage: false,
        columnWidths: [0.8, 2.0, 0.8, 2.0, 1.0, 1.2, 1.2] // Adjust as needed
      });
    }
    
    // Save presentation
    pptx.writeFile({ fileName: `${filename}.pptx` });
  } catch (error) {
    console.error('Error exporting to PPTX:', error);
    alert('Failed to export as slide. See console for details.');
  }
}
