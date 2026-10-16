export const BFS_PSEUDOCODE = [
  "1. Initialize Queue Q; mark start as visited",
  "2. Q.enqueue(start); level[start] = 0",
  "3. while Q is not empty:",
  "4.   u = Q.dequeue()",
  "5.   if u == target: return reconstructPath(parent)",
  "6.   for each unvisited neighbor v of u:",
  "7.     mark v as visited; parent[v] = u",
  "8.     level[v] = level[u] + 1",
  "9.     Q.enqueue(v)"
];

export const BFS_METADATA = {
  name: "Breadth-First Search (BFS)",
  type: "Graph Traversal / Unweighted Shortest Path",
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V)",
  description: "Explores vertices level-by-level using a FIFO queue. Guarantees finding the path with the minimum number of edge hops."
};

export function runBFS(graph, startNodeId, targetNodeId = null) {
  const steps = [];
  const queue = [startNodeId];
  const visited = new Set([startNodeId]);
  const parent = { [startNodeId]: null };
  const levels = { [startNodeId]: 0 };

  steps.push({
    stepIndex: 0,
    line: 1,
    currentNode: startNodeId,
    targetNode: targetNodeId,
    description: `Initialized BFS. Enqueued start node ${startNodeId} at level 0.`,
    visited: [startNodeId],
    frontier: [startNodeId],
    queue: [...queue],
    currentEdge: null,
    activeSubpath: [startNodeId]
  });

  let stepCounter = 1;

  while (queue.length > 0) {
    const u = queue.shift();

    if (targetNodeId && u === targetNodeId) {
      const path = reconstructPath(parent, startNodeId, targetNodeId);
      steps.push({
        stepIndex: stepCounter++,
        line: 5,
        currentNode: u,
        targetNode: targetNodeId,
        description: `Target ${u} found at depth level ${levels[u]}!`,
        visited: Array.from(visited),
        frontier: [...queue],
        queue: [...queue],
        currentEdge: null,
        activeSubpath: path
      });
      break;
    }

    steps.push({
      stepIndex: stepCounter++,
      line: 4,
      currentNode: u,
      targetNode: targetNodeId,
      description: `Dequeued vertex ${u} (Hop level ${levels[u]}).`,
      visited: Array.from(visited),
      frontier: [...queue],
      queue: [...queue],
      currentEdge: null,
      activeSubpath: reconstructPath(parent, startNodeId, u)
    });

    const neighbors = graph.getNeighbors(u);

    for (const edge of neighbors) {
      const v = edge.neighborId;
      if (!visited.has(v)) {
        visited.add(v);
        parent[v] = u;
        levels[v] = levels[u] + 1;
        queue.push(v);

        steps.push({
          stepIndex: stepCounter++,
          line: 7,
          currentNode: u,
          examiningNeighbor: v,
          currentEdge: edge.edgeId,
          targetNode: targetNodeId,
          description: `Discovered unvisited neighbor ${v} at level ${levels[v]}. Enqueued.`,
          visited: Array.from(visited),
          frontier: [...queue],
          queue: [...queue],
          activeSubpath: reconstructPath(parent, startNodeId, v)
        });
      }
    }
  }

  const finalPath = targetNodeId ? reconstructPath(parent, startNodeId, targetNodeId) : Array.from(visited);

  let totalCost = 0;
  if (targetNodeId && finalPath && finalPath.length > 1) {
    for (let i = 0; i < finalPath.length - 1; i++) {
      const uNode = finalPath[i];
      const vNode = finalPath[i + 1];
      const neighbors = graph.getNeighbors(uNode);
      const edge = neighbors.find(n => n.neighborId === vNode);
      if (edge) totalCost += edge.weight;
    }
  }

  return {
    path: finalPath,
    totalCost: targetNodeId ? (finalPath.length > 0 ? totalCost : null) : totalCost,
    visitedOrder: Array.from(visited),
    levels,
    totalSteps: steps.length,
    steps,
    pseudocode: BFS_PSEUDOCODE,
    metadata: BFS_METADATA
  };
}

function reconstructPath(parent, startNodeId, targetNodeId) {
  const path = [];
  let curr = targetNodeId;
  while (curr) {
    path.unshift(curr);
    if (curr === startNodeId) break;
    curr = parent[curr];
  }
  return path[0] === startNodeId ? path : [];
}
