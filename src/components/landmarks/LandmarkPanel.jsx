import React, { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore.js';
import { getLandmarkById } from '../../data/landmarks.js';
import {
  Sparkles,
  Clock,
  Users,
  Compass,
  MapPin,
  Navigation,
  Plus,
  X,
  Flame,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

const resolveAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

export function LandmarkPanel() {
  const selectedLandmarkId = useSimulationStore(state => state.selectedLandmarkId);
  const selectLandmark = useSimulationStore(state => state.selectLandmark);
  const setStartNode = useSimulationStore(state => state.setStartNode);
  const setEndNode = useSimulationStore(state => state.setEndNode);
  const addMultiStop = useSimulationStore(state => state.addMultiStop);
  const [showArchivalMap, setShowArchivalMap] = useState(false);

  if (!selectedLandmarkId) return null;

  const landmark = getLandmarkById(selectedLandmarkId);
  if (!landmark) return null;

  return (
    <div
      className="glass-panel slide-in-right"
      style={{
        position: 'absolute',
        top: 'calc(var(--topbar-height) + 12px)',
        right: '12px',
        width: '340px',
        maxHeight: 'calc(100vh - var(--topbar-height) - 100px)',
        overflowY: 'auto',
        zIndex: 20,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid rgba(245, 158, 11, 0.45)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.8)'
      }}
    >
      {/* Header with Close */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <span className="badge badge-gold" style={{ marginBottom: '4px' }}>
            {landmark.category.toUpperCase()}
          </span>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#fbbf24', margin: '4px 0 2px 0' }}>
            {landmark.name}
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#fed7aa', margin: 0, fontWeight: '600' }}>
            {landmark.marathiName}
          </p>
        </div>
        <button
          className="btn btn-icon"
          onClick={() => selectLandmark(null)}
          style={{ padding: '4px', color: '#94a3b8' }}
          title="Close details"
        >
          <X size={15} />
        </button>
      </div>

      {/* Real-World Reference Image */}
      {landmark.image && (
        <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <img
            src={resolveAssetUrl(landmark.image)}
            alt={landmark.name}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(9, 13, 22, 0.95))',
              padding: '6px 10px',
              fontSize: '0.7rem',
              color: '#f8fafc',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Camera size={12} color="#f59e0b" />
              <span>Photographic Reference</span>
            </span>
            <span style={{ color: '#fbbf24' }}>Pandharpur</span>
          </div>
        </div>
      )}

      {/* Spiritual Significance */}
      <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '10px' }}>
        <p style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.45', margin: 0 }}>
          {landmark.significance}
        </p>
      </div>

      {/* Timings & Crowd Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.72rem' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', marginBottom: '2px' }}>
            <Clock size={12} />
            <span>Darshan Hours</span>
          </div>
          <span style={{ fontWeight: '600', color: '#f8fafc' }}>{landmark.darshanTime || 'Open All Day'}</span>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', marginBottom: '2px' }}>
            <Users size={12} />
            <span>Crowd Level</span>
          </div>
          <span style={{
            fontWeight: '700',
            color: landmark.crowdLevel === 'high' || landmark.crowdLevel === 'very_high' ? '#f87171' : '#34d399'
          }}>
            {landmark.crowdLevel ? landmark.crowdLevel.toUpperCase() : 'MODERATE'}
          </span>
        </div>
      </div>

      {/* Aarti Schedule if temple */}
      {landmark.aartiTimings && (
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.72rem', fontWeight: '700', marginBottom: '4px' }}>
            <Flame size={12} />
            <span>Holy Aarti Schedule</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.7rem', color: '#cbd5e1' }}>
            {landmark.aartiTimings.map((a, i) => (
              <span key={`aarti_${i}`}>• {a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Reference Map Toggle */}
      <button
        className="btn"
        style={{ fontSize: '0.72rem', padding: '6px', width: '100%' }}
        onClick={() => setShowArchivalMap(!showArchivalMap)}
      >
        <ImageIcon size={13} color="#f59e0b" />
        <span>{showArchivalMap ? 'Hide Reference Map' : 'View Pandharpur Archival Map'}</span>
      </button>

      {showArchivalMap && (
        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <img
            src={resolveAssetUrl('/images/map.png')}
            alt="Pandharpur City Reference Map"
            style={{ width: '100%', height: '180px', objectFit: 'contain', background: '#0f172a' }}
          />
        </div>
      )}

      {/* Action Buttons for Route Planning */}
      {landmark.graphNodeId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px', fontSize: '0.74rem' }}
              onClick={() => setStartNode(landmark.graphNodeId)}
            >
              <MapPin size={13} color="#34d399" />
              <span>Set as Start</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px', fontSize: '0.74rem' }}
              onClick={() => setEndNode(landmark.graphNodeId)}
            >
              <Navigation size={13} color="#fbbf24" />
              <span>Set as Goal</span>
            </button>
          </div>

          <button
            className="btn"
            style={{ padding: '6px', fontSize: '0.74rem' }}
            onClick={() => addMultiStop(landmark.graphNodeId)}
          >
            <Plus size={13} />
            <span>Add to Yatra Stops</span>
          </button>
        </div>
      )}
    </div>
  );
}
