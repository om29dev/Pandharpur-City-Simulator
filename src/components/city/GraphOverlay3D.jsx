import React, { useState } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore.js';
import { PANDHARPUR_GRAPH_DATA } from '../../data/pedestrianGraph.js';
import { Html } from '@react-three/drei';

export function GraphOverlay3D() {
  const showGraphOverlay = useSimulationStore(state => state.showGraphOverlay);
  const startNode = useSimulationStore(state => state.startNode);
  const endNode = useSimulationStore(state => state.endNode);
  const multiStops = useSimulationStore(state => state.multiStops);
  const closedEdges = useSimulationStore(state => state.closedEdges);
  const routeResult = useSimulationStore(state => state.routeResult);
  const activeStepIndex = useSimulationStore(state => state.activeStepIndex);
  const toggleEdgeBarricade = useSimulationStore(state => state.toggleEdgeBarricade);
  const setStartNode = useSimulationStore(state => state.setStartNode);
  const setEndNode = useSimulationStore(state => state.setEndNode);

  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);

  if (!showGraphOverlay) return null;

  const currentStep = routeResult?.steps?.[activeStepIndex] || {};
  const visitedSet = new Set(currentStep.visited || []);
  const frontierSet = new Set(currentStep.frontier || []);
  const finalStepIdx = (routeResult?.steps?.length || 1) - 1;
  const activeSubpathArray = currentStep.activeSubpath || (activeStepIndex === finalStepIdx ? routeResult?.path : null) || [];
  const activeSubpathSet = new Set(activeSubpathArray);
  const mstEdgeSet = new Set(currentStep.mstEdges || routeResult?.mstEdges || []);

  const nodeMap = new Map(PANDHARPUR_GRAPH_DATA.nodes.map(n => [n.id, n]));

  return (
    <group name="graph_overlay_root">
      {/* ============================================================== */}
      {/* 1. GRAPH EDGES, LIGHT PIPES & BARRICADES                       */}
      {/* ============================================================== */}
      {PANDHARPUR_GRAPH_DATA.edges.map(edge => {
        const u = nodeMap.get(edge.source);
        const v = nodeMap.get(edge.target);
        if (!u || !v) return null;

        const isClosed = closedEdges.has(edge.id);
        const isCurrentEdge = currentStep.currentEdge === edge.id;
        const isMstEdge = mstEdgeSet.has(edge.id);
        const isHovered = hoveredEdge === edge.id;

        // Active shortest / traversal path check
        let isPathEdge = false;
        if (activeSubpathArray && activeSubpathArray.length > 1) {
          for (let i = 0; i < activeSubpathArray.length - 1; i++) {
            const p1 = activeSubpathArray[i];
            const p2 = activeSubpathArray[i + 1];
            if ((edge.source === p1 && edge.target === p2) || (edge.source === p2 && edge.target === p1)) {
              isPathEdge = true;
              break;
            }
          }
        }

        let edgeColor = '#475569';
        let edgeRadius = 0.22;
        let opacity = 0.4;
        let emissiveIntensity = 0.0;

        if (isClosed) {
          edgeColor = '#ef4444';
          edgeRadius = 0.55;
          opacity = 0.95;
          emissiveIntensity = 1.2;
        } else if (isCurrentEdge) {
          edgeColor = '#facc15';
          edgeRadius = 0.52;
          opacity = 1.0;
          emissiveIntensity = 2.0;
        } else if (isPathEdge) {
          edgeColor = '#10b981'; // Luminous emerald path
          edgeRadius = 0.48;
          opacity = 0.98;
          emissiveIntensity = 1.8;
        } else if (isMstEdge) {
          edgeColor = '#f59e0b'; // Luminous gold MST
          edgeRadius = 0.42;
          opacity = 0.95;
          emissiveIntensity = 1.5;
        } else if (visitedSet.has(edge.source) && visitedSet.has(edge.target)) {
          edgeColor = '#06b6d4'; // Visited cyan conduit
          edgeRadius = 0.28;
          opacity = 0.85;
          emissiveIntensity = 0.8;
        }

        // Clean elevation slightly above roads
        const p1 = new THREE.Vector3(u.x, u.y + 0.65, u.z);
        const p2 = new THREE.Vector3(v.x, v.y + 0.65, v.z);
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const dist = p1.distanceTo(p2);

        const dir = p2.clone().sub(p1).normalize();
        const orientation = new THREE.Quaternion();
        const up = new THREE.Vector3(0, 1, 0);
        orientation.setFromUnitVectors(up, dir);

        return (
          <group
            key={`edge_overlay_${edge.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleEdgeBarricade(edge.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredEdge(edge.id);
            }}
            onPointerOut={() => setHoveredEdge(null)}
          >
            {/* Cylindrical Edge Conduit */}
            <mesh position={mid} quaternion={orientation}>
              <cylinderGeometry args={[edgeRadius, edgeRadius, dist, 8]} />
              <meshStandardMaterial
                color={edgeColor}
                emissive={edgeColor}
                emissiveIntensity={emissiveIntensity}
                transparent
                opacity={opacity}
                roughness={0.2}
              />
            </mesh>

            {/* Glowing outer core for active shortest path */}
            {isPathEdge && (
              <mesh position={mid} quaternion={orientation}>
                <cylinderGeometry args={[edgeRadius + 0.2, edgeRadius + 0.2, dist, 8]} />
                <meshStandardMaterial
                  color="#10b981"
                  emissive="#34d399"
                  emissiveIntensity={1.4}
                  transparent
                  opacity={0.35}
                />
              </mesh>
            )}

            {/* Red Barricade Hazard Crossbar if Edge is Closed */}
            {isClosed && (
              <group position={mid}>
                <mesh position={[0, 0.9, 0]} rotation={[0, Math.atan2(dir.x, dir.z), 0]}>
                  <boxGeometry args={[4.2, 0.45, 0.18]} />
                  <meshStandardMaterial color="#ef4444" roughness={0.3} emissive="#b91c1c" emissiveIntensity={0.8} />
                </mesh>
                {/* Warning beacon lights */}
                {[-1.8, 1.8].map((lx, li) => (
                  <mesh key={`beacon_${li}`} position={[lx, 1.3, 0]}>
                    <sphereGeometry args={[0.2, 8, 8]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2.5} />
                  </mesh>
                ))}
                <Html position={[0, 1.8, 0]} center distanceFactor={70} zIndexRange={[0, 0]}>
                  <div
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      boxShadow: '0 0 12px rgba(239, 68, 68, 0.9)',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }}
                  >
                    BARRICADED (Click to Reopen)
                  </div>
                </Html>
              </group>
            )}

            {/* Edge Info Tooltip on Hover */}
            {isHovered && !isClosed && (
              <Html position={[mid.x, mid.y + 1.1, mid.z]} center distanceFactor={70} zIndexRange={[0, 0]}>
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.94)',
                    border: '1px solid #f59e0b',
                    color: '#fbbf24',
                    fontSize: '10px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.7)'
                  }}
                >
                  {edge.streetName} ({edge.distanceMeters}m) | Click to Barricade
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* ============================================================== */}
      {/* 2. LUMINOUS GRAPH NODES WITH CONCENTRIC TARGET RINGS           */}
      {/* ============================================================== */}
      {PANDHARPUR_GRAPH_DATA.nodes.map(node => {
        const isStart = node.id === startNode;
        const isEnd = node.id === endNode;
        const isMultiStop = multiStops.includes(node.id);
        const isCurrentNode = currentStep.currentNode === node.id;
        const isVisited = visitedSet.has(node.id);
        const isFrontier = frontierSet.has(node.id);
        const isPathNode = activeSubpathSet.has(node.id);
        const isHovered = hoveredNode === node.id;

        let nodeColor = '#64748b';
        let nodeSize = 0.8;
        let ringColor = null;
        let emissiveIntensity = 0.2;

        if (isStart) {
          nodeColor = '#10b981'; // Neon Emerald
          nodeSize = 1.35;
          ringColor = '#10b981';
          emissiveIntensity = 2.2;
        } else if (isEnd) {
          nodeColor = '#ef4444'; // Vivid Ruby
          nodeSize = 1.35;
          ringColor = '#ef4444';
          emissiveIntensity = 2.2;
        } else if (isCurrentNode) {
          nodeColor = '#facc15'; // Brilliant Amber Yellow
          nodeSize = 1.25;
          ringColor = '#facc15';
          emissiveIntensity = 2.5;
        } else if (isPathNode) {
          nodeColor = '#22c55e'; // Vibrant Green
          nodeSize = 1.05;
          ringColor = '#10b981';
          emissiveIntensity = 1.8;
        } else if (isMultiStop) {
          nodeColor = '#ec4899'; // Magenta Stop
          nodeSize = 1.15;
          ringColor = '#f472b6';
          emissiveIntensity = 1.8;
        } else if (isFrontier) {
          nodeColor = '#2dd4bf'; // Turquoise Frontier
          nodeSize = 0.95;
          ringColor = '#14b8a6';
          emissiveIntensity = 1.5;
        } else if (isVisited) {
          nodeColor = '#06b6d4'; // Cyan Visited
          nodeSize = 0.9;
          ringColor = '#0284c7';
          emissiveIntensity = 1.2;
        }

        return (
          <group
            key={`node_overlay_${node.id}`}
            position={[node.x, node.y + 0.75, node.z]}
            onClick={(e) => {
              e.stopPropagation();
              if (e.shiftKey) {
                setEndNode(node.id);
              } else {
                setStartNode(node.id);
              }
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              if (e.nativeEvent?.preventDefault) e.nativeEvent.preventDefault();
              setEndNode(node.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredNode(node.id);
            }}
            onPointerOut={() => setHoveredNode(null)}
          >
            {/* Central Node Sphere */}
            <mesh castShadow>
              <sphereGeometry args={[nodeSize, 16, 16]} />
              <meshStandardMaterial
                color={nodeColor}
                emissive={nodeColor}
                emissiveIntensity={emissiveIntensity}
                metalness={0.2}
                roughness={0.3}
              />
            </mesh>

            {/* Outer Concentric Target Ring for Active Nodes */}
            {ringColor && (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[nodeSize + 0.3, nodeSize + 0.65, 32]} />
                <meshBasicMaterial
                  color={ringColor}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            )}

            {/* Second Outer Pulse Ring for Start & Goal */}
            {(isStart || isEnd) && (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[nodeSize + 0.85, nodeSize + 1.1, 32]} />
                <meshBasicMaterial
                  color={ringColor}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            )}

            {/* Label Tooltip on Hover or Key Nodes */}
            {(isHovered || isStart || isEnd || isMultiStop) && (
              <Html position={[0, nodeSize + 0.9, 0]} center distanceFactor={60} zIndexRange={[0, 0]}>
                <div
                  style={{
                    background: isStart
                      ? 'rgba(16, 185, 129, 0.94)'
                      : isEnd
                      ? 'rgba(239, 68, 68, 0.94)'
                      : isMultiStop
                      ? 'rgba(236, 72, 153, 0.94)'
                      : 'rgba(15, 23, 42, 0.94)',
                    color: isStart || isEnd ? '#090d16' : '#f8fafc',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    fontWeight: '700',
                    fontSize: '10px',
                    padding: '3px 9px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.7)'
                  }}
                >
                  <div style={{ fontWeight: '800' }}>
                    {isStart ? 'START: ' : isEnd ? 'GOAL: ' : isMultiStop ? 'STOP: ' : ''}
                    {node.name}
                  </div>
                  {isHovered && !isStart && !isEnd && (
                    <div style={{ fontSize: '8px', opacity: 0.85, marginTop: '2px' }}>
                      Click: Set Start | Right-Click/Shift: Set Goal
                    </div>
                  )}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default GraphOverlay3D;
