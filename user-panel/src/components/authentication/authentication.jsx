"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { createUser, loggedUser } from "@/redux/action/authAction";
import { useRouter } from "next/navigation";

const Authentication = ({ onClose }) => {
  const [value, setValue] = useState("1");
  const [loginFlash, setLoginFlash] = useState(null);
  const [regFlash, setRegFlash] = useState(null);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setLoginFlash(null);
    setRegFlash(null);
  };

  const dispatch = useDispatch();
  const router = useRouter();
  const initialState = {
    fullname: "",
    email: "",
    password: "",
    phone: "",
  };

  const [regValue, setRegValue] = useState(initialState);
  const [loginValue, setLoginValue] = useState(initialState);

  const [regLoading, setRegLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegFlash(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regValue.email.trim())) {
      setRegFlash({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(regValue.phone.trim())) {
      setRegFlash({ type: "error", message: "Please enter a valid 10-digit Indian phone number." });
      return;
    }

    if (regValue.password.length < 6) {
      setRegFlash({ type: "error", message: "Password must be at least 6 characters long." });
      return;
    }

    setRegLoading(true);
    try {
      await dispatch(createUser({
        fullname: regValue.fullname.trim(),
        email: regValue.email.trim(),
        phone: regValue.phone.trim(),
        password: regValue.password,
      }));
      setRegFlash({ type: "success", message: "Account Created Successfully!" });
      setTimeout(() => {
        onClose(); // Modal Close
        router.push("/"); // Redirect
      }, 1500);
    } catch (error) {
      setRegFlash({
        type: "error",
        message: error.response?.data?.message || "Registration Failed",
      });
    } finally {
      setRegLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginFlash(null);

    try {
      await dispatch(loggedUser(loginValue));
      setLoginFlash({ type: "success", message: "Login Successful!" });
      setTimeout(() => {
        onClose(); // Modal Close
        router.push("/"); // Redirect
      }, 2500);
    } catch (error) {
      setLoginFlash({
        type: "error",
        message: error.response?.data?.message || "Login Failed",
      });
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "450px",
        height: { xs: "auto", sm: "480px" },
        maxHeight: "90vh",
        bgcolor: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,.3)",
        display: "flex",
        flexDirection: "column",
        mx: "auto",
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 20,
          color: "#6b7280",
          "&:hover": { color: "#111827" },
        }}
      >
        <CloseIcon />
      </IconButton>

      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          centered
          sx={{
            borderBottom: "1px solid #E5E7EB",
            pr: { xs: "48px", sm: "56px" },
            "& .MuiTab-root": {
              width: "50%",
              maxWidth: "50%",
              textTransform: "none",
              fontSize: { xs: "15px", sm: "16px" },
              fontWeight: 600,
              minHeight: "56px",
            },

            "& .MuiTabs-indicator": {
              height: "3px",
              backgroundColor: "#45220e",
            },

            "& .Mui-selected": {
              color: "#45220e !important",
            },
          }}
        >
          <Tab label="Login" value="1" />
          <Tab label="Register" value="2" />
        </TabList>

        <TabPanel
          value="1"
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2.5, sm: 3 },
          }}
        >
          <div className="flex flex-col gap-4 py-1">
            <h2 className="text-xl sm:text-2xl font-bold text-primary text-center">
              Welcome Back
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 text-center -mt-2">
              Login to continue shopping
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-3.5 mt-1">
              {loginFlash && (
                <div
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                    loginFlash.type === "success"
                      ? "bg-green-100 border border-green-300 text-green-900"
                      : "bg-red-100 border border-red-300 text-red-900"
                  }`}
                >
                  {loginFlash.message}
                </div>
              )}

              <input
                type="email"
                required
                value={loginValue.email}
                onChange={(e) =>
                  setLoginValue({
                    ...loginValue,
                    email: e.target.value,
                  })
                }
                placeholder="Email Address"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />

              <div className="relative w-full">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={loginValue.password}
                  onChange={(e) =>
                    setLoginValue({
                      ...loginValue,
                      password: e.target.value,
                    })
                  }
                  placeholder="Password"
                  className="w-full rounded-xl border border-gray-300 pl-4 pr-11 py-2.5 sm:py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1 transition-colors"
                  tabIndex={-1}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-3 text-white font-semibold text-sm transition hover:opacity-90 active:scale-[0.99] cursor-pointer mt-1"
              >
                Login
              </button>
            </form>
          </div>
        </TabPanel>

        <TabPanel
          value="2"
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2.5, sm: 3 },
          }}
        >
          <div className="flex flex-col gap-3 py-1">
            <h2 className="text-xl sm:text-2xl font-bold text-primary text-center">
              Create Account
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 text-center -mt-2">
              Join us and start shopping today
            </p>

            <form className="flex flex-col gap-3 mt-1" onSubmit={handleRegister}>
              {regFlash && (
                <div
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                    regFlash.type === "success"
                      ? "bg-green-100 border border-green-300 text-green-900"
                      : "bg-red-100 border border-red-300 text-red-900"
                  }`}
                >
                  {regFlash.message}
                </div>
              )}

              <input
                type="text"
                required
                placeholder="Full Name"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={regValue.fullname}
                onChange={(e) =>
                  setRegValue({
                    ...regValue,
                    fullname: e.target.value,
                  })
                }
              />

              <input
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={regValue.email}
                onChange={(e) =>
                  setRegValue({
                    ...regValue,
                    email: e.target.value,
                  })
                }
              />

              <input
                type="tel"
                required
                placeholder="Phone Number"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={regValue.phone}
                onChange={(e) =>
                  setRegValue({
                    ...regValue,
                    phone: e.target.value,
                  })
                }
              />

              <div className="relative w-full">
                <input
                  type={showRegPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full rounded-xl border border-gray-300 pl-4 pr-11 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={regValue.password}
                  onChange={(e) =>
                    setRegValue({
                      ...regValue,
                      password: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1 transition-colors"
                  tabIndex={-1}
                >
                  {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full rounded-xl bg-primary py-3 text-white font-semibold text-sm transition hover:opacity-90 active:scale-[0.99] cursor-pointer mt-1 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {regLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Authentication;
