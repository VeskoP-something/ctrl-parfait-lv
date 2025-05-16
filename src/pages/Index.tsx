
import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FrameworkTable from '@/components/framework-table';
import AddAttributeDialog from '@/components/add-attribute-dialog';
import ExportDialog from '@/components/export-dialog';
import { Attribute, FrameworkRow, AssessmentRow, TabType } from '@/types/security-types';
import { defaultAttributes, assetClasses, controlGroups, generateInitialFrameworkRows, generateInitialAssessmentRows } from '@/data/cis-controls';
import { exportData } from '@/utils/export-utils';
import { Download } from 'lucide-react';

const Index = () => {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('framework');
  const [attributes, setAttributes] = useState<Attribute[]>(defaultAttributes);
  const [frameworkRows, setFrameworkRows] = useState<FrameworkRow[]>(generateInitialFrameworkRows());
  const [assessmentRows, setAssessmentRows] = useState<AssessmentRow[]>(generateInitialAssessmentRows(generateInitialFrameworkRows()));
  
  // Dialogs
  const [isAddAttributeDialogOpen, setIsAddAttributeDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // Handle adding a new attribute
  const handleAddAttribute = useCallback((attribute: Attribute) => {
    setAttributes(prev => [...prev, attribute]);
    
    // Update existing rows to include the new attribute
    setFrameworkRows(prev => 
      prev.map(row => ({
        ...row,
        attributes: {
          ...row.attributes,
          [attribute.id]: ''
        }
      }))
    );
    
    setAssessmentRows(prev => 
      prev.map(row => ({
        ...row,
        attributes: {
          ...row.attributes,
          [attribute.id]: ''
        }
      }))
    );
  }, []);

  // Handle export
  const handleExport = useCallback((format: string) => {
    exportData(format, {
      tabType: activeTab,
      rows: activeTab === 'framework' ? frameworkRows : assessmentRows,
      attributes,
      controlGroups,
      assetClasses,
    });
  }, [activeTab, frameworkRows, assessmentRows, attributes]);

  // Descriptions based on tab
  const descriptions = {
    framework: "A framework to maintain the Tools, Techniques, Procedures used to measure and monitor the performance and reliability of security controls. It's based on CIS Critical Controls because they're simple yet comprehensive. Measurements can be defined per Asset Type, Asset Class, or Asset Subclass and per Safeguard depending on how many Enforcement Points (or Tools) you have for that Safeguard.",
    assessment: "Sample output from point in time assessment of control performance and reliability demonstrating the outcome of the measurements taken using the TTPs defined in the framework."
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Control Performance and Reliability Framework (CTRL_PaRFait)</h1>
        <p className="text-muted-foreground">
          A comprehensive framework for evaluating security control performance based on CIS Critical Controls
        </p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => setIsExportDialogOpen(true)}
        >
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <Tabs 
        defaultValue="framework" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="framework">Measurement Methods</TabsTrigger>
          <TabsTrigger value="assessment">Assessment Outcomes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="framework">
          <Card>
            <CardHeader>
              <CardTitle>Measurement Methods</CardTitle>
              <CardDescription>{descriptions.framework}</CardDescription>
            </CardHeader>
            <CardContent>
              <FrameworkTable
                tabType="framework"
                attributes={attributes}
                assetClasses={assetClasses}
                controlGroups={controlGroups}
                rows={frameworkRows}
                onRowsChange={setFrameworkRows}
                onAttributeAdd={() => setIsAddAttributeDialogOpen(true)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Outcomes</CardTitle>
              <CardDescription>{descriptions.assessment}</CardDescription>
            </CardHeader>
            <CardContent>
              <FrameworkTable
                tabType="assessment"
                attributes={attributes}
                assetClasses={assetClasses}
                controlGroups={controlGroups}
                rows={assessmentRows}
                onRowsChange={setAssessmentRows}
                onAttributeAdd={() => setIsAddAttributeDialogOpen(true)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <AddAttributeDialog
        open={isAddAttributeDialogOpen}
        onClose={() => setIsAddAttributeDialogOpen(false)}
        onAdd={handleAddAttribute}
      />
      
      <ExportDialog
        open={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default Index;
