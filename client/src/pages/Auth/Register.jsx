import Cookies from "js-cookie";
import { FaFacebook  } from "react-icons/fa6";
import Google from "../../assets/google.png"
import Apple from "../../assets/apple.png"
import { useForm } from 'react-hook-form';
import { registering } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";



const Register = () => {
    const { register, handleSubmit, formState } = useForm()
    const { errors } = formState
    const [apiError, setApiError] = useState("");
    const navigate = useNavigate();
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    
    useEffect(() => {
        if (user) navigate('/dashboard')
    }, [user, navigate])

    const onSubmit = async (data) => {
        try {
            setApiError("");
            await registering(data);
            navigate("/login");
            toast.success("Register successfull")
        } catch (err) {
            setApiError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <>
        <div className="w-full h-screen bg-cover bg-center relative flex justify-center items-center pt-10">
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 md:top-2/2 md:-translate-y-2/2 w-full ">
                <svg width="100%" height="400" viewBox="0 0 1000 400" preserveAspectRatio="none" className=" overflow-hidden">
                    {generateWaveLines(20, 1000)}
                </svg>
            </div>

            <div className="max-w-lg md:w-lg bg-gray-100/30 backdrop-blur-[2px] shadow-lg border border-[#f2f2f2]  z-30 flex flex-col items-center gap-7 py-10 rounded-4xl h-fit">
                <div className="text-center">
                    <p className="font-bold text-blue-500 text-lg">Register</p>
                    <p className="text-gray-600">Welcome ! Sign in using your social <br />account or email to contain us</p>
                </div>
                <div className="flex gap-3">
                    <div className='p-2 rounded-full border border-[#fefefe] text-blue-400 bg-white'>
                        <FaFacebook size={20} />
                    </div>
                    <div className="p-1.5 border border-[#fefefe] rounded-full bg-white">
                        <img src={Google} className="w-6 h-6" alt="" />
                    </div>
                    <div className="p-2 border border-[#fefefe] rounded-full bg-white">
                        <img src={Apple} className="w-4 h-4" alt="" />
                    </div>
                </div>

                {apiError && (
                    <p className="text-red-500 text-sm font-semibold">{apiError}</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 items-center">
                    <label className="bg-[#fefefe] p-2 rounded">
                        <input 
                            {...register("name", { required: true })}
                            placeholder="Enter your name"
                            className="py-1 border-b focus:outline-0 border-[#ddd] min-w-60"
                        />
                    </label>
                    { errors.name && <span className="text-xs text-red-500">Name is required</span> }
                    <label className="bg-[#fefefe] p-2 rounded">
                        <input 
                            {...register("email", { required: true })}
                            placeholder="Enter your email"
                            className="py-1 border-b focus:outline-0 border-[#ddd] min-w-60"
                        />
                        { errors.email && <span className="text-xs text-red-500">Email is required</span> }
                    </label>
                    <label className="bg-[#fefefe] p-2 rounded">
                        <input 
                            {...register("password", { required: true })}
                            placeholder="Enter your password"
                            className="py-1 border-b border-[#ddd] min-w-60"
                        />
                        { errors.password && <span className="text-xs text-red-500">Password is required</span> }
                    </label>
                    <button type="submit" className="p-2 px-5 shadow-lg border border-[#fefefe] font-semibold text-lg rounded bg-[#f9f9f9] w-fit ">Register</button>
                </form>
                <div className="text-xs text-gray-500">
                    Already have account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-500 underline"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
        </>
    );
};

export default Register;


const generateWaveLines = (count = 20, svgWidth = 1000) => {
    const lines = [];
    for (let i = 0; i < count; i++) {
    const yOffset = i * 8;
    const amplitude = 40 + i * 2;
    lines.push(
        <path
        key={i}
        d={`M 0,${150 + yOffset} Q ${svgWidth * 0.25},${
            150 + yOffset - amplitude
        } ${svgWidth * 0.5},${150 + yOffset} T ${svgWidth},${150 + yOffset}`}
        stroke="#3b82f6"
        strokeWidth="2"
        fill="none"
        opacity={0.7 - i * 0.03}
        />
    );
    }
    return lines;
};
