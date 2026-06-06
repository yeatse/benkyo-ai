import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const BADGE_STORE_KEY = 'benkyo-ai-badges';

const DEFAULT_COUNTERS = {
  dailyTasksCompleted: 0,
  totalCoinsEarned: 0,
  cakesEaten: 0,
  appealSuccess: 0,
};

function normalizeCounters(counters) {
  return {
    ...DEFAULT_COUNTERS,
    ...(counters && typeof counters === 'object' ? counters : {}),
  };
}

function normalizeUnlocked(unlocked) {
  if (!unlocked || typeof unlocked !== 'object') return {};
  return Object.fromEntries(
    Object.entries(unlocked).filter(([, value]) => Boolean(value))
  );
}

function positiveAmount(amount) {
  return Math.max(0, Number(amount) || 0);
}

const useBadgeStore = create(
  persist(
    (set, get) => ({
      unlocked: {},
      counters: DEFAULT_COUNTERS,
      coinBaselineSynced: false,

      unlockBadges(ids) {
        const badgeIds = Array.isArray(ids) ? ids : [ids];
        const currentUnlocked = get().unlocked ?? {};
        const newlyUnlockedIds = badgeIds.filter(id => id && !currentUnlocked[id]);
        if (newlyUnlockedIds.length === 0) return [];

        set(state => ({
          unlocked: {
            ...state.unlocked,
            ...Object.fromEntries(newlyUnlockedIds.map(id => [id, true])),
          },
        }));

        return newlyUnlockedIds;
      },

      syncCoinBaseline(currentCoins) {
        const coins = positiveAmount(currentCoins);
        const { coinBaselineSynced, counters } = get();
        if (coinBaselineSynced) return;

        set({
          coinBaselineSynced: true,
          counters: {
            ...counters,
            totalCoinsEarned: Math.max(counters.totalCoinsEarned ?? 0, coins),
          },
        });
      },

      addCoinsEarned(amount) {
        const delta = positiveAmount(amount);
        if (delta <= 0) return;
        set(state => ({
          counters: {
            ...state.counters,
            totalCoinsEarned: (state.counters.totalCoinsEarned ?? 0) + delta,
          },
        }));
      },

      recordCakeEaten(amount = 1) {
        const delta = positiveAmount(amount);
        if (delta <= 0) return;
        set(state => ({
          counters: {
            ...state.counters,
            cakesEaten: (state.counters.cakesEaten ?? 0) + delta,
          },
        }));
      },

      recordAppealSuccess(amount = 1) {
        const delta = positiveAmount(amount);
        if (delta <= 0) return;
        set(state => ({
          counters: {
            ...state.counters,
            appealSuccess: (state.counters.appealSuccess ?? 0) + delta,
          },
        }));
      },

      recordDailyTaskCompleted(amount = 1) {
        const delta = positiveAmount(amount);
        if (delta <= 0) return;
        set(state => ({
          counters: {
            ...state.counters,
            dailyTasksCompleted: (state.counters.dailyTasksCompleted ?? 0) + delta,
          },
        }));
      },
    }),
    {
      name: BADGE_STORE_KEY,
      merge: (persistedState, currentState) => {
        const persisted = persistedState && typeof persistedState === 'object'
          ? persistedState
          : {};

        return {
          ...currentState,
          ...persisted,
          unlocked: normalizeUnlocked(persisted.unlocked),
          counters: normalizeCounters(persisted.counters),
          coinBaselineSynced: Boolean(persisted.coinBaselineSynced),
        };
      },
      partialize: (state) => ({
        unlocked: state.unlocked,
        counters: state.counters,
        coinBaselineSynced: state.coinBaselineSynced,
      }),
    }
  )
);

export default useBadgeStore;
