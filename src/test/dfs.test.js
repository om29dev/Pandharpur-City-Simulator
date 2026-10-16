import { describe, it, expect } from 'vitest';
import { buildPandharpurGraph } from '../engine/graph/graphModel.js';
import { runDFS } from '../engine/algorithms/dfs.js';

describe('DFS Algorithm Tests', () => {
  const graph = buildPandharpurGraph();

  it('should traverse exhaustively using stack semantics', () => {
    const result = runDFS(graph, 'VITTHAL_ENTRANCE');
    expect(result.visitedOrder.length).toBeGreaterThan(15);
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('should find path between two arbitrary nodes', () => {
    const result = runDFS(graph, 'RAILWAY_STATION', 'VITTHAL_ENTRANCE');
    expect(result.path.length).toBeGreaterThan(0);
    expect(result.path[0]).toBe('RAILWAY_STATION');
    expect(result.path[result.path.length - 1]).toBe('VITTHAL_ENTRANCE');
    expect(result.totalCost).toBeGreaterThan(0);
  });
});
