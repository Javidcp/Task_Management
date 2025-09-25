import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import { startOfMonth, endOfMonth, isToday , startOfWeek, endOfWeek, format, eachDayOfInterval } from "date-fns";
import useThemeStore from "../store/themeStore";
import useCalendarStore from "../store/calendarStore";

const CalendarBox = () => {
    const { currentDate, setCurrentDate } = useCalendarStore();
    const { theme } = useThemeStore()
    const selectedDate = currentDate ? new Date(currentDate) : new Date();

    const handleSelectDate = (day) => {
        setCurrentDate(day);
    };

    const renderDays = () => {
        const monthStart = startOfMonth(selectedDate || new Date());
        const monthEnd = endOfMonth(selectedDate || new Date());

        const calendarStart = startOfWeek(monthStart);
        const calendarEnd = endOfWeek(monthEnd);

        const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

        return allDays.map((day) => {
            const today = isToday(day);
            const isCurrentMonth = day.getMonth() === (selectedDate ? selectedDate.getMonth() : new Date().getMonth());
            return (
                <div
                key={day.toString()}
                onClick={() => handleSelectDate(day)}
                className={`font-poppins flex justify-center items-center h-8 w-8 rounded-full text-[8px] cursor-pointer 
                    ${ isCurrentMonth ? "hover:bg-blue-200" : "text-gray-400 cursor-default"}
                    ${ today ? "bg-blue-500 text-white" : "" }
                `}>
                {format(day, "d")}
                </div>
            );
        });
    };

    return (
        <div className={`w-full sm:w-[80%] md:w-65 mt-2 mx-1 font-poppins ${theme === 'light' ? 'p-2' : 'bg-[#282828]  rounded p-2'}`}>
        <div className="flex justify-between items-center mb-2 px-2">
            <div className="flex ">
            </div>
            <div className="text-xs font-medium">{format(selectedDate, "MMMM")}</div>
            <div className="text-xs font-medium">{format(selectedDate, "yyyy")}</div>
        </div>

        <div className="grid grid-cols-7 text-center font-medium text-[8px]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
            ))}
        </div>

        <div className="grid grid-cols-7 text-center">{renderDays()}</div>
        </div>
    );
};

export default CalendarBox;