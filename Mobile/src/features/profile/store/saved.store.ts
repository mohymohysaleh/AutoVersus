import { create } from 'zustand';
import { SavedVehicle, SavedComparisonItem } from '../types/profile.types';

interface SavedState {
  savedVehicles: SavedVehicle[];
  savedComparisons: SavedComparisonItem[];

  // Vehicle Actions
  addSavedVehicle: (vehicle: SavedVehicle) => void;
  removeSavedVehicle: (idOrSlug: string) => void;
  isVehicleSaved: (idOrSlug: string) => boolean;
  toggleSavedVehicle: (vehicle: SavedVehicle) => boolean;

  // Comparison Actions
  addSavedComparison: (comparison: SavedComparisonItem) => void;
  removeSavedComparison: (id: string) => void;
  isComparisonSaved: (id: string) => boolean;
  toggleSavedComparison: (comparison: SavedComparisonItem) => boolean;
}

export const useSavedStore = create<SavedState>((set, get) => ({
  savedVehicles: [],
  savedComparisons: [],

  addSavedVehicle: (vehicle: SavedVehicle) => {
    const { savedVehicles } = get();
    if (!savedVehicles.some((v) => v.id === vehicle.id || v.slug === vehicle.slug)) {
      set({ savedVehicles: [vehicle, ...savedVehicles] });
    }
  },

  removeSavedVehicle: (idOrSlug: string) => {
    set((state) => ({
      savedVehicles: state.savedVehicles.filter(
        (v) => v.id !== idOrSlug && v.slug !== idOrSlug
      ),
    }));
  },

  isVehicleSaved: (idOrSlug: string) => {
    if (!idOrSlug) return false;
    const { savedVehicles } = get();
    return savedVehicles.some((v) => v.id === idOrSlug || v.slug === idOrSlug);
  },

  toggleSavedVehicle: (vehicle: SavedVehicle) => {
    const { isVehicleSaved, addSavedVehicle, removeSavedVehicle } = get();
    const exists = isVehicleSaved(vehicle.id) || isVehicleSaved(vehicle.slug);
    if (exists) {
      removeSavedVehicle(vehicle.id);
      removeSavedVehicle(vehicle.slug);
      return false;
    } else {
      addSavedVehicle(vehicle);
      return true;
    }
  },

  addSavedComparison: (comparison: SavedComparisonItem) => {
    const { savedComparisons } = get();
    if (!savedComparisons.some((c) => c.id === comparison.id)) {
      set({ savedComparisons: [comparison, ...savedComparisons] });
    }
  },

  removeSavedComparison: (id: string) => {
    set((state) => ({
      savedComparisons: state.savedComparisons.filter((c) => c.id !== id),
    }));
  },

  isComparisonSaved: (id: string) => {
    if (!id) return false;
    const { savedComparisons } = get();
    return savedComparisons.some((c) => c.id === id);
  },

  toggleSavedComparison: (comparison: SavedComparisonItem) => {
    const { isComparisonSaved, addSavedComparison, removeSavedComparison } = get();
    if (isComparisonSaved(comparison.id)) {
      removeSavedComparison(comparison.id);
      return false;
    } else {
      addSavedComparison(comparison);
      return true;
    }
  },
}));
