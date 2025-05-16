
// Type definitions for the Control Performance and Reliability Framework

export interface Attribute {
  id: string;
  name: string;
  description: string;
  tooltip: string;
}

export interface AssetClass {
  id: string;
  name: string;
  subclasses: AssetSubclass[];
}

export interface AssetSubclass {
  id: string;
  name: string;
  classId: string;
}

export interface ControlGroup {
  id: string;
  name: string;
  controls: Control[];
}

export interface Control {
  id: string;
  number: string;
  name: string;
  safeguards: Safeguard[];
}

export interface Safeguard {
  id: string;
  control_id: string;
  number: string;
  name: string;
  description: string;
  applicable_asset_classes: string[]; // Array of asset class IDs
  applicable_asset_subclasses: string[]; // Array of asset subclass IDs
}

export interface EnforcementPoint {
  id: string;
  name: string;
  description?: string;
}

// Framework table row definition
export interface FrameworkRow {
  id: string;
  controlId: string;
  safeguardId: string;
  assetClassId: string;
  assetSubclassId: string;
  enforcementPoint: string;
  attributes: {
    [attributeId: string]: string; // Attribute ID to measurement method string
  };
}

// Assessment table row definition
export interface AssessmentRow {
  id: string;
  controlId: string;
  safeguardId: string;
  assetClassId: string;
  assetSubclassId: string;
  enforcementPoint: string;
  attributes: {
    [attributeId: string]: string; // Attribute ID to assessment value
  };
}

export type TabType = "framework" | "assessment";
