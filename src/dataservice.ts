// src/data-service.ts
export interface DataPoint {
  id: number;
  category: string;
  value: number;
  timestamp: number; // ms since epoch
}

export type DataCallback = (data: DataPoint[]) => void;

export class DataService {
  private data: DataPoint[] = [];
  private categories: string[] = ['A', 'B', 'C'];
  private intervalId: number | null = null;
  private listeners: Set<DataCallback> = new Set();
  private idCounter = 1;

  constructor() {
    this.data = this.generateInitialData();
  }

  // Generate some historic/mock data
  private generateInitialData(count = 30): DataPoint[] {
    const now = Date.now();
    const arr: DataPoint[] = [];
    for (let i = 0; i < count; i++) {
      for (const cat of this.categories) {
        arr.push({
          id: this.idCounter++,
          category: cat,
          value: Math.round(20 + Math.random() * 80),
          timestamp: now - (count - i) * 1000 * 60, // minute spacing
        });
      }
    }
    return arr;
  }

  // Return a shallow copy
  getAll(): DataPoint[] {
    return [...this.data];
  }

  // Filters by category and optional date range (ms)
  filter(params: { category?: string; from?: number; to?: number }): DataPoint[] {
    return this.data.filter(dp => {
      if (params.category && dp.category !== params.category) return false;
      if (params.from && dp.timestamp < params.from) return false;
      if (params.to && dp.timestamp > params.to) return false;
      return true;
    });
  }

  // Subscribe to realtime updates
  subscribe(cb: DataCallback) {
    this.listeners.add(cb);
    // Immediately send current snapshot
    cb(this.getAll());
    return () => {
      this.listeners.delete(cb);
    };
  }

  // Start simulating realtime data (push new DataPoint regularly)
  startRealtime(intervalMs = 1500) {
    if (this.intervalId != null) return;
    this.intervalId = window.setInterval(() => {
      // create 1-3 new points
      const now = Date.now();
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const cat = this.categories[Math.floor(Math.random() * this.categories.length)];
        const dp: DataPoint = {
          id: this.idCounter++,
          category: cat,
          value: Math.round(10 + Math.random() * 90),
          timestamp: now + i, // slightly different ms
        };
        this.data.push(dp);
      }
      // keep data size bounded
      if (this.data.length > 2000) {
        this.data.splice(0, this.data.length - 1200);
      }
      // Notify listeners with latest copy
      const snapshot = this.getAll();
      this.listeners.forEach(l => l(snapshot));
    }, intervalMs);
  }

  stopRealtime() {
    if (this.intervalId != null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Utility: summarize by category (last N points)
  summarizeByCategory(lastNPoints = 50) {
    const last = this.data.slice(-lastNPoints);
    const map = new Map<string, number>();
    for (const dp of last) {
      map.set(dp.category, (map.get(dp.category) || 0) + dp.value);
    }
    return Array.from(map.entries()).map(([category, value]) => ({ category, value }));
  }
}
