import { create } from 'zustand';
import { SavedVehicle, SavedComparisonItem } from '../types/profile.types';
import { secureStorageService } from '../../../shared/services/secure-storage.service';

interface SavedState {
  savedVehicles: SavedVehicle[];
  savedComparisons: SavedComparisonItem[];
  activeUserId: string;

  // Sync / Hydration
  loadSavedForUser: (userId?: string | null) => Promise<void>;

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
  activeUserId: 'guest',

  loadSavedForUser: async (userId?: string | null) => {
    const targetKey = userId && userId.trim().length > 0 ? userId : 'guest';
    
    // Load persisted items for target user
    let userVehicles = await secureStorageService.getUserSavedVehicles(targetKey);
    let userComparisons = await secureStorageService.getUserSavedComparisons(targetKey);

    // If user logged in, check if guest has items to merge
    if (targetKey !== 'guest') {
      const guestVehicles = await secureStorageService.getUserSavedVehicles('guest');
      const guestComparisons = await secureStorageService.getUserSavedComparisons('guest');

      if (guestVehicles.length > 0) {
        guestVehicles.forEach((gv) => {
          if (!userVehicles.some((uv) => uv.id === gv.id || uv.slug === gv.slug)) {
            userVehicles = [gv, ...userVehicles];
          }
        });
        await secureStorageService.saveUserSavedVehicles(targetKey, userVehicles);
        await secureStorageService.saveUserSavedVehicles('guest', []);
      }

      if (guestComparisons.length > 0) {
        guestComparisons.forEach((gc) => {
          if (!userComparisons.some((uc) => uc.id === gc.id)) {
            userComparisons = [gc, ...userComparisons];
          }
        });
        await secureStorageService.saveUserSavedComparisons(targetKey, userComparisons);
        await secureStorageService.saveUserSavedComparisons('guest', []);
      }
    }

    set({
      savedVehicles: userVehicles,
      savedComparisons: userComparisons,
      activeUserId: targetKey,
    });
  },

  addSavedVehicle: (vehicle: SavedVehicle) => {
    const { savedVehicles, activeUserId } = get();
    if (!savedVehicles.some((v) => v.id === vehicle.id || v.slug === vehicle.slug)) {
      const updated = [vehicle, ...savedVehicles];
      set({ savedVehicles: updated });
      secureStorageService.saveUserSavedVehicles(activeUserId, updated);
    }
  },

  removeSavedVehicle: (idOrSlug: string) => {
    const { savedVehicles, activeUserId } = get();
    const updated = savedVehicles.filter(
      (v) => v.id !== idOrSlug && v.slug !== idOrSlug
    );
    set({ savedVehicles: updated });
    secureStorageService.saveUserSavedVehicles(activeUserId, updated);
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
    const { savedComparisons, activeUserId } = get();
    if (!savedComparisons.some((c) => c.id === comparison.id)) {
      const updated = [comparison, ...savedComparisons];
      set({ savedComparisons: updated });
      secureStorageService.saveUserSavedComparisons(activeUserId, updated);
    }
  },

  removeSavedComparison: (id: string) => {
    const { savedComparisons, activeUserId } = get();
    const updated = savedComparisons.filter((c) => c.id !== id);
    set({ savedComparisons: updated });
    secureStorageService.saveUserSavedComparisons(activeUserId, updated);
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
