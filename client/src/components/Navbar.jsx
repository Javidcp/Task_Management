import { FaCalendar, FaMoon } from 'react-icons/fa6';
import Cookies from "js-cookie";
import useThemeStore from '../store/themeStore';
import { useState, useRef, useEffect } from 'react';
import { logout } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    const { theme, toggleTheme } = useThemeStore();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => { 
        try { 
            await logout(); 
            navigate("/login"); 
        } catch (err) { 
            console.error("Logout failed:", err); 
        } 
    };

    const toggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isDropdownOpen]);

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isDropdownOpen]);

    return (
        <div className={`fixed w-full p-2 border-b md:border-0 flex justify-between items-center z-40 ${theme === 'light' ? 'text-black bg-white' : 'text-white bg-[#181818]'}`}>
            <div>
                <div className='flex gap-3 items-center'>
                    <div className={`w-10 h-10 bg-blue-500 rounded-tr-4xl rounded-br-2xl rounded-bl-2xl rounded-tl-2xl flex justify-center items-center text-white`}>
                        <FaCalendar/>
                    </div>
                    <p className='font-bold text-2xl'>Listify</p>
                </div>
            </div>
            
            <div className='relative flex gap-5 items-center' ref={dropdownRef}>
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full cursor-pointer transition-colors"
                    aria-label="Toggle theme"
                >
                    <FaMoon/>
                </button>
                
                <div className="relative">
                    <button 
                        onClick={toggleDropdown}
                        className='w-10 h-10 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-colors flex items-center justify-center font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                        aria-label="User menu"
                    >
                        {user ? user.name.charAt(0).toUpperCase() : '?'}
                    </button>
                    
                    {isDropdownOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-40 md:hidden" 
                                onClick={() => setIsDropdownOpen(false)}
                            />
                            
                            <div 
                                className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${
                                    theme === 'light' 
                                        ? 'bg-white border border-gray-200' 
                                        : 'bg-[#282828] border border-gray-600'
                                }`}
                                role="menu"
                                aria-orientation="vertical"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className='py-1' role="none">
                                    {user && (
                                        <div className={`px-4 py-3 border-b ${
                                            theme === 'light' 
                                                ? 'border-gray-200' 
                                                : 'border-gray-600'
                                        }`}>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${
                                                        theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                                                    }`}>
                                                        {user.name}
                                                    </p>
                                                    {user.email && (
                                                        <p className={`text-xs ${
                                                            theme === 'light' ? 'text-gray-500' : 'text-gray-100'
                                                        }`}>
                                                            {user.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleLogout();
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 ${
                                            theme === 'light' 
                                                ? 'text-red-700 hover:bg-red-50' 
                                                : 'text-red-400 hover:bg-[#383838]'
                                        }`}
                                        role="menuitem"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;