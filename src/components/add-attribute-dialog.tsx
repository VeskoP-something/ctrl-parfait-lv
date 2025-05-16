
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Attribute } from "@/types/security-types";

interface AddAttributeDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (attribute: Attribute) => void;
}

const AddAttributeDialog: React.FC<AddAttributeDialogProps> = ({
  open,
  onClose,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tooltip, setTooltip] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAttribute: Attribute = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name.trim(),
      description: description.trim(),
      tooltip: tooltip.trim() || description.trim()
    };

    onAdd(newAttribute);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setTooltip('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Attribute</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name:
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description:
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tooltip" className="text-right">
                Tooltip:
              </Label>
              <Textarea
                id="tooltip"
                value={tooltip}
                onChange={(e) => setTooltip(e.target.value)}
                className="col-span-3"
                placeholder="Displayed when hovering over the information icon"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Attribute</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttributeDialog;
