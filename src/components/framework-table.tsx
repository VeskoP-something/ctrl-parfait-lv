
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

  // Get all controls flattened
  const controls = controlGroups.flatMap(group => group.controls);

  // Helper functions for lookups
  const getControl = (controlId: string) => {
    return controls.find(control => control.id === controlId);
  };

  const getSafeguard = (safeguardId: string) => {
    return safeguards.find(safeguard => safeguard.id === safeguardId);
  };

  const getAssetClass = (assetClassId: string) => {
    return assetClasses.find(assetClass => assetClass.id === assetClassId);
  };

  const getAssetSubclass = (assetSubclassId: string) => {
    return assetSubclasses.find(subclass => subclass.id === assetSubclassId);
  };

  const getApplicableAssetClasses = (safeguardId: string) => {
    const safeguard = getSafeguard(safeguardId);
    if (!safeguard) return [];
    return assetClasses.filter(assetClass => 
      safeguard.applicable_asset_classes.includes(assetClass.id)
    );
  };

  const getApplicableAssetSubclasses = (safeguardId: string, assetClassId: string) => {
    const safeguard = getSafeguard(safeguardId);
    if (!safeguard) return [];
    
    return assetSubclasses.filter(subclass => 
      subclass.classId === assetClassId && 
      safeguard.applicable_asset_subclasses.includes(subclass.id)
    );
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

  // Handle safeguard change - this needs to reset assetClass and assetSubclass
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

  // Handle asset class change - this needs to reset assetSubclass
  const handleAssetClassChange = (rowId: string, assetClassId: string) => {
    const updatedRows = [...rows];
    const rowIndex = updatedRows.findIndex(r => r.id === rowId);
    
    if (rowIndex === -1) return;
    
    // Update asset class, reset subclass
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      assetClassId,
      assetSubclassId: ''
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
            <TableHead className="min-w-[180px]">Asset Class</TableHead>
            <TableHead className="min-w-[180px]">Asset Subclass</TableHead>
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
              
              {/* Asset Class */}
              <TableCell>
                <Select
                  value={row.assetClassId}
                  onValueChange={(value) => handleAssetClassChange(row.id, value)}
                  disabled={!row.safeguardId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Asset Class" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {row.safeguardId && 
                      getApplicableAssetClasses(row.safeguardId).map(assetClass => (
                        <SelectItem key={assetClass.id} value={assetClass.id}>
                          {assetClass.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </TableCell>
              
              {/* Asset Subclass */}
              <TableCell>
                <Select
                  value={row.assetSubclassId}
                  onValueChange={(value) => handleCellChange(row.id, 'assetSubclassId', value)}
                  disabled={!row.assetClassId || !row.safeguardId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Asset Subclass" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {row.safeguardId && row.assetClassId && 
                      getApplicableAssetSubclasses(row.safeguardId, row.assetClassId).map(subclass => (
                        <SelectItem key={subclass.id} value={subclass.id}>
                          {subclass.name}
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
              <TableCell colSpan={7 + attributes.length} className="text-center">
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
