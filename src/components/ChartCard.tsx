import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { WeightLog } from '@/utils/storage';

interface ChartCardProps {
  logs: WeightLog[];
}

export const ChartCard = ({ logs }: ChartCardProps) => {
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedLogs.map(log => ({
    date: format(parseISO(log.date), 'MMM dd'),
    fullDate: log.date,
    weight: log.weight,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Progress Chart</h2>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data to display. Start logging your weight!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Progress Chart</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '0.875rem' }}
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number) => [`${value} kg`, 'Weight']}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
