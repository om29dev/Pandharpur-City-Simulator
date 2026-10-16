import React, { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore.js';
import { ALGORITHM_REGISTRY } from '../../engine/algorithms/algorithmRegistry.js';
import {
  Code2,
  ListOrdered,
  Layers,
  Clock,
  Database,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function AlgorithmLab() {
  const isAlgorithmLabOpen = useSimulationStore(state => state.isAlgorithmLabOpen);
  const setAlgorithmLabOpen = useSimulationStore(state => state.setAlgorithmLabOpen);
  const selectedAlgorithm = useSimulationStore(state => state.selectedAlgorithm);
  const routeResult = useSimulationStore(state => state.routeResult);
  const activeStepIndex = useSimulationStore(state => state.activeStepIndex);

  const [activeTab, setActiveTab] = useState('pseudocode'); // 'pseudocode' | 'queue' | 'trace' | 'comparison'

  if (!isAlgorithmLabOpen) return null;

  const algoConfig = ALGORITHM_REGISTRY[selectedAlgorithm];
  const steps = routeResult?.steps || [];
  const currentStep = steps[activeStepIndex] || {};

  return (
    <div
      className="slide-in-right"
      style={{
        position: 'absolute',
        top: 'calc(var(--topbar-height) + 12px)',
        right: '12px',
        bottom: '80px',
        width: 'min(480px, calc(100vw - 24px))',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        background: 'rgba(9, 13, 22, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={18} color="#fbbf24" />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
            DAA Algorithm Laboratory
          </h2>
        </div>
        <button
          className="btn btn-icon"
          onClick={() => setAlgorithmLabOpen(false)}
          style={{ padding: '4px' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Complexity Banner */}
      <div
        style={{
          padding: '10px 16px',
          background: 'rgba(245, 158, 11, 0.08)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={13} color="#fbbf24" />
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Time:</span>
          <span className="mono-font" style={{ fontSize: '0.76rem', color: '#34d399', fontWeight: '700' }}>
            {algoConfig?.metadata?.timeComplexity}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={13} color="#fbbf24" />
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Space:</span>
          <span className="mono-font" style={{ fontSize: '0.76rem', color: '#60a5fa', fontWeight: '700' }}>
            {algoConfig?.metadata?.spaceComplexity}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.4)'
        }}
      >
        {[
          { id: 'pseudocode', label: 'Pseudocode' },
          { id: 'queue', label: 'Queue / Stack State' },
          { id: 'trace', label: 'Step Trace Log' },
          { id: 'comparison', label: 'DAA Comparison' }
        ].map(tab => (
          <button
            key={tab.id}
            style={{
              flex: 1,
              padding: '8px 4px',
              fontSize: '0.74rem',
              fontWeight: '600',
              background: activeTab === tab.id ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #f59e0b' : '2px solid transparent',
              color: activeTab === tab.id ? '#fbbf24' : '#94a3b8',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* TAB 1: PSEUDOCODE */}
        {activeTab === 'pseudocode' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {algoConfig?.pseudocode?.map((line, idx) => {
              const lineNumber = idx + 1;
              const isCurrentLine = currentStep.line === lineNumber;

              return (
                <div
                  key={`pseudo_${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    background: isCurrentLine ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                    border: isCurrentLine ? '1px solid #f59e0b' : '1px solid transparent',
                    boxShadow: isCurrentLine ? '0 0 10px rgba(245, 158, 11, 0.4)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span
                    className="mono-font"
                    style={{
                      width: '24px',
                      fontSize: '0.72rem',
                      color: isCurrentLine ? '#fbbf24' : '#64748b',
                      fontWeight: '700'
                    }}
                  >
                    {lineNumber}
                  </span>
                  <span
                    className="mono-font"
                    style={{
                      fontSize: '0.76rem',
                      color: isCurrentLine ? '#ffffff' : '#cbd5e1',
                      fontWeight: isCurrentLine ? '700' : '400'
                    }}
                  >
                    {line.replace(/^\d+\.\s*/, '')}
                  </span>
                </div>
              );
            })}

            <div style={{ marginTop: '14px', padding: '10px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>Algorithm Insight:</span>
              <p style={{ fontSize: '0.74rem', color: '#e2e8f0', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                {algoConfig?.metadata?.description}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: QUEUE / STACK / DATA STRUCTURE STATE */}
        {activeTab === 'queue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Priority Queue (Dijkstra / A*) */}
            {currentStep.pq && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fbbf24', marginBottom: '6px', display: 'block' }}>
                  Priority Queue / Min-Heap ({currentStep.pq.length} items)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                  {currentStep.pq.map((item, idx) => (
                    <div
                      key={`pq_${idx}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '5px 10px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        border: idx === 0 ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <span style={{ color: '#f8fafc', fontWeight: idx === 0 ? '700' : '400' }}>
                        {idx === 0 ? 'Head: ' : `${idx + 1}. `} {item.nodeId}
                      </span>
                      <span className="mono-font" style={{ color: '#34d399', fontWeight: '700' }}>
                        {item.h !== undefined ? `f=${item.dist} (g=${item.g}, h=${item.h})` : `${item.dist}m`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FIFO Queue (BFS) */}
            {currentStep.queue && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#60a5fa', marginBottom: '6px', display: 'block' }}>
                  BFS FIFO Queue ({currentStep.queue.length} vertices)
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {currentStep.queue.map((nodeId, idx) => (
                    <span
                      key={`q_${idx}`}
                      className="mono-font"
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid #3b82f6',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        color: '#93c5fd'
                      }}
                    >
                      {nodeId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* LIFO Stack (DFS) */}
            {currentStep.stack && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#a78bfa', marginBottom: '6px', display: 'block' }}>
                  DFS Call Stack (Top to Bottom)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '4px' }}>
                  {currentStep.stack.map((nodeId, idx) => (
                    <div
                      key={`stk_${idx}`}
                      style={{
                        padding: '4px 8px',
                        background: idx === currentStep.stack.length - 1 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(15, 23, 42, 0.8)',
                        border: idx === currentStep.stack.length - 1 ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '4px',
                        fontSize: '0.74rem',
                        color: '#f8fafc'
                      }}
                    >
                      {nodeId} {idx === currentStep.stack.length - 1 ? '← (TOP)' : ''}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DSU Components (Kruskal) */}
            {currentStep.dsuSets && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f59e0b', marginBottom: '6px', display: 'block' }}>
                  Disjoint Set Union (DSU) Partitions ({currentStep.dsuSets.length} sets)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                  {currentStep.dsuSets.slice(0, 10).map((s, idx) => (
                    <div
                      key={`dsu_${idx}`}
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        color: '#fef08a'
                      }}
                    >
                      <strong style={{ color: '#fbbf24' }}>Tree Component {idx + 1} (Root {s.root}):</strong> {s.members.join(', ')}
                    </div>
                  ))}
                  {currentStep.dsuSets.length > 10 && (
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      + {currentStep.dsuSets.length - 10} additional components
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Edge Pool (Kruskal) */}
            {currentStep.edgePool && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fbbf24', marginBottom: '6px', display: 'block' }}>
                  Sorted Edge Pool ({currentStep.edgePool.length} candidate edges)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '130px', overflowY: 'auto' }}>
                  {currentStep.edgePool.map((e, idx) => {
                    const isCurrent = currentStep.currentEdge === e.id;
                    const isAccepted = currentStep.mstEdges?.includes(e.id);
                    return (
                      <div
                        key={`edge_pool_${idx}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 8px',
                          background: isCurrent ? 'rgba(245, 158, 11, 0.3)' : isAccepted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.8)',
                          border: isCurrent ? '1px solid #f59e0b' : isAccepted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '4px',
                          fontSize: '0.72rem'
                        }}
                      >
                        <span style={{ color: isCurrent ? '#fbbf24' : isAccepted ? '#34d399' : '#f8fafc', fontWeight: (isCurrent || isAccepted) ? '700' : '400' }}>
                          {isAccepted ? '✓ ' : ''}{e.id}
                        </span>
                        <span className="mono-font" style={{ color: '#34d399', fontWeight: '700' }}>
                          {e.weight}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Visited Set */}
            {currentStep.visited && currentStep.visited.length > 0 && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
                  Visited Vertices Set ({currentStep.visited.length})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
                  {currentStep.visited.map((v, i) => (
                    <span
                      key={`v_${i}`}
                      style={{
                        padding: '2px 6px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.4)',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        color: '#a5b4fc'
                      }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STEP TRACE LOG */}
        {activeTab === 'trace' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {steps.map((st, idx) => {
              const isSelected = idx === activeStepIndex;
              return (
                <div
                  key={`step_log_${idx}`}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                    border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.04)',
                    fontSize: '0.74rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => useSimulationStore.getState().setStepIndex(idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: '700', color: isSelected ? '#fbbf24' : '#94a3b8' }}>
                      Step {idx + 1}
                    </span>
                    {st.decision && (
                      <span
                        className="badge"
                        style={{
                          background: st.decision === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: st.decision === 'ACCEPTED' ? '#34d399' : '#f87171'
                        }}
                      >
                        {st.decision}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, color: '#f8fafc', lineHeight: '1.35' }}>
                    {st.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: ALGORITHMIC COMPARISON */}
        {activeTab === 'comparison' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24' }}>
                  <th style={{ textAlign: 'left', padding: '6px' }}>Algorithm</th>
                  <th style={{ textAlign: 'left', padding: '6px' }}>Time</th>
                  <th style={{ textAlign: 'left', padding: '6px' }}>Space</th>
                  <th style={{ textAlign: 'left', padding: '6px' }}>Optimality</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Dijkstra', time: 'O((V+E)log V)', space: 'O(V)', opt: 'Optimal (non-neg weights)' },
                  { name: 'A* Search', time: 'O(E) heuristic', space: 'O(V)', opt: 'Optimal with admissible h' },
                  { name: 'BFS', time: 'O(V+E)', space: 'O(V)', opt: 'Optimal unweighted hops' },
                  { name: 'DFS', time: 'O(V+E)', space: 'O(V)', opt: 'Not optimal (exhaustive)' },
                  { name: 'Kruskal MST', time: 'O(E log E)', space: 'O(V+E)', opt: 'Optimal Spanning Tree' },
                  { name: 'Prim MST', time: 'O((V+E)log V)', space: 'O(V+E)', opt: 'Optimal Spanning Tree' }
                ].map((row, i) => (
                  <tr key={`row_${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '6px', fontWeight: '700', color: '#f8fafc' }}>{row.name}</td>
                    <td className="mono-font" style={{ padding: '6px', color: '#34d399' }}>{row.time}</td>
                    <td className="mono-font" style={{ padding: '6px', color: '#60a5fa' }}>{row.space}</td>
                    <td style={{ padding: '6px', color: '#cbd5e1' }}>{row.opt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
