
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyTableRowProps {
  columnCount: number;
}

const EmptyTableRow: React.FC<EmptyTableRowProps> = ({ columnCount }) => {
  return (
    <TableRow>
      <TableCell colSpan={columnCount} className="text-center">
        No data available. Add a new row to get started.
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableRow;
