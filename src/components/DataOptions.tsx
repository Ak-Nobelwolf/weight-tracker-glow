import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { WeightLog, exportLogs, importLogs } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface DataOptionsProps {
  logs: WeightLog[];
  onImport: (logs: WeightLog[]) => void;
}

export const DataOptions = ({ logs, onImport }: DataOptionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    exportLogs(logs);
    toast({
      title: 'Data exported',
      description: 'Your weight logs have been downloaded as JSON.',
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedLogs = await importLogs(file);
      const confirmed = window.confirm(
        `This will replace your current ${logs.length} log(s) with ${importedLogs.length} imported log(s). Continue?`
      );
      
      if (confirmed) {
        onImport(importedLogs);
        toast({
          title: 'Data imported',
          description: `Successfully imported ${importedLogs.length} weight logs.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Invalid file format. Please select a valid JSON backup file.',
        variant: 'destructive',
      });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Backup & Restore</h2>
      
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2"
          disabled={logs.length === 0}
        >
          <Download className="w-4 h-4" />
          Export Data
        </Button>
        
        <Button 
          onClick={handleImportClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Import Data
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground">
        Export your data as JSON or import from a backup file.
      </p>
    </div>
  );
};
