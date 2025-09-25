import { create } from "zustand";
import { persist } from "zustand/middleware";


const useTaskStore = create(
    persist(
        (set) => ({
            totalToday: 0,
            tagCounts: {},
            setTotalToday: (count) => set({ totalToday: count }),
            setTagCount: (tags) => set({ taskCounts: tags })
        }),
        {
    name: "task-stats-storage",
    getStorage: () => localStorage,
  }
    )
)

export default useTaskStore