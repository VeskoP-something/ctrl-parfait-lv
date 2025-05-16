
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Attribute, FrameworkRow, AssetClass, AssetSubclass, Control, ControlGroup, Safeguard, TabType, AssessmentRow } from "@/types/security-types";
import AttributeTooltip from './attribute-tooltip';
import { Trash, Plus } from "lucide-react";

interface FrameworkTableProps {
  tabType: TabType;
  attributes: Attribute[];
  assetClasses: AssetClass[];
  controlGroups: ControlGroup[];
  rows: FrameworkRow[] | AssessmentRow[];
  onRowsChange: (rows: FrameworkRow[] | AssessmentRow[]) => void;
  onAttributeAdd: () => void;
}

interface AssetOption {
  id: string;
  displayName: string;
  level: 'assetClass' | 'assetSubclass';
  assetClassId?: string;
  assetSubclassId?: string;
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

  // Extract all safeguards from control groups
  useEffect(() => {
    const allSafeguards: Safeguard[] = [];
    controlGroups.forEach(group => {
      group.controls.forEach(control => {
        control.safeguards.forEach(safeguard => {
          allSafeguards.push(safeguard);
        });
      });
    });
    setSafeguards(allSafeguards);

    const allSubclasses: AssetSubclass[] = [];
    assetClasses.forEach(assetClass => {
      assetClass.subclasses.forEach(subclass => {
        allSubclasses.push(subclass);
      });
    });
    setAssetSubclasses(allSubclasses);
  }, [controlGroups, assetClasses]);

  // Generate asset options for each safeguard with classes and subclasses (no types)
  useEffect(() => {
    const options: Record<string, AssetOption[]> = {};

    safeguards.forEach(safeguard => {
      const safeguardOptions: AssetOption[] = [];
      
      // Add asset classes as options
      const applicableClassIds = safeguard.applicable_asset_classes;
      applicableClassIds.forEach(classId => {
        const assetClass = assetClasses.find(ac => ac.id === classId);
        if (assetClass) {
          safeguardOptions.push({
            id: `class-${classId}`,
            displayName: `${assetClass.name}`,
            level: 'assetClass',
            assetClassId: classId
          });
        }
      });
      
      // Add specific asset class + subclass combinations
      assetClasses.forEach(assetClass => {
        if (safeguard.applicable_asset_classes.includes(assetClass.id)) {
          assetClass.subclasses.forEach(subclass => {
            if (safeguard.applicable_asset_subclasses.includes(subclass.id)) {
              safeguardOptions.push({
                id: `subclass-${assetClass.id}-${subclass.id}`,
                displayName: `${assetClass.name} > ${subclass.name}`,
                level: 'assetSubclass',
                assetClassId: assetClass.id,
                assetSubclassId: subclass.id
              });
            }
          });
        }
      });

      options[safeguard.id] = safeguardOptions;
    });

    setAssetOptions(options);
  }, [safeguards, assetClasses, assetSubclasses]);

  // Get all controls flattened
  const controls = controlGroups.flatMap(group => group.controls);

  // Helper functions for lookups
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
    
    if (rowIndex === -1 || !combinedValue) return;
    
    const parts = combinedValue.split('-');
    const level = parts[0];
    
    let assetClassId = '';
    let assetSubclassId = '';
    
    if (level === 'class') {
      // User selected an asset class - set classId but leave subclassId empty
      assetClassId = parts[1];
    } else if (level === 'subclass') {
      // User selected a specific subclass - set both classId and subclassId
      assetClassId = parts[1];
      assetSubclassId = parts[2];
    }
    
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
      <div className="flex justify-between mb-4">
        <Button 
          onClick={handleAddRow}
          variant="outline"
        >
          <Plus className="mr-1 h-4 w-4" /> Add Row
        </Button>
        <Button 
          onClick={onAttributeAdd}
          variant="outline"
        >
          <Plus className="mr-1 h-4 w-4" /> Add Attribute
        </Button>
      </div>
      
      <Table className="border">
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[50px]">Actions</TableHead>
            <TableHead className="min-w-[180px]">Control</TableHead>
            <TableHead className="min-w-[180px]">Safeguard</TableHead>
            <TableHead className="min-w-[180px]">Asset</TableHead>
            <TableHead className="min-w-[180px]">Enforcement Point</TableHead>
            {attributes.map(attribute => (
              <TableHead key={attribute.id} className="min-w-[150px]">
                <div className="flex items-center">
                  {attribute.name}
                  <AttributeTooltip text={attribute.tooltip} />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteRow(row.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/20"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
              
              {/* Control */}
              <TableCell>
                <Select
                  value={row.controlId}
                  onValueChange={(value) => {
                    // Reset safeguard, asset class, and asset subclass
                    const control = getControl(value);
                    if (control && control.safeguards.length > 0) {
                      handleSafeguardChange(row.id, control.safeguards[0].id);
                    } else {
                      handleCellChange(row.id, 'controlId', value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Control" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {controls.map(control => (
                      <SelectItem key={control.id} value={control.id}>
                        {control.number}: {control.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              
              {/* Safeguard */}
              <TableCell>
                <Select
                  value={row.safeguardId}
                  onValueChange={(value) => handleSafeguardChange(row.id, value)}
                  disabled={!row.controlId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Safeguard" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {row.controlId && 
                      getControl(row.controlId)?.safeguards.map(safeguard => (
                        <SelectItem key={safeguard.id} value={safeguard.id}>
                          {safeguard.number}: {safeguard.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </TableCell>
              
              {/* Combined Asset Class/Subclass */}
              <TableCell>
                <Select
                  value={row.assetClassId && row.assetSubclassId 
                    ? `subclass-${row.assetClassId}-${row.assetSubclassId}` 
                    : row.assetClassId 
                      ? `class-${row.assetClassId}` 
                      : ''}
                  onValueChange={(value) => handleAssetOptionChange(row.id, value)}
                  disabled={!row.safeguardId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Asset" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {row.safeguardId && assetOptions[row.safeguardId]?.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              
              {/* Enforcement Point */}
              <TableCell>
                <Input
                  value={(row as any).enforcementPoint || ''}
                  onChange={(e) => handleCellChange(row.id, 'enforcementPoint', e.target.value)}
                  placeholder="Enter enforcement point"
                />
              </TableCell>
              
              {/* Attributes */}
              {attributes.map(attribute => (
                <TableCell key={`${row.id}-${attribute.id}`}>
                  <Input
                    value={(row as any).attributes[attribute.id] || ''}
                    onChange={(e) => handleCellChange(row.id, `attribute.${attribute.id}`, e.target.value)}
                    placeholder={
                      tabType === 'framework' 
                        ? "Enter measurement method" 
                        : "Enter assessment value"
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
          
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6 + attributes.length} className="text-center">
                No data available. Add a new row to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FrameworkTable;
