
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TableActionsProps {
  onAddRow: () => void;
  onAttributeAdd: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({ 
  onAddRow, 
  onAttributeAdd 
}) => {
  return (
    <div className="flex justify-between mb-4">
      <Button 
        onClick={onAddRow}
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
  );
};

export default TableActions;
