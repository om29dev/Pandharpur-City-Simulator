import { describe, it, expect } from 'vitest';
import { buildPandharpurGraph } from '../engine/graph/graphModel.js';
import { runPrim } from '../engine/algorithms/prim.js';

describe('Prim Algorithm Tests', () => {
  const graph = buildPandharpurGraph();

  it('should construct a valid minimum spanning tree connecting all nodes', () => {
    const result = runPrim(graph, 'VITTHAL_ENTRANCE');
    expect(result.mstEdges.length).toBeGreaterThan(25);
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.visitedOrder.length).toBe(graph.nodes.length);
  });

  it('should find tree path between start and target across Prim MST', () => {
    const result = runPrim(graph, 'RAILWAY_STATION', 'VITTHAL_ENTRANCE');
    expect(result.path).not.toBeNull();
    expect(result.path.length).toBeGreaterThan(1);
    expect(result.path[0]).toBe('RAILWAY_STATION');
    expect(result.path[result.path.length - 1]).toBe('VITTHAL_ENTRANCE');
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.treeCost).toBeGreaterThanOrEqual(result.totalCost);
  });

  it('should generate steps with Priority Queue and accepted cut decisions', () => {
    const result = runPrim(graph, 'VITTHAL_ENTRANCE', 'ISKCON_NODE');
    expect(result.steps.length).toBeGreaterThan(10);
    const accepted = result.steps.filter(s => s.decision === 'ACCEPTED');
    expect(accepted.length).toBe(result.mstEdges.length);
  });
});

