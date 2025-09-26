import { create } from "zustand";
import { persist } from "zustand/middleware";


const useTaskStore = create(
    persist(
        (set) => ({
            totalToday: 0,
            setTotalToday: (count) => set({ totalToday: count }),
        }),
        {
            name: "task-stats-storage",
            getStorage: () => localStorage,
        }
    )
)

export default useTaskStore