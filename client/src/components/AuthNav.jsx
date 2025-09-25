import { FaCalendar } from 'react-icons/fa6'

const AuthNav = () => {
    return (
        <div className='fixed w-full border-b border-[#f2f2f2] bg-white p-3 md:px-20 flex justify-between items-center z-50'>
            <div className='flex gap-3 items-center'>
                <div className='w-10 h-10 bg-blue-500 rounded-tr-4xl rounded-br-2xl rounded-bl-2xl rounded-tl-2xl flex justify-center items-center text-white'>
                    <FaCalendar/>
                </div>
                <p className='font-bold text-2xl'>Listify</p>
            </div>
            <div className='flex gap-5'>
                <div className='text-gray-700 text-sm hover:text-blue-500 cursor-pointer transition-all duration-300 ease-in-out'>
                    About us
                </div>
                <div className='text-gray-700 text-sm hover:text-blue-500 cursor-pointer transition-all duration-300 ease-in-out'>
                    Contacts
                </div>
            </div>
        </div>
    )
}

export default AuthNav