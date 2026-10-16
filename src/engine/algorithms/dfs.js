export const DFS_PSEUDOCODE = [
  "1. Initialize Stack S; mark start as visited",
  "2. S.push(start)",
  "3. while S is not empty:",
  "4.   u = S.pop()",
  "5.   if u == target: return reconstructPath(parent)",
  "6.   for each unvisited neighbor v of u (in reverse order):",
  "7.     mark v as visited; parent[v] = u",
  "8.     S.push(v)"
];

export const DFS_METADATA = {
  name: "Depth-First Search (DFS)",
  type: "Graph Traversal / Exhaustive Search",
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V)",
  description: "Explores as deeply as possible along each branch before backtracking using a LIFO stack. Useful for topological ordering, maze routing, and cycle detection."
};

export function runDFS(graph, startNodeId, targetNodeId = null) {
  const steps = [];
  const stack = [startNodeId];
  const visited = new Set();
  const parent = { [startNodeId]: null };

  steps.push({
    stepIndex: 0,
    line: 1,
    currentNode: startNodeId,
    targetNode: targetNodeId,
    description: `Initialized DFS. Pushed start node ${startNodeId} to call stack.`,
    visited: [],
    frontier: [startNodeId],
    stack: [...stack],
    currentEdge: null,
    activeSubpath: [startNodeId]
  });

  let stepCounter = 1;

  while (stack.length > 0) {
    const u = stack.pop();

    if (visited.has(u)) continue;
    visited.add(u);

    if (targetNodeId && u === targetNodeId) {
      const path = reconstructPath(parent, startNodeId, targetNodeId);
      steps.push({
        stepIndex: stepCounter++,
        line: 5,
        currentNode: u,
        targetNode: targetNodeId,
        description: `Target ${u} found by DFS exploration!`,
        visited: Array.from(visited),
        frontier: [...stack],
        stack: [...stack],
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
      description: `Popped and visiting vertex ${u} from top of stack.`,
      visited: Array.from(visited),
      frontier: [...stack],
      stack: [...stack],
      currentEdge: null,
      activeSubpath: reconstructPath(parent, startNodeId, u)
    });

    const neighbors = graph.getNeighbors(u);

    // Push in reverse order so first neighbor is popped first
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const edge = neighbors[i];
      const v = edge.neighborId;
      if (!visited.has(v)) {
        parent[v] = u;
        stack.push(v);

        steps.push({
          stepIndex: stepCounter++,
          line: 8,
          currentNode: u,
          examiningNeighbor: v,
          currentEdge: edge.edgeId,
          targetNode: targetNodeId,
          description: `Discovered unvisited neighbor ${v}. Pushed to call stack.`,
          visited: Array.from(visited),
          frontier: [...stack],
          stack: [...stack],
          activeSubpath: reconstructPath(parent, startNodeId, u)
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
    totalSteps: steps.length,
    steps,
    pseudocode: DFS_PSEUDOCODE,
    metadata: DFS_METADATA
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
