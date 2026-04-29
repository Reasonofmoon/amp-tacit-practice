import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { ACTIVITIES, AXES } from '../data/activities';
import { DEV_ACTIVITIES, DEV_AXES } from '../data/developerActivities';

/* ───────────────────────────────────────────────
 *  Paper/ink palette — one accent per axis
 * ─────────────────────────────────────────────── */
const AXIS_COLORS = {
  // Director axes
  counseling: '#2E5BFF', // ink-blue
  teaching:   '#7CB342', // sage
  management: '#F4B740', // mustard
  crisis:     '#FF6B6B', // coral
  leadership: '#B794F4', // lavender
  // Developer axes
  debugging:    '#2E5BFF',
  architecture: '#7CB342',
  automation:   '#F4B740',
  optimization: '#FF6B6B',
};

const PAPER_BG = '#FDFBF7';
const PAPER_LINE = '#E8DFCE';
const INK_900 = '#1A1915';
const INK_500 = '#7A746A';

/* ───────────────────────────────────────────────
 *  Recursive string collector — extracts every
 *  meaningful answer/note from nested activity data.
 * ─────────────────────────────────────────────── */
function collectInsightStrings(value, bucket, minLen = 8) {
  if (!value) return;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length >= minLen && trimmed !== 'Skipped') bucket.push(trimmed);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => collectInsightStrings(entry, bucket, minLen));
    return;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((entry) => collectInsightStrings(entry, bucket, minLen));
  }
}

/* ───────────────────────────────────────────────
 *  Build graph from activity data
 *  Hub: 5 axis nodes. Leaves: every meaningful string answer.
 * ─────────────────────────────────────────────── */
function buildGraphData(axisScores, activityData, isDev) {
  const targetActivities = isDev ? DEV_ACTIVITIES : ACTIVITIES;
  const nodes = [];
  const edges = [];

  axisScores.forEach((axis) => {
    nodes.push({
      id: `axis-${axis.key}`,
      type: 'axis',
      label: axis.label,
      score: axis.score,
      color: AXIS_COLORS[axis.key] || INK_900,
      radius: 28 + axis.score * 0.18,
    });
  });

  const MAX_LEAVES_PER_ACTIVITY = 6;

  let insightIdx = 0;
  targetActivities.forEach((activity) => {
    const data = activityData?.[activity.id];
    if (!data) return;

    const collected = [];
    collectInsightStrings(data, collected);
    if (collected.length === 0) return;

    // De-duplicate similar answers (case-insensitive prefix match) and cap.
    const seen = new Set();
    const uniqueLeaves = [];
    for (const text of collected) {
      const key = text.toLowerCase().slice(0, 24);
      if (seen.has(key)) continue;
      seen.add(key);
      uniqueLeaves.push(text);
      if (uniqueLeaves.length >= MAX_LEAVES_PER_ACTIVITY) break;
    }

    const activityAxes = Object.keys(activity.axis || {});
    const primaryAxis = activityAxes[0];
    const color = AXIS_COLORS[primaryAxis] || INK_500;

    uniqueLeaves.forEach((text) => {
      const nodeId = `insight-${insightIdx++}`;
      nodes.push({
        id: nodeId,
        type: 'insight',
        label: text.length > 36 ? text.slice(0, 36) + '…' : text,
        fullText: text,
        activityTitle: activity.title,
        activityIcon: activity.icon ?? '📝',
        color,
        radius: 7,
      });
      activityAxes.forEach((axisKey) => {
        edges.push({
          source: `axis-${axisKey}`,
          target: nodeId,
          strength: (activity.axis[axisKey] ?? 1) / 3,
          color: AXIS_COLORS[axisKey] || INK_500,
        });
      });
    });
  });

  return { nodes, edges };
}

/* ───────────────────────────────────────────────
 *  Continuous force simulation (no d3 dependency)
 *  Runs on requestAnimationFrame for smooth interaction.
 * ─────────────────────────────────────────────── */
function initPositions(nodes, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const axisNodes = nodes.filter((n) => n.type === 'axis');
  axisNodes.forEach((n, i) => {
    const angle = (i / axisNodes.length) * Math.PI * 2 - Math.PI / 2;
    const r = Math.min(width, height) * 0.30;
    n.x = cx + Math.cos(angle) * r;
    n.y = cy + Math.sin(angle) * r;
    n.vx = 0;
    n.vy = 0;
    n.fx = n.x;
    n.fy = n.y;
  });
  nodes.filter((n) => n.type === 'insight').forEach((n, i) => {
    const angle = (i * 137.508) * (Math.PI / 180); // golden-angle scatter
    const r = 30 + (i % 5) * 18;
    n.x = cx + Math.cos(angle) * r;
    n.y = cy + Math.sin(angle) * r;
    n.vx = 0;
    n.vy = 0;
  });
}

function stepSimulation(nodes, edges, nodeMap, alpha = 0.15) {
  // Repulsion (Coulomb-like, only check nearby pairs above threshold)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const minDist = a.radius + b.radius + (a.type === 'axis' || b.type === 'axis' ? 24 : 14);
      if (dist < minDist * 1.5) {
        const force = ((minDist - dist) / dist) * 0.4 * alpha;
        const fx = dx * force;
        const fy = dy * force;
        if (a.fx == null) { a.vx -= fx; a.vy -= fy; }
        if (b.fx == null) { b.vx += fx; b.vy += fy; }
      }
    }
  }

  // Attraction along edges
  edges.forEach((e) => {
    const a = nodeMap[e.source];
    const b = nodeMap[e.target];
    if (!a || !b) return;
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const idealDist = 70 + (1 - (e.strength ?? 0.5)) * 40;
    const force = ((dist - idealDist) / dist) * 0.06 * alpha;
    const fx = dx * force;
    const fy = dy * force;
    if (a.fx == null) { a.vx += fx; a.vy += fy; }
    if (b.fx == null) { b.vx -= fx; b.vy -= fy; }
  });

  // Apply velocities + damping
  let totalEnergy = 0;
  nodes.forEach((n) => {
    if (n.fx != null) { n.x = n.fx; n.y = n.fy; n.vx = 0; n.vy = 0; return; }
    n.vx *= 0.82;
    n.vy *= 0.82;
    n.x += n.vx;
    n.y += n.vy;
    totalEnergy += n.vx * n.vx + n.vy * n.vy;
  });
  return totalEnergy;
}

/* ───────────────────────────────────────────────
 *  Component
 * ─────────────────────────────────────────────── */
export default function KnowledgeGraph({ axisScores, activityData, isDev }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const dragNodeRef = useRef(null);
  const panRef = useRef({ x: 0, y: 0, dragging: false, startX: 0, startY: 0 });
  const zoomRef = useRef(1);
  const animationRef = useRef(null);
  const graphRef = useRef({ nodes: [], edges: [], nodeMap: {} });

  const [tooltip, setTooltip] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ w: 600, h: 460 });

  const graph = useMemo(() => {
    const built = buildGraphData(axisScores, activityData, isDev);
    if (built.nodes.length > 0) {
      initPositions(built.nodes, dimensions.w, dimensions.h);
    }
    const map = {};
    built.nodes.forEach((n) => { map[n.id] = n; });
    built.nodeMap = map;
    return built;
  }, [axisScores, activityData, isDev, dimensions.w, dimensions.h]);

  useEffect(() => {
    graphRef.current = graph;
    panRef.current = { x: 0, y: 0, dragging: false, startX: 0, startY: 0 };
    zoomRef.current = 1;
  }, [graph]);

  // Responsive sizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDimensions({ w: width, h: Math.max(360, Math.min(520, width * 0.72)) });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  /* ── Drawing ───────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = graphRef.current;
    if (g.nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = dimensions.w;
    const h = dimensions.h;
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Paper background with subtle grain
    ctx.fillStyle = PAPER_BG;
    ctx.fillRect(0, 0, w, h);

    // Subtle horizontal ruled lines
    ctx.strokeStyle = PAPER_LINE;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.5;
    const rule = 28;
    for (let y = rule; y < h; y += rule) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Apply pan + zoom
    const pan = panRef.current;
    const zoom = zoomRef.current;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-w / 2 + pan.x, -h / 2 + pan.y);

    // Draw edges first (under nodes)
    g.edges.forEach((e) => {
      const a = g.nodeMap[e.source];
      const b = g.nodeMap[e.target];
      if (!a || !b) return;
      const isHovered = (selectedNode && (selectedNode === a.id || selectedNode === b.id))
        || (tooltip && (tooltip.id === a.id || tooltip.id === b.id));

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      // Slight curve for visual interest
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const offset = 6;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const cx = mx + (-dy / len) * offset;
      const cy = my + (dx / len) * offset;
      ctx.quadraticCurveTo(cx, cy, b.x, b.y);
      ctx.strokeStyle = isHovered
        ? e.color
        : e.color + '55';
      ctx.lineWidth = isHovered ? 2 : 1 + (e.strength || 0.5) * 0.8;
      ctx.stroke();
    });

    // Draw nodes
    g.nodes.forEach((n) => {
      const isHovered = (tooltip && tooltip.id === n.id) || selectedNode === n.id;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

      if (n.type === 'axis') {
        // Axis hub: solid ink-style fill + ring
        const grad = ctx.createRadialGradient(n.x - n.radius * 0.3, n.y - n.radius * 0.3, 0, n.x, n.y, n.radius);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, n.color + 'D8');
        ctx.fillStyle = grad;
        ctx.fill();

        // Outer hand-drawn-style ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = n.color + (isHovered ? 'FF' : '60');
        ctx.lineWidth = isHovered ? 3 : 1.5;
        ctx.setLineDash(isHovered ? [] : [4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Pretendard Variable, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y - 6);
        // Score
        ctx.font = 'bold 14px Gaegu, "Pretendard Variable", sans-serif';
        ctx.fillText(String(n.score), n.x, n.y + 9);
      } else {
        // Insight node: ink dot, hovered → larger halo
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = n.color + '22';
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.strokeStyle = INK_900;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });

    ctx.restore();
  }, [dimensions, tooltip, selectedNode]);

  /* ── Animation loop ──────────────────────────── */
  useEffect(() => {
    let alpha = 0.6;
    let lastTime = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(now - lastTime, 100);
      lastTime = now;

      const g = graphRef.current;
      if (g && g.nodes.length > 0) {
        const energy = stepSimulation(g.nodes, g.edges, g.nodeMap, alpha);
        // Decay alpha; if user is dragging or things are still moving, keep going
        const isDragging = !!dragNodeRef.current;
        if (energy < 0.05 && !isDragging) {
          alpha = Math.max(0.02, alpha * 0.96);
        } else {
          alpha = Math.min(0.6, alpha + dt * 0.0005);
        }
        draw();
      }
      animationRef.current = window.requestAnimationFrame(tick);
    };
    animationRef.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationRef.current);
  }, [draw]);

  /* ── Hit test (in graph coordinates accounting for pan/zoom) ── */
  const screenToGraph = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const w = dimensions.w;
    const h = dimensions.h;
    const zoom = zoomRef.current;
    const pan = panRef.current;
    const gx = (sx - w / 2) / zoom + w / 2 - pan.x;
    const gy = (sy - h / 2) / zoom + h / 2 - pan.y;
    return { sx, sy, gx, gy };
  }, [dimensions]);

  const findNodeAt = useCallback((clientX, clientY) => {
    const { gx, gy, sx, sy } = screenToGraph(clientX, clientY);
    const g = graphRef.current;
    for (let i = g.nodes.length - 1; i >= 0; i--) {
      const n = g.nodes[i];
      const dx = n.x - gx;
      const dy = n.y - gy;
      if (dx * dx + dy * dy <= (n.radius + 5) * (n.radius + 5)) {
        return { node: n, screenX: sx, screenY: sy };
      }
    }
    return null;
  }, [screenToGraph]);

  /* ── Event handlers ──────────────────────────── */
  const handlePointerMove = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (dragNodeRef.current) {
      const { gx, gy } = screenToGraph(clientX, clientY);
      dragNodeRef.current.x = gx;
      dragNodeRef.current.y = gy;
      dragNodeRef.current.vx = 0;
      dragNodeRef.current.vy = 0;
      return;
    }
    if (panRef.current.dragging) {
      panRef.current.x = panRef.current.startX + (clientX - panRef.current.startCX);
      panRef.current.y = panRef.current.startY + (clientY - panRef.current.startCY);
      return;
    }

    const hit = findNodeAt(clientX, clientY);
    if (hit) {
      setTooltip({
        id: hit.node.id,
        x: hit.screenX,
        y: hit.screenY,
        title: hit.node.type === 'axis' ? `${hit.node.label} (${hit.node.score}점)` : hit.node.activityTitle,
        icon: hit.node.activityIcon,
        text: hit.node.fullText ?? `${hit.node.label} 영역의 ${hit.node.score}점`,
        color: hit.node.color,
      });
      canvasRef.current.style.cursor = hit.node.type === 'insight' ? 'grab' : 'pointer';
    } else {
      setTooltip(null);
      canvasRef.current.style.cursor = panRef.current.dragging ? 'grabbing' : 'default';
    }
  }, [findNodeAt, screenToGraph]);

  const handlePointerDown = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const hit = findNodeAt(clientX, clientY);
    if (hit && hit.node.type === 'insight') {
      hit.node.fx = null;
      hit.node.fy = null;
      dragNodeRef.current = hit.node;
      setSelectedNode(hit.node.id);
      canvasRef.current.style.cursor = 'grabbing';
    } else if (hit && hit.node.type === 'axis') {
      setSelectedNode(hit.node.id);
    } else {
      // Begin pan
      panRef.current = {
        ...panRef.current,
        dragging: true,
        startX: panRef.current.x,
        startY: panRef.current.y,
        startCX: clientX,
        startCY: clientY,
      };
      canvasRef.current.style.cursor = 'grabbing';
      setSelectedNode(null);
    }
  }, [findNodeAt]);

  const handlePointerUp = useCallback(() => {
    if (dragNodeRef.current) {
      dragNodeRef.current = null;
    }
    panRef.current.dragging = false;
    if (canvasRef.current) canvasRef.current.style.cursor = 'default';
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    zoomRef.current = Math.max(0.5, Math.min(2.5, zoomRef.current + delta));
  }, []);

  const resetView = useCallback(() => {
    zoomRef.current = 1;
    panRef.current = { x: 0, y: 0, dragging: false, startX: 0, startY: 0 };
    setSelectedNode(null);
  }, []);

  if (graph.nodes.length === 0) {
    return (
      <div className="kg-empty">
        <p>✨ 활동 답변이 쌓이면 지식그래프가 자동으로 그려집니다.</p>
      </div>
    );
  }

  const insightCount = graph.nodes.filter((n) => n.type === 'insight').length;
  const edgeCount = graph.edges.length;

  return (
    <div className="kg-container" ref={containerRef}>
      <div className="kg-toolbar">
        <span className="kg-stat">
          <strong>{graph.nodes.filter((n) => n.type === 'axis').length}</strong> 축 ·
          <strong> {insightCount}</strong> 인사이트 ·
          <strong> {edgeCount}</strong> 연결
        </span>
        <div className="kg-toolbar-actions">
          <button type="button" className="kg-btn" onClick={() => { zoomRef.current = Math.min(2.5, zoomRef.current + 0.2); }} aria-label="확대">＋</button>
          <button type="button" className="kg-btn" onClick={() => { zoomRef.current = Math.max(0.5, zoomRef.current - 0.2); }} aria-label="축소">－</button>
          <button type="button" className="kg-btn" onClick={resetView} aria-label="원위치로">⟲</button>
        </div>
      </div>

      <div className="kg-canvas-wrap">
        <canvas
          ref={canvasRef}
          onMouseMove={handlePointerMove}
          onMouseDown={handlePointerDown}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchMove={handlePointerMove}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
          onWheel={handleWheel}
          style={{ display: 'block', width: '100%', touchAction: 'none' }}
          aria-label="암묵지 지식그래프 — 축 노드는 고정, 인사이트 노드는 드래그 가능"
        />
        {tooltip && (
          <div
            className="kg-tooltip"
            style={{
              left: Math.min(tooltip.x + 14, dimensions.w - 240),
              top: Math.max(tooltip.y - 64, 12),
              borderColor: tooltip.color,
            }}
          >
            <strong style={{ color: tooltip.color }}>
              {tooltip.icon ? `${tooltip.icon} ` : ''}{tooltip.title}
            </strong>
            <p>{tooltip.text}</p>
          </div>
        )}
      </div>

      <div className="kg-legend">
        {axisScores.map((axis) => (
          <span key={axis.key} className="kg-legend-item">
            <span className="kg-legend-dot" style={{ background: AXIS_COLORS[axis.key] || INK_500 }} />
            {axis.label} <span className="kg-legend-score">{axis.score}</span>
          </span>
        ))}
      </div>

      <p className="kg-hint">
        ↔ 빈 공간 드래그로 이동 · 휠/핀치로 확대 · 잉크 점(인사이트)을 드래그해 정렬
      </p>
    </div>
  );
}
