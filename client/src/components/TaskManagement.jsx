import Emoji from "../assets/emoji.png";
import { useForm, Controller } from "react-hook-form";
import useThemeStore from "../store/themeStore";
import { useEffect, useMemo, useState, useCallback } from "react";
import { MdArrowForwardIos, MdClose, MdDelete } from "react-icons/md";
import { FaCheck, FaPlus } from "react-icons/fa6";
import api from "../api/instance";
import useCalendarStore from "../store/calendarStore";
import { format, isToday } from "date-fns";
import useTaskStore from "../store/taskStore";

const colors = [
  "#A7F3D0", "#C084FC", "#FEB6A0", "#7DD3FC", "#FEF08A",
  "#4ADE80", "#2DD4BF", "#60A5FA", "#818CF8", "#A78BFA",
  "#F472B6", "#F87171", "#9CA3AF"
];

const TaskManagement = () => {
  const { theme } = useThemeStore();
  const { setTotalToday, setTagCount } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const allDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const currentDateISO = useCalendarStore((state) => state.currentDate);
  const selectedDate = useMemo(() => {return currentDateISO ? new Date(currentDateISO) : null;}, [currentDateISO]);  
  const displayDate = isToday(selectedDate) ? "Today" : format(selectedDate, "MMMM dd, yyyy");

  const {register, handleSubmit, watch, setValue, control, reset, formState: { errors }} = useForm({
    defaultValues: {
      title: "",
      description: "",
      color: "",
      cycle: "Weekly",
      isEnabled: false,
      selectedDays: ["Sat", "Sun"],
      selectedDate: 15,
      selectedTags: ""
    }
  });

  const watchCycle = watch("cycle");
  const watchIsEnabled = watch("isEnabled");
  const watchSelectedDate = watch("selectedDate");
  const watchSelectedDays = watch("selectedDays");

  const cycles = useMemo(() => ["Daily", "Weekly", "Monthly"], []);
  const days = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], []);
  const dates = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

const fetchTasks = useCallback(async () => {
  if (!currentDateISO) return;

  try {
    const currentDate = new Date(currentDateISO);
    const day = currentDate.getDate();
    const dayName = format(currentDate, "EEE");    

    const res = await api.get(`/api/task/all?date=${currentDate}`);
    const tasksFromDB = res.data;

    const filteredTasks = tasksFromDB.filter(task => {
      if (!task.repeatInterval) {
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        const today = new Date(currentDate);
        today.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }

      if (task.repeat.type === "Daily") return true;
      if (task.repeat.type === "Weekly") return task.repeat.days?.includes(dayName);
      if (task.repeat.type === "Monthly") return task.repeat.dayOfMonth === day;

      return false;
    });

    setTasks(filteredTasks);
      setTotalToday(filteredTasks.length);
      console.log(filteredTasks.length);
      

const tagsCount = {};
tasksFromDB.forEach(task => {
  if (task.tags) tagsCount[task.tags] = (tagsCount[task.tags] || 0) + 1;
});
setTagCount(tagsCount);
console.log(tagsCount);

  } catch (err) {
    console.error(err);
  }
}, [currentDateISO, setTagCount, setTotalToday]);


  useEffect(() => { 
    fetchTasks(); 
  }, [fetchTasks]);

  useEffect(() => {
    api.get("/api/task/tags")
      .then(res => setTags(res.data.tags))
      .catch(err => console.error(err));
  }, []);

  const handleToggleRead = async (taskId, date) => {
    try {
      const dateStr = date.toISOString().slice(0, 10);
      const { data: updatedTask } = await api.put(
        `/api/task/${taskId}/toggle-read`,
        { date: dateStr },
        { headers: { "Content-Type": "application/json" } }
      );
      setTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task));
    } catch (err) {
      console.error("Error toggling read:", err);
    }
  };


  const toggleExpand = (taskId) => {
    setExpandedTaskId(prev => (prev === taskId ? null : taskId));
  };


  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/api/task/${taskId}/delete`)
      setTasks(prev => prev.filter(task => task._id !== taskId))
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      
    }
  }

  const toggleDay = (day) => {
    const currentDays = watchSelectedDays || [];
    if (currentDays.includes(day)) {
      setValue("selectedDays", currentDays.filter(d => d !== day));
    } else {
      setValue("selectedDays", [...currentDays, day]);
    }
  };

  const selectDate = (date) => setValue("selectedDate", date);
  const selectTag = (tag) => setValue("selectedTags", tag);

  const addNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) setTags(prev => [...prev, newTag]);
    setValue("selectedTags", newTag);
    setNewTag("");
    setShowTagInput(false);
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10, k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const onSubmit = (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      cardColor: data.color,
      repeat: {
        type: data.cycle,
        days: data.cycle === "Daily" ? allDay : data.selectedDays || [],
        dayOfMonth: data.cycle === "Monthly" ? data.selectedDate : null
      },
      repeatInterval: data.isEnabled,
      tags: data.selectedTags,
      date: new Date(),
      completed: false
    };

    api.post("/api/task/create", payload)
      .then(() => {
        reset();
        setIsOpen(false);
        fetchTasks();
      })
      .catch(err => console.error(err));
  };

  const selectedColor = watch("color");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="m-2 md:mt-10 md:mx-10 pt-3">
      {!isOpen ? (
        <div className="w-full min-h-[85vh] relative">
          <h2 className="font-bold text-2xl font-poppins">{displayDate}</h2>
          <div className="flex flex-col gap-2 mt-4">
            {tasks.map(task => {
              const selectedDateStr = selectedDate.toISOString().slice(0, 10);
              const isReadToday = task.isRead.includes(selectedDateStr);
              const isExpanded = expandedTaskId === task._id

              return (
                <div key={task._id}>
                  <div
                    style={{ backgroundColor: task.cardColor }}
                    className="p-2 w-full flex justify-between items-center gap-3 rounded-md"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={isReadToday}
                        onChange={(e) => {e.stopPropagation(); handleToggleRead(task._id, selectedDate)}}
                        className="appearance-none w-4 h-4 border-2 cursor-pointer border-white rounded checked:bg-green-500 checked:border-green-500"
                      />
                      <p onClick={() => toggleExpand(task._id)} className="cursor-pointer">{task.tags}</p>
                    </div>
                    <button onClick={() => handleDeleteTask(task._id)} className={`text-red-500 ${isExpanded ? 'block': 'hidden'}`}>
                      <MdDelete/>
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="p-2 mt-1 bg-gray-100 rounded-md">
                      <p><strong>Title:</strong> {task.title}</p>
                      <p><strong>Description:</strong> {task.description}</p>
                      <p><strong>Repeat:</strong> {task.repeatInterval === true ? task.repeat.type : 'No repeat'}</p>
                      <p><strong>Days:</strong> {task.repeat?.dayOfMonth || task.repeat?.days.join(", ")}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-0 right-0">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#f2f2f2] text-black shadow-lg p-4 rounded-full"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      ) : (
        <section className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-end">
              <h2 className="text-lg md:text-2xl font-bold">New Task</h2>
              <img
                src={Emoji}
                alt="Emoji"
                className={`w-8 h-8 md:w-10 md:h-10 ${theme === "light" ? "" : "invert"}`}
              />
            </div>
            <button onClick={() => {setIsOpen(prev => !prev); reset()}} className="text-red-500">
              <MdClose size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`flex flex-col gap-3 p-4 ${theme === "light" ? 'text-[#1E1C1CCC]' : 'bg-[#282828] text-white'}`}
          >
            <label className="py-2 pl-2 bg-gray-50 rounded">
              <input
                {...register("title", { required: true })}
                placeholder="Name your new task"
                className="border-b w-full focus:outline-0 placeholder:text-[#1E1C1CCC] placeholder:text-sm placeholder:font-medium border-gray-300"
              />
              {errors.title && <span className="text-red-500  text-xs">Task name is required</span>}
            </label>

            <label className="py-2 pl-2 bg-gray-50 rounded">
              <input
                {...register("description", { required: true })}
                placeholder="Describe your new task"
                className="border-b w-full focus:outline-0 placeholder:text-[#1E1C1CCC] placeholder:text-sm placeholder:font-medium border-gray-300"
              />
              {errors.description && <span className="text-red-500 text-xs">Description is required</span>}
            </label>

            <div className="flex flex-col gap-3 mt-3">
              <p className="font-bold text-sm">Card Color</p>
              <div className="flex flex-wrap gap-2 md:gap-4 mt-1">
                {colors.map(color => (
                  <label
                    key={color}
                    className={`rounded-full cursor-pointer border-2 md:border-4 ${selectedColor === color ? "border-[#b6b5b5]" : "border-gray-200"}`}
                  >
                    <input
                      type="radio"
                      value={color}
                      {...register("color", { required: true })}
                      className="hidden"
                    />
                    <span
                      className={`w-5 h-5 md:w-10 md:h-10 block rounded-full`}
                      style={{ backgroundColor: color }}
                    />
                  </label>
                ))}
              </div>
              {errors.color && <span className="text-red-500 text-xs">Please select a color</span>}
            </div>

            <div className={`w-full p-7 ${theme === "light" ? 'bg-gray-50' : 'bg-gray-200/10'}`}>
              <div className="space-y-3">
                <h2 className="font-bold text-sm md:text-[16px]">Repeat</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b mb-4">
                      <p className=" text-xs md:text-sm">Set a cycle for your task</p>
                      <Controller
                        name="isEnabled"
                        control={control}
                        render={({ field }) => (
                          <button
                            type="button"
                            onClick={() => field.onChange(!field.value)}
                            className={`relative inline-flex h-3 w-6 items-center rounded-full transition-colors ${field.value ? 'bg-black' : 'bg-gray-200'}`}
                          >
                            <span
                              className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${field.value ? 'translate-x-3' : 'translate-x-1'}`}
                            />
                          </button>
                        )}
                      />
                    </div>

                    <div className="flex space-x-1 bg-gray-100 rounded-full w-full">
                      {cycles.map(cycleOption => (
                        <button
                          key={cycleOption}
                          type="button"
                          onClick={() => setValue("cycle", cycleOption)}
                          className={`text-center w-full py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${watchCycle === cycleOption ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                          {cycleOption}
                        </button>
                      ))}
                    </div>

                    {watchCycle === 'Daily' && <p className="py-4  text-center ">Repeats every day</p>}
                    {watchCycle === 'Weekly' && (
                      <div className="grid grid-cols-7 gap-2">
                        {days.map(day => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`py-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${watchSelectedDays.includes(day) ? 'bg-gray-300  text-[#1E1C1CCC]' : ' hover:bg-gray-50'}`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    )}
                    {watchCycle === 'Monthly' && (
                      <div className="grid grid-cols-7 gap-2">
                        {dates.map(date => (
                          <button
                            key={date}
                            type="button"
                            onClick={() => selectDate(date)}
                            className={`py-1 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${watchSelectedDate === date ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            {date}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <span className=" text-xs sm:text-base font-medium">Repeat</span>
                      <div className="flex items-center gap-2 text-xs sm:text-base">
                        <span>
                          {watchIsEnabled
                            ? watchCycle === 'Daily'
                              ? 'Every day'
                              : watchCycle === 'Weekly'
                                ? 'Every week'
                                : `Every month on ${watchSelectedDate}${getOrdinalSuffix(watchSelectedDate)}`
                            : 'Off'}
                        </span>
                        <MdArrowForwardIos />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b mb-4 text-xs sm:text-sm">
                      Set a tag for your task
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {tags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => selectTag(tag)}
                          className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${watch("selectedTags") === tag ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {tag}
                        </button>
                      ))}

                      {showTagInput ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            placeholder="Enter tag"
                            className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                          />
                          <button
                            type="button"
                            onClick={addNewTag}
                            className="px-2 py-1 bg-gray-900 text-xs sm:text-base text-white rounded"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => { setShowTagInput(false); setNewTag(''); }}
                            className="px-2 py-1 bg-gray-300 text-xs sm:text-base text-gray-700 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowTagInput(true)}
                          className="px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"
                        >
                          <span>Add More</span>
                          <FaPlus />
                        </button>
                      )}
                    </div>
                      <input
                        type="hidden"
                        {...register("selectedTags", { required: "Please select a tag" })}
                        value={watch("selectedTags")}
                      />
                      {errors.selectedTags && (
                        <p className="text-red-500 text-xs mt-1">{errors.selectedTags.message}</p>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-4 rounded-full w-fit bg-[#f2f2f2] shadow-lg text-black mt-4"
              >
                <FaCheck />
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default TaskManagement;
