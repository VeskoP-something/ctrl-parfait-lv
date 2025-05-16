
import { AssetClass, AssetSubclass, Safeguard } from "@/types/security-types";

export interface AssetOption {
  id: string;
  displayName: string;
  level: 'assetClass' | 'assetSubclass';
  assetClassId?: string;
  assetSubclassId?: string;
}

