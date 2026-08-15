import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "../../assets/login-bg.jpeg";
import Loading from "../../components/Loading/Loading";

const LogoIcon = () => (
  <svg
    viewBox="0 0 80 80"
    className="h-[65px] w-[65px] transition duration-400 hover:scale-110 hover:rotate-[5deg]"
    fill="none"
  >
    <defs>
      <linearGradient id="tripGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
    </defs>

    <circle
      cx="40"
      cy="40"
      r="33"
      stroke="url(#tripGradient)"
      strokeWidth="4"
    />

    <path
      d="
      M40 18
      C29 18 21 26 21 37
      C21 51 40 64 40 64
      C40 64 59 51 59 37
      C59 26 51 18 40 18Z
      "
      fill="url(#tripGradient)"
    />

    <circle cx="40" cy="37" r="9" fill="white" />
    <circle cx="40" cy="37" r="5" fill="#2563eb" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setLoading(true);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  return (
    <>
      {loading && (
        <Loading
          text="Exploring TripMesh"
          subText="Connecting you with new adventures..."
        />
      )}

      <div className="relative flex min-h-screen w-full overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(0,40,90,0.45),
                rgba(0,40,90,0.45)
              ),
              url(${loginBg})
            `,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 to-slate-950/35" />

          {/* Brand */}
          <div className="absolute left-[60px] top-[45px] z-10 text-4xl font-black tracking-[-1px] text-white max-[900px]:left-1/2 max-[900px]:-translate-x-1/2 max-[500px]:top-[25px] max-[500px]:text-[28px]">
            ✈ TripMesh
          </div>

          {/* Hero Text */}
          <div className="absolute left-[70px] top-1/2 z-10 max-w-[520px] -translate-y-1/2 text-white max-[900px]:hidden">
            <h1 className="text-[65px] font-black leading-[1.05] tracking-[-3px]">
              Explore more.
              <br />
              Travel better.
            </h1>

            <p className="mt-[25px] text-[19px] leading-[1.7] text-slate-200">
              Connect with trusted guide services
              <br />
              and make your journey unforgettable.
            </p>
          </div>
        </div>

        {/* Login Section */}
        <div className="absolute right-[8%] top-1/2 z-20 w-[430px] -translate-y-1/2 max-[900px]:right-1/2 max-[900px]:w-[90%] max-[900px]:translate-x-1/2 max-[900px]:-translate-y-1/2 max-[500px]:w-[92%]">
          <div className="relative w-full overflow-hidden rounded-[30px] border border-white/60 bg-white/93 p-[45px] shadow-[0_40px_100px_rgba(0,0,0,0.35)] backdrop-blur-[25px] max-[500px]:rounded-[22px] max-[500px]:px-[22px] max-[500px]:py-[30px]">
            {/* Logo */}
            <div className="mb-5 flex justify-center">
              <LogoIcon />
            </div>

            {/* Heading */}
            <h2 className="mb-[10px] text-center text-[40px] font-black text-slate-900 max-[500px]:text-[32px]">
              Welcome Back!
            </h2>

            <p className="my-[10px] mb-[30px] text-center text-slate-500 max-[500px]:text-sm">
              Login to continue your adventure
            </p>

            {/* Form */}
            <form className="w-full" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                required
                className="mb-4 h-[55px] w-full rounded-[15px] border border-slate-300 bg-slate-50 px-[18px] text-base transition duration-300 outline-none focus:border-blue-700 focus:bg-white focus:ring-[5px] focus:ring-blue-600/15"
              />

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                required
                className="mb-4 h-[55px] w-full rounded-[15px] border border-slate-300 bg-slate-50 px-[18px] text-base transition duration-300 outline-none focus:border-blue-700 focus:bg-white focus:ring-[5px] focus:ring-blue-600/15"
              />

              {/* Forgot Password */}
              <div className="mb-[25px] mt-[-5px] block text-right text-sm font-semibold">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 transition duration-300 hover:text-blue-800 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="flex h-[55px] w-full cursor-pointer items-center justify-center rounded-[18px] border-none bg-gradient-to-br from-blue-600 to-sky-500 text-lg font-extrabold text-white shadow-[0_15px_35px_rgba(37,99,235,0.35)] transition duration-300 hover:-translate-y-[5px] hover:shadow-[0_25px_50px_rgba(5,34,96,0.45)]"
              >
                Login
              </button>
            </form>

            {/* Footer */}
            <p className="mt-[35px] text-center leading-[1.6] text-slate-500">
              Don't have an account?
              <Link
                to="/signup"
                className="ml-[5px] font-bold text-blue-600"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;