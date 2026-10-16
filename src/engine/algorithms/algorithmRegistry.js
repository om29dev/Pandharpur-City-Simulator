import { runDijkstra, DIJKSTRA_METADATA, DIJKSTRA_PSEUDOCODE } from './dijkstra.js';
import { runAStar, ASTAR_METADATA, ASTAR_PSEUDOCODE } from './astar.js';
import { runBFS, BFS_METADATA, BFS_PSEUDOCODE } from './bfs.js';
import { runDFS, DFS_METADATA, DFS_PSEUDOCODE } from './dfs.js';
import { runKruskal, KRUSKAL_METADATA, KRUSKAL_PSEUDOCODE } from './kruskal.js';
import { runPrim, PRIM_METADATA, PRIM_PSEUDOCODE } from './prim.js';
import { runMultiStop, MULTI_STOP_METADATA, MULTI_STOP_PSEUDOCODE } from './multiStop.js';

export const ALGORITHM_REGISTRY = {
  DIJKSTRA: {
    id: 'DIJKSTRA',
    name: "Dijkstra's Shortest Path",
    runner: (graph, start, target) => runDijkstra(graph, start, target),
    requiresTarget: true,
    supportsMultiStop: false,
    pseudocode: DIJKSTRA_PSEUDOCODE,
    metadata: DIJKSTRA_METADATA,
    badgeColor: '#10b981'
  },
  ASTAR: {
    id: 'ASTAR',
    name: "A* Informed Search",
    runner: (graph, start, target) => runAStar(graph, start, target),
    requiresTarget: true,
    supportsMultiStop: false,
    pseudocode: ASTAR_PSEUDOCODE,
    metadata: ASTAR_METADATA,
    badgeColor: '#06b6d4'
  },
  BFS: {
    id: 'BFS',
    name: "Breadth-First Search (BFS)",
    runner: (graph, start, target) => runBFS(graph, start, target),
    requiresTarget: true,
    supportsMultiStop: false,
    pseudocode: BFS_PSEUDOCODE,
    metadata: BFS_METADATA,
    badgeColor: '#3b82f6'
  },
  DFS: {
    id: 'DFS',
    name: "Depth-First Search (DFS)",
    runner: (graph, start, target) => runDFS(graph, start, target),
    requiresTarget: true,
    supportsMultiStop: false,
    pseudocode: DFS_PSEUDOCODE,
    metadata: DFS_METADATA,
    badgeColor: '#8b5cf6'
  },
  KRUSKAL: {
    id: 'KRUSKAL',
    name: "Kruskal's Minimum Spanning Tree",
    runner: (graph, start, target) => runKruskal(graph, start, target),
    requiresTarget: true,
    supportsMultiStop: false,
    pseudocode: KRUSKAL_PSEUDOCODE,
    metadata: KRUSKAL_METADATA,
    badgeColor: '#f59e0b'
  },
  PRIM: {
    id: 'PRIM',
    name: "Prim's Minimum Spanning Tree",
    runner: (graph, start, target) => runPrim(graph, start, target),
    requiresTarget: true,
    supportsMultiStop: false,
    pseudocode: PRIM_PSEUDOCODE,
    metadata: PRIM_METADATA,
    badgeColor: '#eab308'
  },
  MULTI_STOP: {
    id: 'MULTI_STOP',
    name: "Multi-Stop Yatra Itinerary",
    runner: (graph, start, target, options) => runMultiStop(graph, start, options?.multiStops || [], target),
    requiresTarget: true,
    supportsMultiStop: true,
    pseudocode: MULTI_STOP_PSEUDOCODE,
    metadata: MULTI_STOP_METADATA,
    badgeColor: '#ec4899'
  }
};

export function getAlgorithmById(id) {
  return ALGORITHM_REGISTRY[id] || ALGORITHM_REGISTRY.DIJKSTRA;
}
