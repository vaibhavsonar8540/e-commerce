"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { createUser, loggedUser } from "@/redux/action/authAction";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Authentication = ({ onClose }) => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createUser(regValue));

      toast.success("Account Created Successfully");

      onClose(); // Modal Close
      router.push("/"); // Redirect
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loggedUser(loginValue));

      toast.success("Login Successfully");

      onClose(); // Modal Close
      router.push("/"); // Redirect
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <Box
  sx={{
    position: "relative",
    width: {
      xs: "90%",
      sm: "450px",
    },
    height:"450px",
    bgcolor: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,.3)",
    display: "flex",
    flexDirection: "column",
  }}
>
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
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

            "& .MuiTab-root": {
              width: "45%",
              maxWidth: "45%",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              minHeight: "60px",
            },

            "& .MuiTabs-indicator": {
              height: "3px",
              backgroundColor: "#111827",
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
            p: 3,
          }}
        >
          <div className="flex flex-col gap-5 py-2">
            <h2 className="text-2xl font-bold text-primary text-center">
              Welcome Back
            </h2>

            <p className="text-sm text-gray-500 text-center">
              Login to continue shopping
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                value={loginValue.email}
                onChange={(e) =>
                  setLoginValue({
                    ...loginValue,
                    email: e.target.value,
                  })
                }
                placeholder="Email Address"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 mb-3 outline-none focus:border-primary"
              />

              <input
                type="password"
                value={loginValue.password}
                onChange={(e) =>
                  setLoginValue({
                    ...loginValue,
                    password: e.target.value,
                  })
                }
                placeholder="Password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 mb-5 outline-none focus:border-primary"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 text-white font-semibold transition hover:opacity-90"
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
            p: 3,
          }}
        >
          <div className="flex flex-col gap-5 py-2">
            <h2 className="text-2xl font-bold text-primary text-center">
              Create Account
            </h2>

            <p className="text-sm text-gray-500 text-center">
              Join us and start shopping today
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <input
  type="text"
  placeholder="Full Name"
  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
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
                placeholder="Email"
  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
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
                placeholder="Phone Number"
  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                value={regValue.phone}
                onChange={(e) =>
                  setRegValue({
                    ...regValue,
                    phone: e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="Password"
  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                value={regValue.password}
                onChange={(e) =>
                  setRegValue({
                    ...regValue,
                    password: e.target.value,
                  })
                }
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 text-white font-semibold transition hover:opacity-90"
              >
                Create Account
              </button>
            </form>
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Authentication;
