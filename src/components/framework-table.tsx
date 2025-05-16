
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody
} from "@/components/ui/table";
import { Attribute, FrameworkRow, AssetClass, AssetSubclass, Control, ControlGroup, Safeguard, TabType, AssessmentRow } from "@/types/security-types";

import TableActions from './framework-table/TableActions';
import TableHeaders from './framework-table/TableHeaders';
import FrameworkTableRow from './framework-table/FrameworkTableRow';
import EmptyTableRow from './framework-table/EmptyTableRow';
import { AssetOption } from './framework-table/asset-option-types';
import { 
  extractSafeguards, 
  extractAssetSubclasses, 
  generateAllAssetOptions,
  processAssetOptionSelection
} from './framework-table/asset-options-utils';

interface FrameworkTableProps {
  tabType: TabType;
  attributes: Attribute[];
  assetClasses: AssetClass[];
  controlGroups: ControlGroup[];
  rows: FrameworkRow[] | AssessmentRow[];
  onRowsChange: (rows: FrameworkRow[] | AssessmentRow[]) => void;
  onAttributeAdd: () => void;
}

const FrameworkTable: React.FC<FrameworkTableProps> = ({
  tabType,
  attributes,
  assetClasses,
  controlGroups,
  rows,
  onRowsChange,
  onAttributeAdd
}) => {
  const [safeguards, setSafeguards] = useState<Safeguard[]>([]);
  const [assetSubclasses, setAssetSubclasses] = useState<AssetSubclass[]>([]);
  const [assetOptions, setAssetOptions] = useState<Record<string, AssetOption[]>>({});

  // Extract all safeguards and subclasses
  useEffect(() => {
    setSafeguards(extractSafeguards(controlGroups));
    setAssetSubclasses(extractAssetSubclasses(assetClasses));
  }, [controlGroups, assetClasses]);

  // Generate asset options for each safeguard
  useEffect(() => {
    setAssetOptions(generateAllAssetOptions(safeguards, assetClasses));
  }, [safeguards, assetClasses, assetSubclasses]);

  // Get all controls flattened
  const controls = controlGroups.flatMap(group => group.controls);

  // Helper function for lookups
  const getControl = (controlId: string) => {
    return controls.find(control => control.id === controlId);
  };

  const getSafeguard = (safeguardId: string) => {
    return safeguards.find(safeguard => safeguard.id === safeguardId);
  };

  // Handle cell changes
  const handleCellChange = (rowId: string, field: string, value: string) => {
    const updatedRows = [...rows];
    const rowIndex = updatedRows.findIndex(r => r.id === rowId);
    
    if (rowIndex === -1) return;
    
    if (field.startsWith('attribute.')) {
      const attributeId = field.split('.')[1];
      (updatedRows[rowIndex] as any).attributes[attributeId] = value;
    } else {
      (updatedRows[rowIndex] as any)[field] = value;
    }
    
    onRowsChange(updatedRows);
  };

  // Handle safeguard change - this needs to reset asset class/subclass
  const handleSafeguardChange = (rowId: string, safeguardId: string) => {
    const updatedRows = [...rows];
    const rowIndex = updatedRows.findIndex(r => r.id === rowId);
    
    if (rowIndex === -1) return;
    
    const safeguard = getSafeguard(safeguardId);
    if (!safeguard) return;
    
    // Update safeguard, reset asset class and subclass
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      safeguardId,
      controlId: safeguard.control_id,
      assetClassId: '',
      assetSubclassId: ''
    };
    
    onRowsChange(updatedRows);
  };

  // Handle asset selection from the combined dropdown
  const handleAssetOptionChange = (rowId: string, combinedValue: string) => {
    const updatedRows = [...rows];
    const rowIndex = updatedRows.findIndex(r => r.id === rowId);
    
    if (rowIndex === -1) return;
    
    const { assetClassId, assetSubclassId } = processAssetOptionSelection(combinedValue);
    
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      assetClassId,
      assetSubclassId
    };
    
    onRowsChange(updatedRows);
  };

  // Add a new row
  const handleAddRow = () => {
    const newRow: FrameworkRow = {
      id: `row-${Date.now()}`,
      controlId: '',
      safeguardId: '',
      assetClassId: '',
      assetSubclassId: '',
      enforcementPoint: '',
      attributes: attributes.reduce((acc, attr) => {
        acc[attr.id] = '';
        return acc;
      }, {} as Record<string, string>)
    };
    
    onRowsChange([...rows, newRow]);
  };

  // Delete a row
  const handleDeleteRow = (rowId: string) => {
    const updatedRows = rows.filter(row => row.id !== rowId);
    onRowsChange(updatedRows);
  };

  return (
    <div className="overflow-x-auto w-full">
      <TableActions 
        onAddRow={handleAddRow} 
        onAttributeAdd={onAttributeAdd} 
      />
      
      <Table className="border">
        <TableHeaders attributes={attributes} />
        
        <TableBody>
          {rows.map((row) => (
            <FrameworkTableRow
              key={row.id}
              row={row}
              tabType={tabType}
              controls={controls}
              attributes={attributes}
              assetOptions={assetOptions}
              onDeleteRow={handleDeleteRow}
              onCellChange={handleCellChange}
              onSafeguardChange={handleSafeguardChange}
              onAssetOptionChange={handleAssetOptionChange}
            />
          ))}
          
          {rows.length === 0 && (
            <EmptyTableRow columnCount={6 + attributes.length} />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FrameworkTable;
