export const KRUSKAL_PSEUDOCODE = [
  "1. Initialize Disjoint Set DSU for all V vertices",
  "2. Sort all E edges by weight in ascending order",
  "3. Initialize MST_edges = [], totalWeight = 0",
  "4. for each edge (u, v, w) in sorted edges:",
  "5.   rootU = DSU.find(u)",
  "6.   rootV = DSU.find(v)",
  "7.   if rootU != rootV:",
  "8.     MST_edges.add((u, v, w))",
  "9.     DSU.union(rootU, rootV)",
  "10.    totalWeight += w",
  "11.  else: skip edge (cycle detected)"
];

export const KRUSKAL_METADATA = {
  name: "Kruskal's Minimum Spanning Tree (MST)",
  type: "Greedy / Minimum Spanning Forest",
  timeComplexity: "O(E log E) or O(E log V)",
  spaceComplexity: "O(V + E)",
  description: "Constructs a minimum-weight spanning tree connecting all nodes without any cycles using greedy edge selection with Disjoint Set Union (DSU)."
};

class DisjointSet {
  constructor(nodeIds) {
    this.parent = {};
    this.rank = {};
    for (const id of nodeIds) {
      this.parent[id] = id;
      this.rank[id] = 0;
    }
  }

  find(i) {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]); // Path compression
    return this.parent[i];
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI === rootJ) return false;

    // Union by rank
    if (this.rank[rootI] < this.rank[rootJ]) {
      this.parent[rootI] = rootJ;
    } else if (this.rank[rootI] > this.rank[rootJ]) {
      this.parent[rootJ] = rootI;
    } else {
      this.parent[rootJ] = rootI;
      this.rank[rootI]++;
    }
    return true;
  }

  getComponents() {
    const groups = {};
    for (const id in this.parent) {
      const root = this.find(id);
      if (!groups[root]) groups[root] = [];
      groups[root].push(id);
    }
    return Object.entries(groups).map(([root, members]) => ({ root, members }));
  }
}

/**
 * Finds the unique path between startNodeId and targetNodeId within a spanning tree/forest.
 */
export function findPathInTree(mstEdgeIds, graph, startNodeId, targetNodeId) {
  if (!startNodeId || !targetNodeId) return { path: null, cost: 0 };
  if (startNodeId === targetNodeId) return { path: [startNodeId], cost: 0 };

  const treeAdj = new Map();
  for (const edgeId of mstEdgeIds) {
    const edge = graph.getEdge(edgeId);
    if (!edge) continue;
    if (!treeAdj.has(edge.source)) treeAdj.set(edge.source, []);
    if (!treeAdj.has(edge.target)) treeAdj.set(edge.target, []);
    const weight = edge.effectiveWeight || edge.distanceMeters;
    treeAdj.get(edge.source).push({ neighborId: edge.target, edgeId, weight });
    treeAdj.get(edge.target).push({ neighborId: edge.source, edgeId, weight });
  }

  const queue = [startNodeId];
  const visited = new Set([startNodeId]);
  const parent = { [startNodeId]: null };
  const edgeWeight = {};

  let found = false;
  while (queue.length > 0) {
    const curr = queue.shift();
    if (curr === targetNodeId) {
      found = true;
      break;
    }
    const neighbors = treeAdj.get(curr) || [];
    for (const n of neighbors) {
      if (!visited.has(n.neighborId)) {
        visited.add(n.neighborId);
        parent[n.neighborId] = curr;
        edgeWeight[n.neighborId] = n.weight;
        queue.push(n.neighborId);
      }
    }
  }

  if (!found) return { path: null, cost: 0 };

  const path = [];
  let curr = targetNodeId;
  let pathCost = 0;
  while (curr) {
    path.unshift(curr);
    if (edgeWeight[curr] !== undefined) {
      pathCost += edgeWeight[curr];
    }
    if (curr === startNodeId) break;
    curr = parent[curr];
  }

  return { path, cost: pathCost };
}

export function runKruskal(graph, startNodeId = null, targetNodeId = null) {
  const steps = [];
  const nodeIds = graph.nodes.map(n => n.id);
  const dsu = new DisjointSet(nodeIds);

  // Extract all unique open edges
  const edgeList = graph.edges
    .filter(e => !e.isClosed)
    .map(e => ({
      edgeId: e.id,
      source: e.source,
      target: e.target,
      weight: e.effectiveWeight || e.distanceMeters,
      streetName: e.streetName,
      roadType: e.roadType
    }));

  // Step 2: Sort edges in non-decreasing order of weight
  edgeList.sort((a, b) => a.weight - b.weight);

  const mstEdges = [];
  let totalCost = 0;

  steps.push({
    stepIndex: 0,
    line: 2,
    currentNode: startNodeId,
    targetNode: targetNodeId,
    description: `Sorted ${edgeList.length} open edges by weight. Initialized Disjoint Set for ${nodeIds.length} vertices.`,
    mstEdges: [],
    currentEdge: null,
    totalCost: 0,
    edgePool: edgeList.map(e => ({ id: e.edgeId, weight: e.weight })),
    dsuSets: dsu.getComponents()
  });

  let stepCounter = 1;

  for (const edge of edgeList) {
    const { edgeId, source: u, target: v, weight } = edge;
    const rootU = dsu.find(u);
    const rootV = dsu.find(v);

    if (rootU !== rootV) {
      dsu.union(rootU, rootV);
      mstEdges.push(edgeId);
      totalCost += weight;

      steps.push({
        stepIndex: stepCounter++,
        line: 8,
        currentNode: u,
        targetNode: targetNodeId,
        description: `ACCEPTED Edge ${edgeId} (${u} ↔ ${v}, ${weight}m). Different components (${rootU} != ${rootV}). Unioned!`,
        currentEdge: edgeId,
        decision: 'ACCEPTED',
        reason: 'Connects disjoint trees without cycle',
        mstEdges: [...mstEdges],
        totalCost,
        activeEdge: edge,
        edgePool: edgeList.map(e => ({ id: e.edgeId, weight: e.weight })),
        dsuSets: dsu.getComponents()
      });
    } else {
      steps.push({
        stepIndex: stepCounter++,
        line: 11,
        currentNode: u,
        targetNode: targetNodeId,
        description: `REJECTED Edge ${edgeId} (${u} ↔ ${v}, ${weight}m). Cycle detected! Both already in component ${rootU}.`,
        currentEdge: edgeId,
        decision: 'REJECTED',
        reason: 'Both endpoints in same set; would create cycle',
        mstEdges: [...mstEdges],
        totalCost,
        activeEdge: edge,
        edgePool: edgeList.map(e => ({ id: e.edgeId, weight: e.weight })),
        dsuSets: dsu.getComponents()
      });
    }
  }

  // Find unique route through MST between start and target if provided
  const treePathResult = (startNodeId && targetNodeId)
    ? findPathInTree(mstEdges, graph, startNodeId, targetNodeId)
    : { path: null, cost: 0 };

  if (treePathResult.path) {
    steps.push({
      stepIndex: stepCounter++,
      line: 9,
      currentNode: targetNodeId,
      targetNode: targetNodeId,
      description: `Kruskal Spanning Tree complete! Extracted tree route between ${startNodeId} and ${targetNodeId} (${treePathResult.path.length} waypoints, ${treePathResult.cost}m).`,
      currentEdge: null,
      decision: 'OPTIMAL_TREE_PATH',
      reason: 'Extracted tree route between origin and holy destination',
      mstEdges: [...mstEdges],
      totalCost,
      activeSubpath: treePathResult.path,
      edgePool: edgeList.map(e => ({ id: e.edgeId, weight: e.weight })),
      dsuSets: dsu.getComponents()
    });
  }

  return {
    path: treePathResult.path,
    totalCost: treePathResult.path ? treePathResult.cost : totalCost,
    treeCost: totalCost,
    mstEdges,
    totalEdgesConsidered: edgeList.length,
    totalSteps: steps.length,
    steps,
    pseudocode: KRUSKAL_PSEUDOCODE,
    metadata: KRUSKAL_METADATA
  };
}
