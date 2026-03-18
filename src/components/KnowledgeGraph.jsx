import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { ACTIVITIES, AXES } from '../data/activities';
import { DEV_ACTIVITIES, DEV_AXES } from '../data/developerActivities';

/* ───────────────────────────────────────────────
 *  COLOUR PALETTE — one hue per axis
 * ─────────────────────────────────────────────── */
const AXIS_COLORS = {
  counseling: '#6366F1', teaching: '#10B981', management: '#F59E0B',
  crisis: '#EF4444', leadership: '#3B82F6',
  debugging: '#6366F1', architecture: '#10B981', automation: '#F59E0B',
  optimization: '#EF4444',
};


/* ───────────────────────────────────────────────
 *  Build graph data from activity insights
 * ─────────────────────────────────────────────── */
function buildGraphData(axisScores, activityData, isDev) {
  const targetActivities = isDev ? DEV_ACTIVITIES : ACTIVITIES;
  const nodes = [];
  const edges = [];

  // 1 — Axis hub nodes
  axisScores.forEach((axis) => {
    nodes.push({
      id: `axis-${axis.key}`,
      type: 'axis',
      label: axis.label,
      score: axis.score,
      color: AXIS_COLORS[axis.key] || '#3B82F6',
      radius: 28 + axis.score * 0.15,
    });
  });

  // 2 — Insight leaf nodes + edges
  let insightIdx = 0;
  targetActivities.forEach((activity) => {
    const data = activityData[activity.id];
    if (!data) return;

    const insightText = data.insight || data.selected || data.answer;
    if (!insightText || insightText === 'Skipped') return;

    const nodeId = `insight-${insightIdx}`;
    const activityAxes = Object.keys(activity.axis || {});
    const primaryAxis = activityAxes[0];
    const color = AXIS_COLORS[primaryAxis] || '#94A3B8';

    nodes.push({
      id: nodeId,
      type: 'insight',
      label: insightText.length > 40 ? insightText.slice(0, 40) + '…' : insightText,
      fullText: insightText,
      activityTitle: activity.title,
      color,
      radius: 8,
    });

    // Connect to every axis this activity maps to
    activityAxes.forEach((axisKey) => {
      edges.push({
        source: `axis-${axisKey}`,
        target: nodeId,
        strength: activity.axis[axisKey] / 3,
        color,
      });
    });

    insightIdx++;
  });

  return { nodes, edges };
}

/* ───────────────────────────────────────────────
 *  Simple Force Simulation (no d3 dependency)
 * ─────────────────────────────────────────────── */
function initPositions(nodes, width, height) {
  const cx = width / 2;
  const cy = height / 2;

  // Place axis nodes in a circle, insights randomly near center
  const axisNodes = nodes.filter((n) => n.type === 'axis');
  axisNodes.forEach((n, i) => {
    const angle = (i / axisNodes.length) * Math.PI * 2 - Math.PI / 2;
    const r = Math.min(width, height) * 0.28;
    n.x = cx + Math.cos(angle) * r;
    n.y = cy + Math.sin(angle) * r;
    n.vx = 0;
    n.vy = 0;
    n.fx = n.x; // fixed position for axis nodes
    n.fy = n.y;
  });

  nodes.filter((n) => n.type === 'insight').forEach((n) => {
    n.x = cx + (Math.random() - 0.5) * width * 0.3;
    n.y = cy + (Math.random() - 0.5) * height * 0.3;
    n.vx = 0;
    n.vy = 0;
  });
}

function simulate(nodes, edges, iterations = 120) {
  const nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });

  for (let iter = 0; iter < iterations; iter++) {
    const alpha = 1 - iter / iterations;

    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDist = a.radius + b.radius + 30;
        if (dist < minDist) {
          const force = (minDist - dist) / dist * 0.5 * alpha;
          const fx = dx * force;
          const fy = dy * force;
          if (!a.fx) { a.vx -= fx; a.vy -= fy; }
          if (!b.fx) { b.vx += fx; b.vy += fy; }
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
      const idealDist = 100 + (1 - e.strength) * 60;
      const force = (dist - idealDist) / dist * 0.04 * alpha;
      const fx = dx * force;
      const fy = dy * force;
      if (!a.fx) { a.vx += fx; a.vy += fy; }
      if (!b.fx) { b.vx -= fx; b.vy -= fy; }
    });

    // Apply velocities
    nodes.forEach((n) => {
      if (n.fx != null) { n.x = n.fx; n.y = n.fy; return; }
      n.vx *= 0.85;
      n.vy *= 0.85;
      n.x += n.vx;
      n.y += n.vy;
    });
  }
}

/* ───────────────────────────────────────────────
 *  Canvas Renderer Component
 * ─────────────────────────────────────────────── */
export default function KnowledgeGraph({ axisScores, activityData, isDev }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const dragNodeRef = useRef(null);
  const graphRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 600, h: 450 });

  const graph = useMemo(() => {
    const g = buildGraphData(axisScores, activityData, isDev);
    if (g.nodes.length === 0) return g;
    const w = dimensions.w;
    const h = dimensions.h;
    initPositions(g.nodes, w, h);
    simulate(g.nodes, g.edges);
    return g;
  }, [axisScores, activityData, isDev, dimensions.w, dimensions.h]);

  // Keep graphRef in sync via effect
  useEffect(() => {
    graphRef.current = graph;
  }, [graph]);

  // Responsive sizing
  useEffect(() => {
    const container = canvasRef.current?.parentElement;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDimensions({ w: width, h: Math.max(350, Math.min(500, width * 0.7)) });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || graph.nodes.length === 0) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = dimensions.w;
    const h = dimensions.h;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw edges
    const nodeMap = {};
    graph.nodes.forEach((n) => { nodeMap[n.id] = n; });

    graph.edges.forEach((e) => {
      const a = nodeMap[e.source];
      const b = nodeMap[e.target];
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = e.color + '40';
      ctx.lineWidth = 1.5 * (e.strength || 0.5);
      ctx.stroke();
    });

    // Draw nodes
    graph.nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

      if (n.type === 'axis') {
        // Gradient fill for axis nodes
        const grad = ctx.createRadialGradient(n.x - n.radius * 0.3, n.y - n.radius * 0.3, 0, n.x, n.y, n.radius);
        grad.addColorStop(0, n.color + 'FF');
        grad.addColorStop(1, n.color + 'BB');
        ctx.fillStyle = grad;
        ctx.fill();

        // Glow
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Outline
        ctx.strokeStyle = '#FFFFFF80';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px Pretendard Variable, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y - 5);

        // Score
        ctx.font = 'bold 14px Pretendard Variable, sans-serif';
        ctx.fillText(n.score, n.x, n.y + 10);
      } else {
        // Insight nodes
        ctx.fillStyle = n.color + '60';
        ctx.fill();
        ctx.strokeStyle = n.color + 'BB';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pulse effect for hovered
        if (tooltip && tooltip.id === n.id) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });
  }, [graph, dimensions, tooltip]);

  useEffect(() => { draw(); }, [draw]);

  // Hit test
  const findNodeAt = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    for (let i = graph.nodes.length - 1; i >= 0; i--) {
      const n = graph.nodes[i];
      const dx = n.x - x;
      const dy = n.y - y;
      if (dx * dx + dy * dy <= (n.radius + 4) * (n.radius + 4)) {
        return { node: n, x, y };
      }
    }
    return null;
  }, [graph]);

  // Mouse/touch handlers
  const handlePointerMove = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (dragNodeRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      dragNodeRef.current.x = clientX - rect.left;
      dragNodeRef.current.y = clientY - rect.top;
      draw();
      return;
    }

    const hit = findNodeAt(clientX, clientY);
    if (hit && hit.node.type === 'insight') {
      setTooltip({
        id: hit.node.id,
        x: hit.x,
        y: hit.y,
        title: hit.node.activityTitle,
        text: hit.node.fullText,
        color: hit.node.color,
      });
      canvasRef.current.style.cursor = 'pointer';
    } else if (hit && hit.node.type === 'axis') {
      canvasRef.current.style.cursor = 'grab';
      setTooltip(null);
    } else {
      canvasRef.current.style.cursor = 'default';
      setTooltip(null);
    }
  }, [findNodeAt, draw]);

  const handlePointerDown = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const hit = findNodeAt(clientX, clientY);
    if (hit && hit.node.type === 'insight') {
      hit.node.fx = null;
      hit.node.fy = null;
      dragNodeRef.current = hit.node;
      canvasRef.current.style.cursor = 'grabbing';
    }
  }, [findNodeAt]);

  const handlePointerUp = useCallback(() => {
    if (dragNodeRef.current) {
      dragNodeRef.current = null;
      canvasRef.current.style.cursor = 'default';
    }
  }, []);

  if (graph.nodes.length === 0) {
    return (
      <div className="kg-empty">
        <p>✨ 활동을 완료하면 지식그래프가 생성됩니다</p>
      </div>
    );
  }

  return (
    <div className="kg-container" style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handlePointerMove}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchMove={handlePointerMove}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        style={{ display: 'block', width: '100%', borderRadius: '16px', background: '#0F172A' }}
      />
      {tooltip && (
        <div
          className="kg-tooltip"
          style={{
            left: Math.min(tooltip.x, dimensions.w - 220),
            top: tooltip.y - 70,
            borderColor: tooltip.color,
          }}
        >
          <strong style={{ color: tooltip.color }}>{tooltip.title}</strong>
          <p>{tooltip.text}</p>
        </div>
      )}
      <div className="kg-legend">
        {axisScores.map((axis) => (
          <span key={axis.key} className="kg-legend-item">
            <span className="kg-legend-dot" style={{ background: AXIS_COLORS[axis.key] || '#3B82F6' }} />
            {axis.label}
          </span>
        ))}
      </div>
    </div>
  );
}
