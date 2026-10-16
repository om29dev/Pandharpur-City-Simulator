import { describe, it, expect } from 'vitest';
import { buildPandharpurGraph } from '../engine/graph/graphModel.js';
import { runKruskal } from '../engine/algorithms/kruskal.js';

describe('Kruskal Algorithm Tests', () => {
  const graph = buildPandharpurGraph();

  it('should form minimum spanning tree without cycles', () => {
    const result = runKruskal(graph);
    expect(result.mstEdges.length).toBeGreaterThan(25);
    expect(result.totalCost).toBeGreaterThan(0);
  });

  it('should reject edges that cause cycles in disjoint set', () => {
    const result = runKruskal(graph);
    const rejectedSteps = result.steps.filter(s => s.decision === 'REJECTED');
    expect(rejectedSteps.length).toBeGreaterThan(0);
  });

  it('should extract tree path between start and target nodes', () => {
    const result = runKruskal(graph, 'RAILWAY_STATION', 'VITTHAL_ENTRANCE');
    expect(result.path).not.toBeNull();
    expect(result.path.length).toBeGreaterThan(1);
    expect(result.path[0]).toBe('RAILWAY_STATION');
    expect(result.path[result.path.length - 1]).toBe('VITTHAL_ENTRANCE');
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.treeCost).toBeGreaterThanOrEqual(result.totalCost);
  });
});
