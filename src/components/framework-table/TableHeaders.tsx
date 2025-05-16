
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Attribute } from "@/types/security-types";
import AttributeTooltip from '../attribute-tooltip';

interface TableHeadersProps {
  attributes: Attribute[];
}

const TableHeaders: React.FC<TableHeadersProps> = ({ attributes }) => {
  return (
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
  );
};

export default TableHeaders;
