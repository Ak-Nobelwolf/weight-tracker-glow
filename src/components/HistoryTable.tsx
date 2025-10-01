import { Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { WeightLog } from '@/utils/storage';

interface HistoryTableProps {
  logs: WeightLog[];
  onDelete: (date: string) => void;
}

export const HistoryTable = ({ logs, onDelete }: HistoryTableProps) => {
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedLogs.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-foreground">History</h2>
        <div className="text-center py-12 text-muted-foreground">
          No weight logs yet. Start tracking your progress!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">History</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Weight</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.map((log, index) => (
              <tr 
                key={log.date} 
                className={`border-b border-border last:border-0 ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/30'
                }`}
              >
                <td className="py-3 px-4 text-foreground font-medium">
                  {format(parseISO(log.date), 'yyyy-MM-dd')}
                </td>
                <td className="py-3 px-4 text-foreground font-semibold">
                  {log.weight.toFixed(1)} kg
                </td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(log.date)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
