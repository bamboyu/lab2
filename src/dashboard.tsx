/** @jsx createElement */
import { createElement, useState, mount, VNode } from './jsx-runtime';
import { DataService, DataPoint } from './dataservice';
import { Chart, drawChart, ChartData, ChartType } from './chart';
import { Card } from './components'; // assumes you have components.tsx in src/

// Utility: aggregate raw DataPoint[] into ChartData[] grouped by category
function aggregateByCategory(data: DataPoint[]): ChartData[] {
  const map = new Map<string, number>();
  for (const d of data) {
    map.set(d.category, (map.get(d.category) || 0) + d.value);
  }
  const arr: ChartData[] = [];
  for (const [label, value] of map.entries()) arr.push({ label, value });
  // sort for stable order
  arr.sort((a, b) => b.value - a.value);
  return arr;
}

const dashboardStyle = {
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  boxSizing: 'border-box',
};

// Dashboard component
export const Dashboard = (): VNode => {
  const dataService = new DataService();
  const [getChartType, setChartType] = useState<ChartType>('bar');
  const [getRunning, setRunning] = useState(true);
  const [getCategory, setCategory] = useState<string | undefined>(undefined);
  const [getDataSnapshot, setDataSnapshot] = useState<DataPoint[]>(dataService.getAll());

  // canvas ref storage
  let canvasEl: HTMLCanvasElement | null = null;

  // subscribe to data updates imperatively
  const attached = (() => {
    let unsub: () => void;
    // subscribe once; the callback will update the snapshot and redraw the canvas
    unsub = dataService.subscribe((snapshot: any[]) => {
      setDataSnapshot(snapshot);
      // redraw chart immediately if canvas present
      if (canvasEl) {
        const filtered = getCategory() ? snapshot.filter(d => d.category === getCategory()) : snapshot;
        const chartData = aggregateByCategory(filtered);
        drawChart(canvasEl, { data: chartData, type: getChartType(), width: 700, height: 360 });
      }
    });
    // start realtime if requested
    if (getRunning()) dataService.startRealtime(1200);
    return () => {
      // cleanup hook (not used currently)
      unsub();
      dataService.stopRealtime();
    };
  })();

  // handler: change chart type
  const handleChartChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    setChartType(target.value as ChartType);
    if (canvasEl) {
      const snapshot = getDataSnapshot();
      const filtered = getCategory() ? snapshot.filter(d => d.category === getCategory()) : snapshot;
      drawChart(canvasEl, { data: aggregateByCategory(filtered), type: target.value as ChartType, width: 700, height: 360 });
    }
  };

  // handler: toggle realtime
  const toggleRealtime = () => {
    const now = !getRunning();
    setRunning(now);
    if (now) dataService.startRealtime(1200);
    else dataService.stopRealtime();
  };

  // handler: category filter
  const handleCategoryChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value;
    setCategory(value === '__all' ? undefined : value);
    // redraw using new filter
    if (canvasEl) {
      const snapshot = getDataSnapshot();
      const filtered = value === '__all' ? snapshot : snapshot.filter(d => d.category === value);
      drawChart(canvasEl, { data: aggregateByCategory(filtered), type: getChartType(), width: 700, height: 360 });
    }
  };

  // on mount we draw initial chart via canvasRef
  const canvasRef = (el: HTMLCanvasElement | null) => {
    canvasEl = el;
    if (!canvasEl) return;
    // initial draw
    const snapshot = getDataSnapshot();
    const filtered = getCategory() ? snapshot.filter(d => d.category === getCategory()) : snapshot;
    drawChart(canvasEl, { data: aggregateByCategory(filtered), type: getChartType(), width: 700, height: 360 });
  };

  // small summary numbers
  const totalPoints = getDataSnapshot().length;
  const totalValue = getDataSnapshot().reduce((s, d) => s + d.value, 0);

  return (
    <div style={dashboardStyle}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Analytics Dashboard</h1>
        <div>
          <label style={{ marginRight: 8 }}>
            Chart
            <select onChange={handleChartChange as any} style={{ marginLeft: 8 }}>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </label>

          <label style={{ marginLeft: 12 }}>
            Category
            <select onChange={handleCategoryChange as any} style={{ marginLeft: 8 }}>
              <option value="__all">All</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </label>

          <button onClick={toggleRealtime} style={{ marginLeft: 12 }}>
            {getRunning() ? 'Pause' : 'Start'}
          </button>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: 20 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Total points:</strong> {totalPoints} <br />
              <strong>Total value:</strong> {totalValue}
            </div>
            <div>
              <button onClick={() => { /* simple manual redraw */ if (canvasEl) drawChart(canvasEl, { data: aggregateByCategory(getDataSnapshot()), type: getChartType(), width: 700, height: 360 }); }}>Refresh</button>
            </div>
          </div>
        </Card>

        <Card>
          {/* Chart component: parent manages drawing via canvasRef */}
          <Chart canvasRef={canvasRef} width={700} height={360} data={[]} type={getChartType()} />
        </Card>
      </main>
    </div>
  );
};
