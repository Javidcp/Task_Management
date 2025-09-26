import Cookies from "js-cookie";
import useThemeStore from "../../store/themeStore";
import CalendarBox from "../../components/Calendar";
import TaskManagement from "../../components/TaskManagement";
import { FaCalendar } from "react-icons/fa6";
import { useEffect } from "react";
import useTaskStore from "../../store/taskStore";
import useCalendarStore from "../../store/calendarStore";
import api from "../../api/instance";
import { useState } from "react";
import { format } from "date-fns";


const Dashboard = () => {
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const [ counts, setCount ] = useState({ t: 0, tagsCount: {} })
  const { theme } = useThemeStore()
  const { totalToday } = useTaskStore()
  const { currentDate } = useCalendarStore()


  useEffect(() => {
    if (!user) return;
  }, [user])


    const fetchCounts = async () => {
      try{
        const res = await api.get(`/api/task/count`)
        setCount(res.data)
      } catch (err) {
        console.error(err);
      }
    }

  return (
    <div className={`font-poppins min-h-screen flex flex-col md:flex-row ${theme === 'light' ? 'text-black bg-white' : 'text-white bg-[#181818]'}`}>
      
      <section className={`mt-14 md:mt-0 w-full md:min-h-screen h-full md:w-80 border-r border-b md:border-b-0 pb-5 md:pb-0 md:sticky md:top-0 flex flex-col  ${theme === 'light' ? ' border-[#ddd]' : ' border-[#242424]'}`}>
          <div className='md:flex hidden gap-3 items-center mt-3 ml-5'>
              <div className={` w-10 h-10 bg-blue-500 rounded-tr-4xl rounded-br-2xl rounded-bl-2xl rounded-tl-2xl flex justify-center items-center text-white`}>
                  <FaCalendar/>
              </div>
              <p className='font-bold text-2xl'>Listify</p>
          </div>
          <div className="flex justify-center w-full md:block">
            <CalendarBox/>
          </div>
          <div className="mx-4 flex flex-col gap-1 mt-1">
            <h2 className="text-[10px] font-bold">Tasks</h2>
            <div className={`flex justify-between items-center px-5 py-2 rounded text-xs  ${theme === 'light' ? 'bg-[#f5f5f5]' : 'text-white bg-[#282828]  '}`}>
              <p>{format(currentDate, "MMMM dd, yyyy")}</p>
              <p>{totalToday}</p>
            </div>
          </div>
          <div className="mx-4 flex flex-col gap-1 mt-3">
            <h2 className="text-[10px] font-bold">Lists</h2>
            <div className={`flex justify-between items-center px-5 py-2 rounded text-xs  ${theme === 'light' ? 'text-black bg-white' : 'text-white bg-[#282828] '}`}>
              <ul className="w-full text-sm flex flex-col gap-2">
                {Object.keys(counts.tagsCount).map(tag => (
                  <li key={tag} className="flex justify-between">
                    <p>{tag}</p> 
                    <p>
                      {counts.tagsCount[tag]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </section>

      <section className="w-full">
        <TaskManagement onTaskAdded={fetchCounts} />
      </section>
    </div>
  )
}

export default Dashboard
