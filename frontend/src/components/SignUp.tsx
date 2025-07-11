import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils"; 
import Navbar from "./Navbar"

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`${BACKEND_URL}`);

    try {
     const res = await axios.post(
  `${BACKEND_URL}/api/auth/register`,
  {
    name,
    email,
    password,
    phone,
    address
  },
  {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }
);
      console.log("Response: ", res);
      console.log("Login successful: ", res.data);
      if (res?.status === 201) {
        toast.success("Registration successful");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error("Already registered, please login");
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className ="fixed inset-0 h-screen w-screen bg-black overflow-hidden" >
      
      <Navbar
        navButton={
              
          <button
            onClick={() => navigate("/login")}
            className="bg-transparent text-[#CCF575]  border border-[#CCF575] rounded-lg px-6 relative transform transition-transform duration-300 hover:translate-x-4 hover:bg-[#CCF575] hover:text-black"
          >

           Login
          </button>
          
        }
      />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="flex w-[90%] max-w-6xl shadow-lg rounded-xl overflow-hidden">
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 bg-transparent px-10 py-14 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Sign up to begin journey</h1>
            <p className="text-gray-400 mt-1">
              This is basic signup page used for levitation assignment purpose.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm">Enter your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This name will be displayed with your inquiry
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email ID"
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                placeholder="Enter the Password"
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Any further updates will be forwarded on this Email ID
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-lime-500 text-black px-6 py-2 rounded-md font-semibold hover:bg-lime-400"
            >
              Register
            </button>

            <p className="text-sm text-gray-400 mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400 underline">
                Login
              </Link>
            </p>
          </form>
        </div>

        {/* Right Section - Image */}
        <div className="hidden pt-19 h-[80vh] md:block w-1/2  ">
          <img
            src="/images/billboard.jpg"
            alt="Signup banner"
            className="h-full w-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Signup;
