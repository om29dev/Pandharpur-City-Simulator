import React, { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore.js';
import { PANDHARPUR_GRAPH_DATA } from '../../data/pedestrianGraph.js';
import { ALGORITHM_REGISTRY } from '../../engine/algorithms/algorithmRegistry.js';
import {
  Navigation,
  MapPin,
  Route,
  Flame,
  Clock,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';

export function Sidebar() {
  const isSidebarOpen = useSimulationStore(state => state.isSidebarOpen);
  const setSidebarOpen = useSimulationStore(state => state.setSidebarOpen);
  const selectedAlgorithm = useSimulationStore(state => state.selectedAlgorithm);
  const setAlgorithm = useSimulationStore(state => state.setAlgorithm);

  const startNode = useSimulationStore(state => state.startNode);
  const setStartNode = useSimulationStore(state => state.setStartNode);
  const endNode = useSimulationStore(state => state.endNode);
  const setEndNode = useSimulationStore(state => state.setEndNode);

  const multiStops = useSimulationStore(state => state.multiStops);
  const addMultiStop = useSimulationStore(state => state.addMultiStop);
  const removeMultiStop = useSimulationStore(state => state.removeMultiStop);

  const costMetric = useSimulationStore(state => state.costMetric);
  const setCostMetric = useSimulationStore(state => state.setCostMetric);
  const crowdMultiplier = useSimulationStore(state => state.crowdMultiplier);
  const setCrowdMultiplier = useSimulationStore(state => state.setCrowdMultiplier);

  const routeResult = useSimulationStore(state => state.routeResult);
  const runCurrentAlgorithm = useSimulationStore(state => state.runCurrentAlgorithm);

  const [stopToAdd, setStopToAdd] = useState('');

  const nodeMap = new Map(PANDHARPUR_GRAPH_DATA.nodes.map(n => [n.id, n]));
  const algoConfig = ALGORITHM_REGISTRY[selectedAlgorithm];

  if (!isSidebarOpen) {
    return (
      <button
        className="quick-access-btn"
        onClick={() => setSidebarOpen(true)}
        title="Open Route Planner"
      >
        <Route size={15} color="#fbbf24" />
        <span>Route Planner</span>
      </button>
    );
  }

  return (
    <aside
      className="glass-panel slide-in-left"
      style={{
        position: 'absolute',
        top: 'calc(var(--topbar-height) + 12px)',
        left: '12px',
        width: 'var(--sidebar-width)',
        bottom: '12px',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        overflowY: 'auto',
        gap: '16px',
        border: '1px solid rgba(245, 158, 11, 0.25)'
      }}
    >
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Route size={18} color="#f59e0b" />
          <h2 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
            Pilgrim Route Planner
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
            {selectedAlgorithm}
          </span>
          <button
            className="btn btn-icon"
            onClick={() => setSidebarOpen(false)}
            style={{ padding: '3px', color: '#94a3b8' }}
            title="Close Route Planner"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* 1. Algorithm Selector Dropdown */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
          Select DAA Algorithm
        </label>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 12px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '8px',
            color: '#fbbf24',
            fontWeight: '600',
            fontSize: '0.85rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {Object.values(ALGORITHM_REGISTRY).map(algo => (
            <option key={algo.id} value={algo.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
              {algo.name}
            </option>
          ))}
        </select>
        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
          {algoConfig?.metadata?.type} • {algoConfig?.metadata?.timeComplexity}
        </p>
      </div>

      {/* 2. Origin & Destination (for pathfinding algorithms) */}
      {algoConfig?.requiresTarget && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Start Point */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <MapPin size={13} color="#34d399" />
              <span>Starting Point (प्रारंभ)</span>
            </label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              {PANDHARPUR_GRAPH_DATA.nodes.map(n => (
                <option key={`start_${n.id}`} value={n.id} style={{ background: '#0f172a' }}>
                  {n.name} ({n.type.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <Navigation size={13} color="#fbbf24" />
              <span>Holy Destination (गंतव्य)</span>
            </label>
            <select
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              {PANDHARPUR_GRAPH_DATA.nodes.map(n => (
                <option key={`end_${n.id}`} value={n.id} style={{ background: '#0f172a' }}>
                  {n.name} ({n.type.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 3. Multi-Stop Waypoints Section (for Multi-Stop Itinerary) */}
      {selectedAlgorithm === 'MULTI_STOP' && (
        <div style={{ background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f472b6' }}>
              Intermediate Holy Stops ({multiStops.length})
            </span>
          </div>

          {/* Stops List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
            {multiStops.map((stopId, idx) => {
              const node = nodeMap.get(stopId);
              return (
                <div
                  key={`stop_${stopId}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(15, 23, 42, 0.8)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem'
                  }}
                >
                  <span style={{ color: '#fed7aa' }}>
                    {idx + 1}. {node?.name || stopId}
                  </span>
                  <button
                    onClick={() => removeMultiStop(stopId)}
                    style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add Stop Input */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <select
              value={stopToAdd}
              onChange={(e) => setStopToAdd(e.target.value)}
              style={{
                flex: 1,
                padding: '6px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '0.75rem'
              }}
            >
              <option value="">Select stop to add...</option>
              {PANDHARPUR_GRAPH_DATA.nodes
                .filter(n => !multiStops.includes(n.id) && n.id !== startNode && n.id !== endNode)
                .map(n => (
                  <option key={`add_stop_${n.id}`} value={n.id}>
                    {n.name}
                  </option>
                ))}
            </select>
            <button
              className="btn btn-secondary"
              style={{ padding: '4px 8px' }}
              onClick={() => {
                if (stopToAdd) {
                  addMultiStop(stopToAdd);
                  setStopToAdd('');
                }
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 4. Cost Metric & Crowd Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600', marginBottom: '4px', display: 'block' }}>
            Cost Optimization Metric
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            {[
              { id: 'distance', label: 'Distance' },
              { id: 'crowd_time', label: 'Crowd Time' },
              { id: 'scenic', label: 'Parikrama' }
            ].map(m => (
              <button
                key={m.id}
                className="btn"
                style={{
                  padding: '5px',
                  fontSize: '0.7rem',
                  background: costMetric === m.id ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.04)',
                  borderColor: costMetric === m.id ? '#f59e0b' : 'transparent',
                  color: costMetric === m.id ? '#fbbf24' : '#94a3b8'
                }}
                onClick={() => setCostMetric(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Crowd Multiplier Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
            <span>Crowd Congestion Level</span>
            <span style={{ color: crowdMultiplier > 1.8 ? '#f87171' : crowdMultiplier > 1.2 ? '#fbbf24' : '#34d399', fontWeight: '700' }}>
              {crowdMultiplier === 1.0 ? 'Normal Day (1.0x)' : crowdMultiplier === 1.8 ? 'Ekadashi (1.8x)' : `Peak Wari (${crowdMultiplier}x)`}
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.25"
            value={crowdMultiplier}
            onChange={(e) => setCrowdMultiplier(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#f97316', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* 5. Recalculate Button */}
      <button
        className="btn btn-primary"
        style={{ width: '100%', padding: '10px' }}
        onClick={runCurrentAlgorithm}
      >
        <Play size={16} />
        <span>Compute Optimal Route</span>
      </button>

      {/* 6. Route Summary Statistics Card */}
      {routeResult && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '12px',
            marginTop: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f8fafc' }}>
              Computation Result
            </span>
            {routeResult.totalCost === null ? (
              <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                NO PATH
              </span>
            ) : routeResult.mstEdges ? (
              <span className="badge badge-gold">SPANNING TREE</span>
            ) : (
              <span className="badge badge-green">OPTIMAL</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                {routeResult.treeCost ? 'Tree Route Distance' : 'Total Distance'}
              </span>
              <p style={{ fontSize: '1rem', fontWeight: '800', color: '#34d399', margin: 0 }}>
                {typeof routeResult.totalCost === 'number' ? `${routeResult.totalCost} m` : 'N/A'}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Est. Walk Time</span>
              <p style={{ fontSize: '1rem', fontWeight: '800', color: '#fbbf24', margin: 0 }}>
                {typeof routeResult.totalCost === 'number' ? `${Math.ceil(routeResult.totalCost / 65)} min` : 'N/A'}
              </p>
            </div>
          </div>

          {routeResult.treeCost && (
            <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                Full MST Grid Weight:
              </span>
              <span className="mono-font" style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: '700' }}>
                {routeResult.treeCost} m
              </span>
            </div>
          )}

          {routeResult.path && routeResult.path.length > 0 && (
            <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                Hops Traversed: {routeResult.path.length} waypoints
              </span>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {routeResult.path.map(id => nodeMap.get(id)?.name || id).join(' → ')}
              </div>
            </div>
          )}

          {routeResult.mstEdges && (
            <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                MST Edges Formed: {routeResult.mstEdges.length} connections
              </span>
            </div>
          )}

          {routeResult.totalCost === null && (
            <div style={{ marginTop: '8px', borderTop: '1px solid rgba(239,68,68,0.2)', paddingTop: '6px', fontSize: '0.72rem', color: '#f87171' }}>
              No route found between selected points. A road may be barricaded.
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
