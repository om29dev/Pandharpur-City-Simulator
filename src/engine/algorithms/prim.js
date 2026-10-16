import { findPathInTree } from './kruskal.js';

export const PRIM_PSEUDOCODE = [
  "1. Initialize PriorityQueue PQ, visited = Set(), MST_edges = []",
  "2. Start at root node r; visited.add(r)",
  "3. for each neighbor v of r: PQ.enqueue((r, v, weight))",
  "4. while PQ is not empty and |visited| < |V|:",
  "5.   (u, v, weight) = PQ.dequeueMin()",
  "6.   if v in visited: continue (skip cycle)",
  "7.   visited.add(v); MST_edges.add(edgeId)",
  "8.   totalWeight += weight",
  "9.   for each unvisited neighbor w of v: PQ.enqueue((v, w, weight))"
];

export const PRIM_METADATA = {
  name: "Prim's Minimum Spanning Tree (MST)",
  type: "Greedy / Growing Cut Spanning Tree",
  timeComplexity: "O((V + E) log V)",
  spaceComplexity: "O(V + E)",
  description: "Grows a minimum spanning tree outward from an initial root vertex by repeatedly adding the lowest-weight cut edge connecting visited vertices to unvisited vertices."
};

/**
 * Executes Prim's Algorithm to compute a Minimum Spanning Tree (MST),
 * and optionally finds the path between startNodeId and targetNodeId along the tree.
 */
export function runPrim(graph, startNodeId = null, targetNodeId = null) {
  const steps = [];
  const allNodes = graph.nodes;
  const rootNode = startNodeId || (allNodes.length > 0 ? allNodes[0].id : 'VITTHAL_ENTRANCE');

  const visited = new Set([rootNode]);
  const mstEdges = [];
  let totalCost = 0;
  let stepCounter = 0;

  // Priority queue of cut edges: { u, v, weight, edgeId, streetName }
  const pq = [];

  const addIncidentEdges = (nodeId) => {
    const neighbors = graph.getNeighbors(nodeId);
    for (const n of neighbors) {
      if (!visited.has(n.neighborId)) {
        pq.push({
          u: nodeId,
          v: n.neighborId,
          weight: n.weight,
          edgeId: n.edgeId,
          streetName: n.streetName
        });
      }
    }
    pq.sort((a, b) => a.weight - b.weight);
  };

  addIncidentEdges(rootNode);

  steps.push({
    stepIndex: stepCounter++,
    line: 2,
    currentNode: rootNode,
    targetNode: targetNodeId,
    description: `Initialized Prim's algorithm at root node ${rootNode}. Added ${pq.length} candidate incident edges to Priority Queue.`,
    visited: Array.from(visited),
    frontier: pq.map(e => e.v),
    pq: pq.map(e => ({ nodeId: `${e.u} ↔ ${e.v}`, dist: e.weight })),
    mstEdges: [],
    currentEdge: null,
    totalCost: 0
  });

  while (pq.length > 0 && visited.size < allNodes.length) {
    const minEdge = pq.shift();
    const { u, v, weight, edgeId } = minEdge;

    if (visited.has(v)) {
      steps.push({
        stepIndex: stepCounter++,
        line: 6,
        currentNode: u,
        targetNode: targetNodeId,
        description: `Skipped edge ${edgeId} (${u} ↔ ${v}, ${weight}m). Target ${v} already connected in tree (cycle prevention).`,
        visited: Array.from(visited),
        frontier: pq.map(e => e.v),
        pq: pq.map(e => ({ nodeId: `${e.u} ↔ ${e.v}`, dist: e.weight })),
        mstEdges: [...mstEdges],
        currentEdge: edgeId,
        decision: 'REJECTED',
        reason: 'Cycle detected: vertex already inside MST cut',
        totalCost
      });
      continue;
    }

    // Accept edge
    visited.add(v);
    mstEdges.push(edgeId);
    totalCost += weight;

    // Expand frontier
    addIncidentEdges(v);

    steps.push({
      stepIndex: stepCounter++,
      line: 7,
      currentNode: v,
      targetNode: targetNodeId,
      description: `ACCEPTED edge ${edgeId} (${u} ↔ ${v}, ${weight}m). Expanded cut to ${v}. Added new incident edges to PQ.`,
      visited: Array.from(visited),
      frontier: pq.map(e => e.v),
      pq: pq.map(e => ({ nodeId: `${e.u} ↔ ${e.v}`, dist: e.weight })),
      mstEdges: [...mstEdges],
      currentEdge: edgeId,
      decision: 'ACCEPTED',
      reason: 'Minimum weight cut edge connecting unvisited vertex',
      totalCost
    });

    // Handle disconnected components if PQ empties early
    if (pq.length === 0 && visited.size < allNodes.length) {
      const nextUnvisited = allNodes.find(n => !visited.has(n.id));
      if (nextUnvisited) {
        visited.add(nextUnvisited.id);
        addIncidentEdges(nextUnvisited.id);
      }
    }
  }

  // Find unique path in MST from startNodeId to targetNodeId if requested
  const treePathResult = (startNodeId && targetNodeId)
    ? findPathInTree(mstEdges, graph, startNodeId, targetNodeId)
    : { path: null, cost: 0 };

  if (treePathResult.path) {
    steps.push({
      stepIndex: stepCounter++,
      line: 8,
      currentNode: targetNodeId,
      targetNode: targetNodeId,
      description: `Prim Spanning Tree complete! Extracted tree route between ${startNodeId} and ${targetNodeId} (${treePathResult.path.length} waypoints, ${treePathResult.cost}m).`,
      visited: Array.from(visited),
      frontier: [],
      pq: [],
      mstEdges: [...mstEdges],
      currentEdge: null,
      decision: 'OPTIMAL_TREE_PATH',
      totalCost,
      activeSubpath: treePathResult.path
    });
  }

  return {
    path: treePathResult.path,
    totalCost: treePathResult.path ? treePathResult.cost : totalCost,
    treeCost: totalCost,
    mstEdges,
    visitedOrder: Array.from(visited),
    totalSteps: steps.length,
    steps,
    pseudocode: PRIM_PSEUDOCODE,
    metadata: PRIM_METADATA
  };
}

