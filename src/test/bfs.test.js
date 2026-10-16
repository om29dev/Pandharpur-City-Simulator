import { describe, it, expect } from 'vitest';
import { buildPandharpurGraph } from '../engine/graph/graphModel.js';
import { runBFS } from '../engine/algorithms/bfs.js';

describe('BFS Algorithm Tests', () => {
  const graph = buildPandharpurGraph();

  it('should traverse vertices level-by-level', () => {
    const result = runBFS(graph, 'VITTHAL_ENTRANCE');
    expect(result.visitedOrder.length).toBeGreaterThan(15);
    expect(result.levels['VITTHAL_ENTRANCE']).toBe(0);
  });

  it('should find target with fewest hops', () => {
    const result = runBFS(graph, 'VITTHAL_ENTRANCE', 'ISKCON_NODE');
    expect(result.path.length).toBeGreaterThan(0);
    expect(result.path[0]).toBe('VITTHAL_ENTRANCE');
    expect(result.path[result.path.length - 1]).toBe('ISKCON_NODE');
    expect(result.totalCost).toBeGreaterThan(0);
  });
});
