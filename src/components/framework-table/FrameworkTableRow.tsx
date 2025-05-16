
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash } from "lucide-react";
import { Attribute, Control, FrameworkRow, AssessmentRow, TabType } from "@/types/security-types";
import { AssetOption } from "./asset-option-types";

interface RowProps {
  row: FrameworkRow | AssessmentRow;
  tabType: TabType;
  controls: Control[];
  attributes: Attribute[];
  assetOptions: Record<string, AssetOption[]>;
  onDeleteRow: (rowId: string) => void;
  onCellChange: (rowId: string, field: string, value: string) => void;
  onSafeguardChange: (rowId: string, safeguardId: string) => void;
  onAssetOptionChange: (rowId: string, combinedValue: string) => void;
}

const FrameworkTableRow: React.FC<RowProps> = ({
  row,
  tabType,
  controls,
  attributes,
  assetOptions,
  onDeleteRow,
  onCellChange,
  onSafeguardChange,
  onAssetOptionChange
}) => {
  // Helper function to get the control
  const getControl = (controlId: string) => {
    return controls.find(control => control.id === controlId);
  };

  return (
    <TableRow key={row.id}>
      <TableCell>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDeleteRow(row.id)}
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
              onSafeguardChange(row.id, control.safeguards[0].id);
            } else {
              onCellChange(row.id, 'controlId', value);
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
          onValueChange={(value) => onSafeguardChange(row.id, value)}
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
          onValueChange={(value) => onAssetOptionChange(row.id, value)}
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
          onChange={(e) => onCellChange(row.id, 'enforcementPoint', e.target.value)}
          placeholder="Enter enforcement point"
        />
      </TableCell>
      
      {/* Attributes */}
      {attributes.map(attribute => (
        <TableCell key={`${row.id}-${attribute.id}`}>
          <Input
            value={(row as any).attributes[attribute.id] || ''}
            onChange={(e) => onCellChange(row.id, `attribute.${attribute.id}`, e.target.value)}
            placeholder={
              tabType === 'framework' 
                ? "Enter measurement method" 
                : "Enter assessment value"
            }
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default FrameworkTableRow;
