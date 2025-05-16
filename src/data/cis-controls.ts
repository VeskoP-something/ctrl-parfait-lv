import { AssetClass, AssetSubclass, Attribute, Control, ControlGroup, FrameworkRow } from "@/types/security-types";

// Default attributes
export const defaultAttributes: Attribute[] = [
  {
    id: "effectiveness",
    name: "Effectiveness",
    description: "Measures if the control does what it's supposed to do",
    tooltip: "Does the Enforcement Point do what it's supposed to?"
  },
  {
    id: "efficiency",
    name: "Efficiency",
    description: "Measures resource usage and cost",
    tooltip: "Is resource usage acceptable (e.g. device resources, unit cost, time to complete)?"
  },
  {
    id: "coverage",
    name: "Coverage",
    description: "Measures the scope of implementation",
    tooltip: "Percent in-scope assets covered"
  },
  {
    id: "friction",
    name: "Friction",
    description: "Measures user and business impact",
    tooltip: "Does the Enforcement Point cause friction to end users or business operations?"
  }
];

// Asset classes and subclasses
export const assetClasses: AssetClass[] = [
  {
    id: "devices",
    name: "Devices",
    subclasses: [
      { id: "endpoints", name: "Endpoints", classId: "devices" },
      { id: "servers", name: "Servers", classId: "devices" },
      { id: "mobile", name: "Mobile Devices", classId: "devices" },
      { id: "iot", name: "IoT Devices", classId: "devices" }
    ]
  },
  {
    id: "networks",
    name: "Networks",
    subclasses: [
      { id: "lan", name: "LAN", classId: "networks" },
      { id: "wan", name: "WAN", classId: "networks" },
      { id: "wireless", name: "Wireless Networks", classId: "networks" }
    ]
  },
  {
    id: "data",
    name: "Data",
    subclasses: [
      { id: "structured", name: "Structured Data", classId: "data" },
      { id: "unstructured", name: "Unstructured Data", classId: "data" },
      { id: "cloud", name: "Cloud Data", classId: "data" }
    ]
  },
  {
    id: "applications",
    name: "Applications",
    subclasses: [
      { id: "onprem", name: "On-Premises Applications", classId: "applications" },
      { id: "cloud", name: "Cloud Applications", classId: "applications" },
      { id: "custom", name: "Custom Applications", classId: "applications" },
      { id: "thirdparty", name: "Third-Party Applications", classId: "applications" }
    ]
  },
  {
    id: "users",
    name: "Users",
    subclasses: [
      { id: "employees", name: "Employees", classId: "users" },
      { id: "contractors", name: "Contractors", classId: "users" },
      { id: "privileged", name: "Privileged Users", classId: "users" }
    ]
  }
];

// Flattened array of all subclasses for easier lookup
export const allAssetSubclasses: AssetSubclass[] = assetClasses.flatMap(assetClass => assetClass.subclasses);

// CIS Controls and safeguards
export const controlGroups: ControlGroup[] = [
  {
    id: "ig1",
    name: "IG1: Basic",
    controls: [
      {
        id: "cis1",
        number: "1",
        name: "Inventory and Control of Enterprise Assets",
        safeguards: [
          {
            id: "1.1",
            control_id: "cis1",
            number: "1.1",
            name: "Establish and Maintain Detailed Enterprise Asset Inventory",
            description: "Establish and maintain an accurate, detailed, and up-to-date inventory of all enterprise assets with the potential to store, process, or transmit data, including: end-user devices (including portable and mobile), network devices, non-computing/IoT devices, and servers. Ensure the inventory records the network address, hardware address, machine name, enterprise asset owner, department for each asset, and whether the asset has been approved to connect to the network. For mobile end-user devices, MDM type tools can support this process, where appropriate.",
            applicable_asset_classes: ["devices", "networks"],
            applicable_asset_subclasses: ["endpoints", "servers", "mobile", "iot", "lan", "wan", "wireless"]
          },
          {
            id: "1.2",
            control_id: "cis1",
            number: "1.2",
            name: "Address Unauthorized Assets",
            description: "Ensure that a process exists to address unauthorized assets on a weekly basis. The enterprise may choose to remove the asset from the network, deny the asset from connecting remotely to the network, or quarantine the asset.",
            applicable_asset_classes: ["devices", "networks"],
            applicable_asset_subclasses: ["endpoints", "servers", "mobile", "iot", "lan", "wireless"]
          }
        ]
      },
      {
        id: "cis2",
        number: "2",
        name: "Inventory and Control of Software Assets",
        safeguards: [
          {
            id: "2.1",
            control_id: "cis2",
            number: "2.1",
            name: "Establish and Maintain Software Inventory",
            description: "Establish and maintain a detailed inventory of all licensed software installed on enterprise assets. The software inventory must document the title, publisher, initial installation/use date, and business purpose for each entry; where appropriate, include the Uniform Resource Locator (URL), app store(s), version(s), deployment mechanism, and decommission date.",
            applicable_asset_classes: ["devices", "applications"],
            applicable_asset_subclasses: ["endpoints", "servers", "mobile", "onprem", "cloud", "custom", "thirdparty"]
          },
          {
            id: "2.2",
            control_id: "cis2",
            number: "2.2",
            name: "Ensure Authorized Software is Currently Supported",
            description: "Ensure that only currently supported software is designated as authorized in the software inventory for enterprise assets. If software is unsupported, yet necessary for the fulfillment of the enterprise's mission, document an exception detailing mitigating controls and residual risk acceptance.",
            applicable_asset_classes: ["applications"],
            applicable_asset_subclasses: ["onprem", "cloud", "custom", "thirdparty"]
          }
        ]
      },
      {
        id: "cis3",
        number: "3",
        name: "Data Protection",
        safeguards: [
          {
            id: "3.1",
            control_id: "cis3",
            number: "3.1",
            name: "Establish and Maintain Data Management Process",
            description: "Establish and maintain a data management process. In the process, address data sensitivity, data owner, handling of data, data retention limits, and disposal requirements, based on sensitivity and retention standards for the enterprise.",
            applicable_asset_classes: ["data"],
            applicable_asset_subclasses: ["structured", "unstructured", "cloud"]
          },
          {
            id: "3.2",
            control_id: "cis3",
            number: "3.2",
            name: "Establish and Maintain a Data Inventory",
            description: "Establish and maintain a data inventory, based on the enterprise's data management process.",
            applicable_asset_classes: ["data"],
            applicable_asset_subclasses: ["structured", "unstructured", "cloud"]
          }
        ]
      }
    ]
  },
  {
    id: "ig2",
    name: "IG2: Foundational",
    controls: [
      {
        id: "cis4",
        number: "4",
        name: "Secure Configuration of Enterprise Assets and Software",
        safeguards: [
          {
            id: "4.1",
            control_id: "cis4",
            number: "4.1",
            name: "Establish and Maintain a Secure Configuration Process",
            description: "Establish and maintain a secure configuration process for enterprise assets (end-user devices, including portable and mobile; network devices; non-computing/IoT devices; and servers) and software (operating systems and applications).",
            applicable_asset_classes: ["devices", "applications"],
            applicable_asset_subclasses: ["endpoints", "servers", "mobile", "iot", "onprem", "cloud"]
          },
          {
            id: "4.2",
            control_id: "cis4",
            number: "4.2",
            name: "Establish and Maintain a Secure Configuration Process for Network Infrastructure",
            description: "Establish and maintain a secure configuration process for network infrastructure.",
            applicable_asset_classes: ["networks"],
            applicable_asset_subclasses: ["lan", "wan", "wireless"]
          }
        ]
      },
      {
        id: "cis5",
        number: "5",
        name: "Account Management",
        safeguards: [
          {
            id: "5.1",
            control_id: "cis5",
            number: "5.1",
            name: "Establish and Maintain an Inventory of Accounts",
            description: "Establish and maintain an inventory of all accounts managed in the enterprise.",
            applicable_asset_classes: ["users"],
            applicable_asset_subclasses: ["employees", "contractors", "privileged"]
          },
          {
            id: "5.2",
            control_id: "cis5",
            number: "5.2",
            name: "Use Unique Passwords",
            description: "Use unique passwords for all enterprise assets.",
            applicable_asset_classes: ["users", "devices"],
            applicable_asset_subclasses: ["employees", "contractors", "privileged", "endpoints", "servers"]
          }
        ]
      }
    ]
  },
  {
    id: "ig3",
    name: "IG3: Organizational",
    controls: [
      {
        id: "cis6",
        number: "6",
        name: "Access Control Management",
        safeguards: [
          {
            id: "6.1",
            control_id: "cis6",
            number: "6.1",
            name: "Establish an Access Granting Process",
            description: "Establish and follow a process to grant access to enterprise assets upon new hire, rights grant, or role change of a user.",
            applicable_asset_classes: ["users"],
            applicable_asset_subclasses: ["employees", "contractors", "privileged"]
          },
          {
            id: "6.2",
            control_id: "cis6",
            number: "6.2",
            name: "Establish an Access Revoking Process",
            description: "Establish and follow a process, following the principle of least privilege, for revoking access to enterprise assets, through disable, delete, or modify accounts, upon separation, or upon role change of a user.",
            applicable_asset_classes: ["users"],
            applicable_asset_subclasses: ["employees", "contractors", "privileged"]
          }
        ]
      }
    ]
  }
];

// Example methods for measuring each attribute by safeguard type
export const exampleMethods = {
  effectiveness: [
    "Penetration testing to assess control bypass",
    "Independent verification of inventory accuracy",
    "Automated scanning vs. manual inventory comparison",
    "Regular audits with management review",
    "Periodic data classification accuracy review"
  ],
  efficiency: [
    "CPU/memory usage monitoring",
    "Labor hours required for maintenance",
    "Licensing cost per protected asset",
    "Time to complete inventory updates",
    "Storage requirements for configuration backups"
  ],
  coverage: [
    "Percentage of assets with agent installed",
    "Number of assets inventoried / total assets",
    "Scan coverage across network segments",
    "Percentage of data classified according to policy",
    "Percentage of accounts with MFA enabled"
  ],
  friction: [
    "User satisfaction surveys",
    "Number of help desk tickets related to control",
    "Time added to common workflows",
    "Business process interruptions",
    "System performance impact during scans"
  ]
};

// Generate initial example rows for the framework
export const generateInitialFrameworkRows = (): FrameworkRow[] => {
  const rows: FrameworkRow[] = [];
  let id = 1;
  
  // Generate rows for each safeguard and its applicable asset subclasses
  controlGroups.forEach((group) => {
    group.controls.forEach((control) => {
      control.safeguards.forEach((safeguard) => {
        safeguard.applicable_asset_subclasses.forEach((subclassId) => {
          const subclass = allAssetSubclasses.find((sc) => sc.id === subclassId);
          if (subclass) {
            // Create a row for this safeguard + asset subclass combination
            const row: FrameworkRow = {
              id: `row-${id++}`,
              controlId: control.id,
              safeguardId: safeguard.id,
              assetClassId: subclass.classId,
              assetSubclassId: subclass.id,
              enforcementPoint: getDefaultEnforcementPoint(safeguard.id, subclass.id),
              attributes: {}
            };
            
            // Add example measurement methods for each attribute
            defaultAttributes.forEach((attr) => {
              const exampleList = exampleMethods[attr.id as keyof typeof exampleMethods];
              const randomIndex = Math.floor(Math.random() * exampleList.length);
              row.attributes[attr.id] = exampleList[randomIndex];
            });
            
            rows.push(row);
          }
        });
      });
    });
  });
  
  return rows;
};

// Default enforcement points based on safeguard and asset subclass
function getDefaultEnforcementPoint(safeguardId: string, subclassId: string): string {
  const mapping: Record<string, Record<string, string>> = {
    "1.1": {
      "endpoints": "MDM Solution",
      "servers": "CMDB",
      "mobile": "MDM Solution",
      "iot": "Network Discovery Tool",
      "lan": "IPAM",
      "wan": "Network Inventory System",
      "wireless": "Wireless Controller"
    },
    "1.2": {
      "endpoints": "NAC",
      "servers": "CMDB + NAC",
      "mobile": "MDM Solution",
      "iot": "IoT Security Gateway",
      "lan": "NAC",
      "wireless": "Wireless IPS"
    },
    "2.1": {
      "endpoints": "SCCM/EPP",
      "servers": "SCCM/Vulnerability Scanner",
      "mobile": "MDM Solution",
      "onprem": "SAM Tool",
      "cloud": "CSPM",
      "custom": "SDLC Process",
      "thirdparty": "Vendor Management System"
    },
    "2.2": {
      "onprem": "Vulnerability Scanner",
      "cloud": "CSPM",
      "custom": "SDLC Process",
      "thirdparty": "Vendor Risk Management"
    },
    "3.1": {
      "structured": "DLP Solution",
      "unstructured": "File Classification Tool",
      "cloud": "CASB"
    },
    "3.2": {
      "structured": "Database Discovery Tool",
      "unstructured": "Data Discovery Solution",
      "cloud": "CASB/CSPM"
    },
    "4.1": {
      "endpoints": "GPO/MDM",
      "servers": "Configuration Compliance Tool",
      "mobile": "MDM",
      "iot": "IoT Security Platform",
      "onprem": "Application Hardening Tool",
      "cloud": "CSPM"
    },
    "4.2": {
      "lan": "Network Configuration Manager",
      "wan": "SD-WAN Controller",
      "wireless": "Wireless Controller"
    },
    "5.1": {
      "employees": "IAM System",
      "contractors": "IAM System",
      "privileged": "PAM Solution"
    },
    "5.2": {
      "employees": "Password Manager",
      "contractors": "Password Manager",
      "privileged": "PAM Solution",
      "endpoints": "Password Manager",
      "servers": "PAM Solution"
    },
    "6.1": {
      "employees": "IAM/IGA Solution",
      "contractors": "IAM/IGA Solution",
      "privileged": "PAM Solution"
    },
    "6.2": {
      "employees": "IAM/IGA Solution",
      "contractors": "IAM/IGA Solution",
      "privileged": "PAM Solution"
    }
  };
  
  if (mapping[safeguardId] && mapping[safeguardId][subclassId]) {
    return mapping[safeguardId][subclassId];
  }
  
  return "Manual Process";
}

// Generate initial example rows for the assessment
export const generateInitialAssessmentRows = (frameworkRows: FrameworkRow[]) => {
  return frameworkRows.map((row) => {
    const assessmentRow = {
      ...row,
      attributes: {} as Record<string, string>
    };
    
    // Generate assessment values for each attribute
    defaultAttributes.forEach((attr) => {
      if (attr.id === "coverage") {
        // Coverage as percentage
        assessmentRow.attributes[attr.id] = `${Math.floor(Math.random() * 100)}%`;
      } else {
        // Other attributes as High/Medium/Low
        const values = ["High", "Medium", "Low"];
        const randomIndex = Math.floor(Math.random() * values.length);
        assessmentRow.attributes[attr.id] = values[randomIndex];
      }
    });
    
    return assessmentRow;
  });
};
