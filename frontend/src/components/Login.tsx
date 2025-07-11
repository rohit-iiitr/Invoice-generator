import { useEffect, useState } from "react";
import { BACKEND_URL } from "../utils/utils";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const sliderImages = ["/images/login1.jpg", "/images/login2.jpg"];

const Login: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.success) {
        toast.success("Login successful");
        localStorage.setItem("user", JSON.stringify(res.data));
        setTimeout(() => navigate("/products"), 1000);
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black overflow-hidden ">
      <Navbar
        navButton={
          <button
            onClick={() => navigate("/")}
            className="bg-transparent text-[#CCF575]  border border-[#CCF575] rounded-lg px-6 relative transform transition-transform duration-300 hover:translate-x-4 hover:bg-[#CCF575] hover:text-black"
          >
            Connect People With Technology
          </button>
        }
      />

      {/* Background effects */}
      <div className="absolute top-32 -right-56  w-[30%] h-[30%] rounded-full bg-[#4F59A8] mix-blend-screen filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-16 -left-44  w-[35%] h-[60%] rounded-full bg-[#CCF575] mix-blend-screen filter blur-3xl opacity-25 overflow-hidden"></div>
      {/* <div className="flex justify-center z-20 relative">
        <div className="container grid grid-cols-2 gap-10 items-center h-[90vh]"> */}

      {/* Main Full Page Layout */}
      <div className="flex items-center justify-center min-h-screen w-full px-4  relative z-1">
        <div className="w-full max-w-6xl h-[73vh] grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden bg-transparent text-white">
          {/* Left Image Side */}
          <div className="h-[100%] rounded-full">
            <img
              src={sliderImages[current]}
              alt="Slider"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Right Login Form */}
          <div className="flex flex-col justify-center space-y-3 items-center px-1 py-1">
            
               <div className="flex items-start px-14 justify-start w-full">
  <img src="/images/logo.png" alt="logo" className="w-[30%]" />
</div>
                <div>
                  <h1 className="text-3xl font-bold">Let the Journey Begin!</h1>
                  <p className="text-gray-400 mt-1">
                    This is basic login page used for levitation assignment
                    purpose.
                  </p>
                </div>
            <form onSubmit={handleSubmit} className="w-full space-y-6 max-w-md">
               <div>
                <label className="block mb-1 text-sm">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email ID"
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This email will be displayed with your inquiry
                </p>
              </div>

              <div>
                <label className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Any further updates will be sent to this email
                </p>
              </div>

              <button
                type="submit"
                className="bg-lime-500 text-black px-6 py-2 rounded-md font-semibold hover:bg-lime-400 transition"
              >
                Login
              </button>

              <p className="text-sm text-gray-400">
                Forgot Password?{" "}
                {/* <span className="text-green-400 underline cursor-pointer">
                  Recover
                </span> */}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
