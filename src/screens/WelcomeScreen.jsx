import React from 'react';
import { useSimulationStore } from '../store/simulationStore.js';
import {
  Sparkles,
  Compass,
  Code2,
  Trophy,
  Users,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export function WelcomeScreen() {
  const welcomeModalOpen = useSimulationStore(state => state.welcomeModalOpen);
  const setWelcomeModalOpen = useSimulationStore(state => state.setWelcomeModalOpen);

  if (!welcomeModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Divine Banner */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
            <span className="holy-title" style={{ fontSize: '1rem', color: '#fbbf24', letterSpacing: '0.1em' }}>
              ॥ रामकृष्ण हरी ॥
            </span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
          </div>
          <h1 className="holy-title" style={{ fontSize: '1.8rem', fontWeight: '900', color: '#f8fafc', margin: '4px 0' }}>
            PANDHARPUR DARSHAN 3D
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#fed7aa', margin: 0 }}>
            Immersive Pilgrimage City Simulation & DAA Algorithm Visualization
          </p>
        </div>

        {/* Narrative Intro */}
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.5', margin: 0 }}>
            Welcome to the sacred city of <strong>Pandharpur</strong> on the banks of Chandrabhaga River, home to Lord Vitthal and Rukmini Devi. This simulation bridges Maharashtra's 800-year-old Warkari pilgrimage heritage with university <strong>Design and Analysis of Algorithms (DAA)</strong> graph theory.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: '700', fontSize: '0.82rem', marginBottom: '4px' }}>
              <Code2 size={16} />
              <span>7 DAA Algorithms</span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>
              Dijkstra, A* Search, BFS, DFS, Kruskal's & Prim's MST, and Multi-Stop Itinerary with step-by-step trace.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: '700', fontSize: '0.82rem', marginBottom: '4px' }}>
              <Compass size={16} />
              <span>Full 3D City & Shrines</span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>
              Vitthal Mandir, Namdev Payari, Chandrabhaga Ghats, Pundalik Temple, Wadas, and Bazars.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: '700', fontSize: '0.82rem', marginBottom: '4px' }}>
              <ShieldAlert size={16} />
              <span>Barricades & Rerouting</span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>
              Simulate Ashadhi Ekadashi police barricades and dynamic crowd congestion rerouting.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f472b6', fontWeight: '700', fontSize: '0.82rem', marginBottom: '4px' }}>
              <Trophy size={16} />
              <span>6 Gamified Missions</span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>
              Solve pilgrim challenges, achieve optimal paths, and unlock holy yatra badges.
            </p>
          </div>
        </div>

        {/* Navigation Quick Tips */}
        <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <span>Left-Click: Orbit 3D</span>
          <span>Right-Click: Pan</span>
          <span>Scroll: Zoom</span>
          <span>Click: Inspect Landmarks</span>
        </div>

        {/* Enter Button */}
        <button
          className="btn btn-primary"
          style={{ padding: '12px', fontSize: '0.95rem' }}
          onClick={() => setWelcomeModalOpen(false)}
        >
          <span>Begin Pandharpur Darshan Simulation</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
