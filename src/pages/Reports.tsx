import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { ScriptableContext } from 'chart.js';
import { Line } from 'react-chartjs-2';
import SpotlightCard from '../components/SpotlightCard';
import ScrollReveal from '../components/ScrollReveal';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LogEntry {
  id: string;
  item: string;
  prepared: number;
  consumed: number;
  wasted: number;
  date: string;
}

interface ReportsProps {
  logs: LogEntry[];
  onDeleteLog: (id: string) => void;
}

export default function Reports({ logs, onDeleteLog }: ReportsProps) {
  // 1. Calculations
  const totalPrepared = logs.reduce((sum, log) => sum + log.prepared, 0);
  const totalWasted = logs.reduce((sum, log) => sum + log.wasted, 0);
  const totalConsumed = logs.reduce((sum, log) => sum + log.consumed, 0);
  
  const wasteRatio = totalPrepared > 0 ? (totalWasted / totalPrepared) * 100 : 0;
  
  // Forecast: average daily consumption * 30 days + 7% safety margin
  const dailyAverageConsumption = logs.length > 0 ? totalConsumed / logs.length : 0;
  const prediction = dailyAverageConsumption * 30 * 1.07;

  // 2. Chart Configurations
  const sortedLogs = [...logs].reverse();
  
  const chartData = {
    labels: sortedLogs.map(log => log.date),
    datasets: [
      {
        label: 'Prepared (kg)',
        data: sortedLogs.map(log => log.prepared),
        borderColor: '#ff9000',
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(255, 144, 0, 0.25)');
          gradient.addColorStop(1, 'rgba(255, 144, 0, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: '#ff9000',
        pointHoverRadius: 6
      },
      {
        label: 'Wasted (kg)',
        data: sortedLogs.map(log => log.wasted),
        borderColor: '#ef4444',
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: '#ef4444',
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#111827',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        titleFont: { family: 'Outfit', size: 13 },
        bodyFont: { family: 'Inter', size: 12 }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#9ca3af',
          font: { family: 'Inter' }
        }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#9ca3af',
          font: { family: 'Inter' }
        }
      }
    }
  };

  return (
    <main className="container">
      {/* KPI Stats */}
      <ScrollReveal delay={0.05}>
        <section id="stats-section">
          <h2 id="overview-heading">Wastage Overview & Forecast</h2>
          <p>Real-time analytics and predictive models generated from logged food details.</p>
          
          <div className="data-summary">
            <SpotlightCard id="card-prepared" glowColor="rgba(255, 144, 0, 0.12)">
              <h3>Total Prepared</h3>
              <p id="stat-prepared">{Math.round(totalPrepared * 10) / 10} kg</p>
            </SpotlightCard>
            
            <SpotlightCard id="card-wasted" className="danger" glowColor="rgba(239, 68, 68, 0.12)">
              <h3>Total Wasted</h3>
              <p id="stat-wasted">{Math.round(totalWasted * 10) / 10} kg</p>
            </SpotlightCard>
            
            <SpotlightCard id="card-ratio" glowColor="rgba(255, 75, 43, 0.12)">
              <h3>Waste Ratio</h3>
              <p id="stat-ratio">{Math.round(wasteRatio * 10) / 10}%</p>
            </SpotlightCard>
            
            <SpotlightCard id="card-prediction" className="highlight" glowColor="rgba(255, 75, 43, 0.15)">
              <h3>Next Month Forecast</h3>
              <p id="stat-prediction">{Math.round(prediction)} kg</p>
            </SpotlightCard>
          </div>
        </section>
      </ScrollReveal>

      {/* Visual Chart */}
      {logs.length > 0 && (
        <ScrollReveal delay={0.1}>
          <section id="chart-section">
            <h2>Food Consumption Trends</h2>
            <p style={{ marginBottom: '1.5rem' }}>Visual comparison of food prepared vs wasted over time.</p>
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Daily Logs Table */}
      <ScrollReveal delay={0.15}>
        <section id="logs-section">
          <h2>Daily Log History</h2>
          <p>Detailed view of all registered food entries. Click delete to remove inaccurate entries.</p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Food Item</th>
                  <th>Prepared (kg)</th>
                  <th>Consumed (kg)</th>
                  <th>Wasted (kg)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No logged entries available. Please upload records to see data.
                    </td>
                  </tr>
                ) : (
                  logs.map(log => {
                    const ratio = log.prepared > 0 ? (log.wasted / log.prepared) : 0;
                    let statusBadge = null;
                    if (ratio > 0.15) {
                      statusBadge = <span className="badge badge-danger">High Waste</span>;
                    } else if (ratio > 0.05) {
                      statusBadge = <span className="badge badge-warning">Moderate</span>;
                    } else {
                      statusBadge = <span className="badge badge-success">Optimal</span>;
                    }

                    return (
                      <tr key={log.id}>
                        <td><b>{log.date}</b></td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            {log.item} {statusBadge}
                          </span>
                        </td>
                        <td>{log.prepared} kg</td>
                        <td>{log.consumed} kg</td>
                        <td>
                          <span style={ratio > 0.15 ? { color: 'var(--danger)', fontWeight: 500 } : {}}>
                            {log.wasted} kg
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-delete" 
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete the log for '${log.item}'?`)) {
                                onDeleteLog(log.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
