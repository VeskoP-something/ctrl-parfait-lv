
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  onExport
}) => {
  const [format, setFormat] = useState('json');

  const handleExport = () => {
    onExport(format);
    toast.success(`Table exported successfully in ${format.toUpperCase()} format`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Framework</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">Select export format:</div>
          <RadioGroup value={format} onValueChange={setFormat}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json">JSON</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="xlsx" id="xlsx" />
              <Label htmlFor="xlsx">Spreadsheet (XLSX)</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf">PDF</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pptx" id="pptx" />
              <Label htmlFor="pptx">Slide (PPTX)</Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
