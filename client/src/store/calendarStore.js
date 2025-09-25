import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCalendarStore = create(
    persist(
        (set) => ({
            currentDate: null,
            setCurrentDate: (date) => {
                if (date instanceof Date && !isNaN(date)) {
                    set({ currentDate: date.toISOString() });
                }
            },
        }),
        {
            name: "calendar-storage",
        }
    )
);

export default useCalendarStore;
