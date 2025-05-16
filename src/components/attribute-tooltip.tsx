
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface AttributeTooltipProps {
  text: string;
}

const AttributeTooltip: React.FC<AttributeTooltipProps> = ({ text }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 ml-1 text-muted-foreground inline-block cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-md">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AttributeTooltip;
