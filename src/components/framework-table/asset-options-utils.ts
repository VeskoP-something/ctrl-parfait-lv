
import { AssetClass, AssetSubclass, Safeguard } from "@/types/security-types";
import { AssetOption } from "./asset-option-types";

// Generate asset options for a given safeguard
export function generateAssetOptionsForSafeguard(
  safeguard: Safeguard,
  assetClasses: AssetClass[]
): AssetOption[] {
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

  return safeguardOptions;
}

// Process asset option selection
export function processAssetOptionSelection(
  combinedValue: string
): { assetClassId: string; assetSubclassId: string } {
  if (!combinedValue) {
    return { assetClassId: '', assetSubclassId: '' };
  }
  
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
  
  return { assetClassId, assetSubclassId };
}

// Generate all asset options for all safeguards
export function generateAllAssetOptions(
  safeguards: Safeguard[],
  assetClasses: AssetClass[]
): Record<string, AssetOption[]> {
  const options: Record<string, AssetOption[]> = {};

  safeguards.forEach(safeguard => {
    options[safeguard.id] = generateAssetOptionsForSafeguard(safeguard, assetClasses);
  });

  return options;
}

// Extract all safeguards from control groups
export function extractSafeguards(controlGroups: any[]): Safeguard[] {
  const allSafeguards: Safeguard[] = [];
  controlGroups.forEach(group => {
    group.controls.forEach((control: any) => {
      control.safeguards.forEach((safeguard: Safeguard) => {
        allSafeguards.push(safeguard);
      });
    });
  });
  return allSafeguards;
}

// Extract all subclasses from asset classes
export function extractAssetSubclasses(assetClasses: AssetClass[]): AssetSubclass[] {
  const allSubclasses: AssetSubclass[] = [];
  assetClasses.forEach(assetClass => {
    assetClass.subclasses.forEach(subclass => {
      allSubclasses.push(subclass);
    });
  });
  return allSubclasses;
}
