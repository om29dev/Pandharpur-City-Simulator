import { create } from 'zustand';
import { buildPandharpurGraph } from '../engine/graph/graphModel.js';
import { getAlgorithmById } from '../engine/algorithms/algorithmRegistry.js';
import { getLandmarkById } from '../data/landmarks.js';
import { MISSIONS, getMissionById } from '../data/missions.js';
import confetti from 'canvas-confetti';

export const GUIDED_TOUR_STOPS = [
  {
    id: 'PANDHARPUR_RAILWAY_STATION',
    title: 'Pandharpur Railway Station',
    marathi: 'पंढरपूर रेल्वे स्थानक',
    description: 'Western gateway welcoming millions of Warkari pilgrims from across Maharashtra and India.',
    coords: [-170, 0.1, 65],
    camPos: [-170, 16, 95],
    lookAt: [-170, 2, 65]
  },
  {
    id: 'SHIVAJI_CHOWK',
    title: 'Chhatrapati Shivaji Maharaj Chowk',
    marathi: 'छत्रपती शिवाजी महाराज चौक',
    description: 'Central roundabout connecting transit avenues to the sacred temple precinct.',
    coords: [-55, 0.1, 0],
    camPos: [-55, 14, 25],
    lookAt: [-55, 2, 0]
  },
  {
    id: 'MAHADWAR_CHOWK',
    title: 'Mahadwar Bazaar & Alley',
    marathi: 'महाद्वार बाजार चौक',
    description: 'Bustling historic bazaar lined with carved timber wadas, tulsi malas, and devotional stalls.',
    coords: [-20, 0.1, 20],
    camPos: [-20, 10, 36],
    lookAt: [-20, 2, 20]
  },
  {
    id: 'NAMDEV_PAYARTHI',
    title: 'Sant Namdev Payari',
    marathi: 'संत नामदेव पायरी',
    description: 'Sacred first step where Sant Namdev took samadhi, expressing supreme humility before Lord Vitthal.',
    coords: [-4, 0.4, 15],
    camPos: [-4, 6, 26],
    lookAt: [-4, 1.2, 15]
  },
  {
    id: 'VITTHAL_RUKMINI_MANDIR',
    title: 'Shree Vitthal-Rukmini Mandir',
    marathi: 'श्री विठ्ठल रुक्मिणी मंदिर',
    description: 'Spiritual epicenter of Pandharpur with grand Hemadpanthi shikhara and golden kalasha.',
    coords: [0, 0, 0],
    camPos: [0, 24, 34],
    lookAt: [0, 10, 0]
  },
  {
    id: 'CHANDRABHAGA_GHAT',
    title: 'Chandrabhaga Mahaghat',
    marathi: 'चंद्रभागा महाघाट',
    description: 'Crescent riverfront with carved basalt steps where pilgrims take holy snan (sacred bath).',
    coords: [95, -1.0, 0],
    camPos: [72, 12, 0],
    lookAt: [95, -0.4, 0]
  },
  {
    id: 'PUNDALIKA_MANDIR',
    title: 'Bhakta Pundalik Mandir',
    marathi: 'भक्त पुंडलिक मंदिर',
    description: 'Island shrine in the Chandrabhaga riverbed dedicated to Bhakta Pundalik who threw the holy brick.',
    coords: [115, -0.6, 5],
    camPos: [100, 10, 16],
    lookAt: [115, 2.5, 5]
  },
  {
    id: 'ISKCON_PANDHARPUR',
    title: 'ISKCON Chandrabhaga Mandir',
    marathi: 'इस्कॉन पंढरपूर मंदिर',
    description: 'Peaceful riverside campus with traditional stone architecture and sprawling gardens.',
    coords: [95, 0.1, -120],
    camPos: [76, 16, -100],
    lookAt: [95, 4, -120]
  }
];

export const useSimulationStore = create((set, get) => ({
  // --- Algorithm & Routing Configuration ---
  selectedAlgorithm: 'DIJKSTRA',
  startNode: 'RAILWAY_STATION',
  endNode: 'VITTHAL_ENTRANCE',
  multiStops: ['PUNDALIK_NODE', 'NAMDEV_STEPS'],
  costMetric: 'distance', // 'distance' | 'crowd_time' | 'scenic'

  // --- Graph State & Mutations ---
  closedEdges: new Set(),
  crowdMultiplier: 1.0,

  // --- Execution & Step-by-Step Playback ---
  routeResult: null,
  activeStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1.0,
  isPlaybackMinimized: false,

  // --- Environment & 3D Visuals ---
  timeOfDay: 'day', // 'day' | 'evening' | 'night' | 'aarti'
  cameraMode: 'orbit', // 'orbit' | 'flyover' | 'landmark' | 'aerial' | 'ground' | 'guided_tour'
  selectedLandmarkId: null,
  focusedCoordinates: [0, 0, 0],
  showGraphOverlay: true,
  showCrowdParticles: true,
  showHeatmap: false,
  bloomEnabled: true,

  // --- Guided Tour & Ground Navigation ---
  guidedTourActive: false,
  guidedTourIndex: 0,
  isTourPaused: false,
  moveJoystickVector: { x: 0, y: 0 },

  // --- UI Panes ---
  isSidebarOpen: false,
  isAlgorithmLabOpen: false,
  isMissionPanelOpen: false,
  isNetworkEditorOpen: false,
  welcomeModalOpen: true,

  // --- Gamification & Missions ---
  activeMissionId: null,
  completedMissions: [],

  // --- Actions ---

  setAlgorithm: (algorithmId) => {
    set({ selectedAlgorithm: algorithmId, activeStepIndex: 0, isPlaying: false });
    get().runCurrentAlgorithm();
  },

  setStartNode: (nodeId) => {
    set({ startNode: nodeId, activeStepIndex: 0 });
    get().runCurrentAlgorithm();
  },

  setEndNode: (nodeId) => {
    set({ endNode: nodeId, activeStepIndex: 0 });
    get().runCurrentAlgorithm();
  },

  setMultiStops: (stops) => {
    set({ multiStops: stops, activeStepIndex: 0 });
    get().runCurrentAlgorithm();
  },

  addMultiStop: (stopId) => {
    const current = get().multiStops;
    if (!current.includes(stopId)) {
      set({ multiStops: [...current, stopId] });
      get().runCurrentAlgorithm();
    }
  },

  removeMultiStop: (stopId) => {
    set({ multiStops: get().multiStops.filter(id => id !== stopId) });
    get().runCurrentAlgorithm();
  },

  setCostMetric: (metric) => {
    set({ costMetric: metric });
    get().runCurrentAlgorithm();
  },

  setCrowdMultiplier: (mult) => {
    set({ crowdMultiplier: mult });
    get().runCurrentAlgorithm();
  },

  toggleEdgeBarricade: (edgeId) => {
    const current = new Set(get().closedEdges);
    if (current.has(edgeId)) {
      current.delete(edgeId);
    } else {
      current.add(edgeId);
    }
    set({ closedEdges: current, activeStepIndex: 0 });
    get().runCurrentAlgorithm();
  },

  resetAllBarricades: () => {
    set({ closedEdges: new Set(), activeStepIndex: 0 });
    get().runCurrentAlgorithm();
  },

  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setCameraMode: (mode) => {
    if (mode === 'guided_tour') {
      get().startGuidedTour();
    } else {
      set({ cameraMode: mode, guidedTourActive: false });
    }
  },

  startGuidedTour: () => {
    set({
      cameraMode: 'guided_tour',
      guidedTourActive: true,
      guidedTourIndex: 0,
      isTourPaused: false,
      selectedLandmarkId: null,
      isAlgorithmLabOpen: false,
      isMissionPanelOpen: false,
      isNetworkEditorOpen: false
    });
  },

  stopGuidedTour: () => {
    set({
      guidedTourActive: false,
      cameraMode: 'orbit'
    });
  },

  nextTourStop: () => {
    const { guidedTourIndex } = get();
    if (guidedTourIndex < GUIDED_TOUR_STOPS.length - 1) {
      set({ guidedTourIndex: guidedTourIndex + 1 });
    } else {
      set({ guidedTourIndex: 0 });
    }
  },

  prevTourStop: () => {
    const { guidedTourIndex } = get();
    if (guidedTourIndex > 0) {
      set({ guidedTourIndex: guidedTourIndex - 1 });
    } else {
      set({ guidedTourIndex: GUIDED_TOUR_STOPS.length - 1 });
    }
  },

  toggleTourPause: () => set(state => ({ isTourPaused: !state.isTourPaused })),
  setTourIndex: (idx) => set({ guidedTourIndex: Math.max(0, Math.min(idx, GUIDED_TOUR_STOPS.length - 1)) }),
  setMoveJoystickVector: (vec) => set({ moveJoystickVector: vec }),

  toggleGraphOverlay: () => set(state => ({ showGraphOverlay: !state.showGraphOverlay })),
  toggleCrowdParticles: () => set(state => ({ showCrowdParticles: !state.showCrowdParticles })),
  toggleHeatmap: () => set(state => ({ showHeatmap: !state.showHeatmap })),
  toggleBloom: () => set(state => ({ bloomEnabled: !state.bloomEnabled })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  togglePlaybackMinimized: () => set(state => ({ isPlaybackMinimized: !state.isPlaybackMinimized })),

  setAlgorithmLabOpen: (open) => set({
    isAlgorithmLabOpen: open,
    ...(open ? { selectedLandmarkId: null, isMissionPanelOpen: false, isNetworkEditorOpen: false } : {})
  }),
  setMissionPanelOpen: (open) => set({
    isMissionPanelOpen: open,
    ...(open ? { selectedLandmarkId: null, isAlgorithmLabOpen: false, isNetworkEditorOpen: false } : {})
  }),
  setNetworkEditorOpen: (open) => set({
    isNetworkEditorOpen: open,
    ...(open ? { selectedLandmarkId: null, isAlgorithmLabOpen: false, isMissionPanelOpen: false } : {})
  }),
  setWelcomeModalOpen: (open) => set({ welcomeModalOpen: open }),

  selectLandmark: (landmarkId) => {
    const landmark = getLandmarkById(landmarkId);
    if (landmark) {
      set({
        selectedLandmarkId: landmarkId,
        focusedCoordinates: landmark.coordinates,
        cameraMode: 'landmark',
        isAlgorithmLabOpen: false,
        isMissionPanelOpen: false,
        isNetworkEditorOpen: false
      });
    } else {
      set({ selectedLandmarkId: null });
    }
  },

  // --- Step Timeline Controls ---
  setStepIndex: (index) => {
    const maxSteps = get().routeResult?.steps?.length || 1;
    const clamped = Math.max(0, Math.min(index, maxSteps - 1));
    set({ activeStepIndex: clamped });
  },

  stepForward: () => {
    const { activeStepIndex, routeResult } = get();
    if (routeResult?.steps && activeStepIndex < routeResult.steps.length - 1) {
      set({ activeStepIndex: activeStepIndex + 1 });
    }
  },

  stepBackward: () => {
    const { activeStepIndex } = get();
    if (activeStepIndex > 0) {
      set({ activeStepIndex: activeStepIndex - 1 });
    }
  },

  togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  // --- Central Execution Runner ---
  runCurrentAlgorithm: () => {
    const {
      selectedAlgorithm,
      startNode,
      endNode,
      multiStops,
      closedEdges,
      crowdMultiplier,
      costMetric
    } = get();

    const graph = buildPandharpurGraph({
      closedEdges,
      crowdMultiplier,
      costMetric
    });

    const algoDef = getAlgorithmById(selectedAlgorithm);
    let result = null;

    try {
      if (selectedAlgorithm === 'MULTI_STOP') {
        result = algoDef.runner(graph, startNode, endNode, { multiStops });
      } else {
        result = algoDef.runner(graph, startNode, endNode);
      }
    } catch (e) {
      console.error('Error executing algorithm:', e);
    }

    set({
      routeResult: result,
      activeStepIndex: result?.steps?.length ? result.steps.length - 1 : 0
    });

    // Check mission condition
    get().checkMissionProgress();
  },

  // --- Mission System ---
  startMission: (missionId) => {
    const mission = getMissionById(missionId);
    if (!mission) return;

    set({
      activeMissionId: missionId,
      selectedAlgorithm: mission.algorithm || 'DIJKSTRA',
      startNode: mission.sourceNodeId || get().startNode,
      endNode: mission.targetNodeId || get().endNode,
      isMissionPanelOpen: false,
      activeStepIndex: 0
    });

    if (mission.closedEdgeId) {
      const nextClosed = new Set(get().closedEdges);
      nextClosed.add(mission.closedEdgeId);
      set({ closedEdges: nextClosed });
    }

    if (mission.intermediateStops) {
      set({ multiStops: mission.intermediateStops });
    }

    get().runCurrentAlgorithm();
  },

  checkMissionProgress: () => {
    const { activeMissionId, completedMissions } = get();
    if (!activeMissionId) return;

    const mission = getMissionById(activeMissionId);
    if (!mission || completedMissions.includes(activeMissionId)) return;

    const isSatisfied = mission.validate(get());
    if (isSatisfied) {
      set({ completedMissions: [...completedMissions, activeMissionId] });
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }
  }
}));
