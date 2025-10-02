export interface WeightLog {
  date: string;
  weight: number;
}

const STORAGE_KEY = 'weight-tracker-logs';

export const loadLogs = (): WeightLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading logs:', error);
    return [];
  }
};

export const saveLogs = (logs: WeightLog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving logs:', error);
  }
};

export const exportLogs = (logs: WeightLog[]): void => {
  const dataStr = JSON.stringify(logs, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `weight-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importLogs = (file: File): Promise<WeightLog[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const logs = JSON.parse(e.target?.result as string);
        if (Array.isArray(logs)) {
          resolve(logs);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

export const exportCSVTemplate = (): void => {
  const csvContent = 'date,weight\n2025-01-01,70.5\n2025-01-02,70.3';
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'weight-tracker-template.csv';
  link.click();
  URL.revokeObjectURL(url);
};

export const exportCSV = (logs: WeightLog[]): void => {
  const header = 'date,weight\n';
  const rows = logs
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(log => `${log.date},${log.weight}`)
    .join('\n');
  const csvContent = header + rows;
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `weight-tracker-data-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const parseDate = (dateString: string): string | null => {
  const trimmed = dateString.trim();
  
  // Try YYYY-MM-DD format first
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) return trimmed;
  }
  
  // Try DD-MM-YY or DD-MM-YYYY format
  const ddmmRegex = /^(\d{2})-(\d{2})-(\d{2,4})$/;
  const ddmmMatch = trimmed.match(ddmmRegex);
  if (ddmmMatch) {
    let [, day, month, year] = ddmmMatch;
    // Convert 2-digit year to 4-digit (assuming 20xx for years 00-99)
    if (year.length === 2) {
      year = '20' + year;
    }
    const isoDate = `${year}-${month}-${day}`;
    const date = new Date(isoDate);
    if (!isNaN(date.getTime())) return isoDate;
  }
  
  // Try DD/MM/YY or DD/MM/YYYY format
  const ddmmSlashRegex = /^(\d{2})\/(\d{2})\/(\d{2,4})$/;
  const ddmmSlashMatch = trimmed.match(ddmmSlashRegex);
  if (ddmmSlashMatch) {
    let [, day, month, year] = ddmmSlashMatch;
    if (year.length === 2) {
      year = '20' + year;
    }
    const isoDate = `${year}-${month}-${day}`;
    const date = new Date(isoDate);
    if (!isNaN(date.getTime())) return isoDate;
  }
  
  return null;
};

export const importCSV = (file: File): Promise<WeightLog[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.trim().split('\n');
        
        if (lines.length < 2) {
          reject(new Error('CSV file is empty'));
          return;
        }
        
        const logs: WeightLog[] = [];
        const errors: string[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const [date, weight] = lines[i].split(',');
          const weightNum = parseFloat(weight?.trim());
          const parsedDate = parseDate(date);
          
          if (parsedDate && !isNaN(weightNum) && weightNum > 0) {
            logs.push({ date: parsedDate, weight: weightNum });
          } else {
            errors.push(`Row ${i + 1}: Invalid data (date: ${date?.trim()}, weight: ${weight?.trim()})`);
          }
        }
        
        if (logs.length === 0) {
          reject(new Error('No valid entries found in CSV. Supported formats: YYYY-MM-DD, DD-MM-YY, DD/MM/YYYY'));
          return;
        }
        
        resolve(logs);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};
