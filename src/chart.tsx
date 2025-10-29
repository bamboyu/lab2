/** @jsx createElement */
import { createElement, VNode } from './jsx-runtime';
/**
 * Chart component using HTML5 Canvas.
 * Exports:
 *  - Chart component: renders a <canvas> and provides a ref to it
 *  - drawChart(canvas, props): imperative helper to draw given data & type
 */

export type ChartType = 'bar' | 'line' | 'pie';

export interface ChartData {
  label: string;
  value: number;
}

export interface ChartProps {
  data: ChartData[];           // aggregated data to draw
  type?: ChartType;            // 'bar' | 'line' | 'pie'
  width?: number;
  height?: number;
  onHover?: (item?: ChartData, x?: number, y?: number) => void;
  onClick?: (item?: ChartData, x?: number, y?: number) => void;
  className?: string;
  style?: any;
}

function clearCanvas(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
}

// Utility: get colors for slices / bars
function palette(idx: number) {
  const colors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1'];
  return colors[idx % colors.length];
}

// Draw helpers
export function drawBarChart(canvas: HTMLCanvasElement, data: ChartData[], opts: ChartProps = {
    data: []
}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  clearCanvas(ctx, w, h);

  const padding = 30;
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;
  const max = Math.max(...data.map(d => d.value), 1);
  const barW = innerW / data.length * 0.7;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '12px sans-serif';

  data.forEach((d, i) => {
    const x = padding + (i + 0.5) * (innerW / data.length);
    const hBar = (d.value / max) * innerH;
    const y = padding + (innerH - hBar);
    ctx.fillStyle = palette(i);
    ctx.fillRect(x - barW / 2, y, barW, hBar);
    ctx.fillStyle = '#000';
    ctx.fillText(String(d.value), x, y - 10);
    ctx.fillText(d.label, x, padding + innerH + 12);
  });
}

export function drawLineChart(canvas: HTMLCanvasElement, data: ChartData[], opts: ChartProps = {
    data: []
}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  clearCanvas(ctx, w, h);

  const padding = 30;
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;
  const max = Math.max(...data.map(d => d.value), 1);

  ctx.beginPath();
  data.forEach((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * innerW;
    const y = padding + innerH - (d.value / max) * innerH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#4e79a7';
  ctx.lineWidth = 2;
  ctx.stroke();

  // draw points
  ctx.fillStyle = '#4e79a7';
  data.forEach((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * innerW;
    const y = padding + innerH - (d.value / max) * innerH;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawPieChart(canvas: HTMLCanvasElement, data: ChartData[], opts: ChartProps = {
    data: []
}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  clearCanvas(ctx, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) / 2 - 20;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let start = -Math.PI / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '12px sans-serif';

  data.forEach((d, i) => {
    const slice = (d.value / total) * Math.PI * 2;
    const end = start + slice;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = palette(i);
    ctx.fill();

    // label
    const mid = (start + end) / 2;
    const lx = cx + Math.cos(mid) * (radius * 0.6);
    const ly = cy + Math.sin(mid) * (radius * 0.6);
    ctx.fillStyle = '#fff';
    ctx.fillText(d.label, lx, ly);
    start = end;
  });
}

/**
 * Generic draw helper that picks the right renderer
 */
export function drawChart(canvas: HTMLCanvasElement, props: ChartProps) {
  const data = props.data || [];
  const type = props.type || 'bar';
  // make canvas dpi-aware
  const ratio = window.devicePixelRatio || 1;
  const width = props.width || 600;
  const height = props.height || 300;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  if (type === 'bar') drawBarChart(canvas, data, props);
  else if (type === 'line') drawLineChart(canvas, data, props);
  else if (type === 'pie') drawPieChart(canvas, data, props);
}

/**
 * Chart component: renders a canvas and calls a ref with the element
 */
export const Chart = (props: ChartProps & { canvasRef?: (el: HTMLCanvasElement | null) => void }): VNode => {
  // chart is purely DOM-canvas based; initial draw is performed by parent via drawChart
  // we just return <canvas ref=... />
  const { width = 600, height = 300, className, style, canvasRef } = props;
  return (
    <canvas
      width={width}
      height={height}
      className={className}
      style={style}
      ref={canvasRef ? (el: any) => canvasRef(el as HTMLCanvasElement) : undefined}
    />
  );
};
