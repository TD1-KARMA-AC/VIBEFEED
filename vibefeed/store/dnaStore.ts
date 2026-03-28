import { create } from 'zustand';
import { VibeDNA } from '../types';

interface DNAState {
  dna: VibeDNA;
  interactions: number;
  tickInteraction: (type: 'like' | 'save' | 'listen' | 'skip') => void;
  setDNA: (dna: VibeDNA) => void;
}

const DEFAULT_DNA: VibeDNA = {
  primary_vibe: 'Late Night Melodic',
  secondary_vibe: 'Emotional EDM',
  hidden_vibe: 'Progressive House',
  primary_pct: 74,
  secondary_pct: 57,
  hidden_pct: 40,
  peak_time: 'Late Night',
  avg_bpm: 118,
  energy_style: 'Slow Build / Euphoric',
};

export const useDNAStore = create<DNAState>((set) => ({
  dna: DEFAULT_DNA,
  interactions: 0,
  tickInteraction: (type) => {
    const weight = type === 'like' ? 3 : type === 'save' ? 4 : type === 'listen' ? 1 : -1;
    set((state) => ({ interactions: state.interactions + Math.abs(weight) }));
  },
  setDNA: (dna) => set({ dna }),
}));
