# DAA Algorithms Reference & Complexity Matrix

This reference specifies the theoretical and empirical characteristics of the pathfinding and optimization algorithms implemented in the simulation engine.

---

## 1. Complexity Comparison Matrix

Algorithm | Class | Time Complexity | Space Complexity | Optimality Guarantee | Best Suited For
:--- | :--- | :--- | :--- | :--- | :---
**Dijkstra** | Greedy / Exact | O((V + E) log V) | O(V) | Guaranteed (non-negative weights) | Uniform single-source shortest path across arbitrary networks.
**A* Search** | Informed Heuristic | O(E) best, O(b^d) worst | O(V) | Guaranteed (admissible heuristic) | Fast directional pathfinding directly targeting a goal coordinate.
**BFS** | Unweighted Exhaustive | O(V + E) | O(V) | Shortest in unweighted hops | Level-by-level radial crowd dispersion or flood evacuation.
**DFS** | Unweighted Depth-First | O(V + E) | O(V) | Not guaranteed | Exploring long winding alleyways and discovering dead-ends.
**Kruskal MST** | Greedy / Disjoint-Set | O(E log E) | O(V) | Minimum total tree weight | Laying emergency infrastructure with minimal connection cost.
**Prim MST** | Greedy / Priority Queue | O((V + E) log V) | O(V + E) | Minimum total tree weight | Expanding utility networks outward from a central shrine with minimal connection cost.
**Multi-Stop** | Traveling Pilgrim (Greedy)| O(k * (V + E) log V) | O(V) | Heuristic approximation | Sequential yatra itineraries visiting multiple holy shrines.

---

## 2. Mathematical Cost Modeling

The graph edge evaluation function in [graphModel.js](file:///d:/proj/Pandharpur-City-Simulator/src/engine/graph/graphModel.js) translates real-world pilgrimage conditions into edge weights:

### 2.1. Physical Distance Metric (`distance`)
$$Weight(e) = DistanceMeters(e)$$

### 2.2. Crowd-Degraded Time Metric (`crowd_time`)
Models pedestrian walking velocity degradation in dense crowds.
- Base walking speed: $$v_0 = 1.2 \text{ m/s}$$
- Effective crowd factor:
  $$CF_{eff} = 1.0 + (CF_{base} - 1.0) \times Multiplier_{crowd}$$
- Traversal time in seconds:
  $$Weight(e) = \left\lceil \frac{DistanceMeters(e)}{1.2} \times CF_{eff} \right\rceil$$

### 2.3. Scenic / Pilgrim Sanctity Metric (`scenic`)
Prioritizes traditional river ghat steps and temple pradakshina circumambulation routes:
$$Weight(e) = \text{round}(DistanceMeters(e) \times Bonus)$$
Where $Bonus = 0.7$ for ghat steps and pradakshina paths, and $1.1$ for crowded commercial roads.

---

## 3. Heuristic Admissibility for A*

For A* to guarantee shortest path optimality, the heuristic function $h(n)$ must be **admissible**, meaning:
$$h(n) \le h^*(n) \quad \forall n$$
Where $h^*(n)$ is the true shortest cost from $n$ to the goal.

The simulation calculates straight-line 3D Euclidean distance:
$$h(u, \text{goal}) = \sqrt{(x_u - x_g)^2 + (y_u - y_g)^2 + (z_u - z_g)^2} \times 1.2$$
This provides a consistent lower bound against the actual street path network.

