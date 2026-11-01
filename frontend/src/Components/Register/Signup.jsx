import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUser, register } from "../../Redux/Auth/Action";
import { BsShieldLock } from "react-icons/bs";

const Signup = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const auth = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const res = await dispatch(register(inputData));
    if (res && res.ok && res.jwt) {
      await dispatch(currentUser(res.jwt));
      setOpenSnackbar(true);
      navigate("/");
    } else {
      setErrorMessage(
        res?.message || "Registration failed. Please check your details and try again."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    if (token) dispatch(currentUser(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (auth.reqUser?.name) {
      navigate("/");
    }
  }, [auth.reqUser, navigate]);

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#0c1317] px-4 py-12 text-[#e9edef] select-none">
      {/* Brand Logo & Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#00a884] flex items-center justify-center text-3xl shadow-xl shadow-[#00a884]/20 mb-3">
          💬
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Chattingo</h1>
        <p className="text-sm text-[#8696a0] mt-1">Create your account to start messaging</p>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-md bg-[#111b21] p-8 rounded-2xl border border-[#222d34] shadow-2xl animate-fade-in">
        <h2 className="text-xl font-semibold mb-6 text-white text-center">
          Create an Account
        </h2>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={inputData.name}
              onChange={handleChange}
              required
              className="w-full bg-[#202c33] border border-transparent focus:border-[#00a884] rounded-lg px-4 py-2.5 text-sm text-[#e9edef] placeholder-[#8696a0] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={inputData.email}
              onChange={handleChange}
              required
              className="w-full bg-[#202c33] border border-transparent focus:border-[#00a884] rounded-lg px-4 py-2.5 text-sm text-[#e9edef] placeholder-[#8696a0] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={inputData.password}
              onChange={handleChange}
              required
              className="w-full bg-[#202c33] border border-transparent focus:border-[#00a884] rounded-lg px-4 py-2.5 text-sm text-[#e9edef] placeholder-[#8696a0] outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00a884] hover:bg-[#00a884]/90 text-white font-semibold py-2.5 rounded-lg transition-transform active:scale-[0.98] shadow-lg shadow-[#00a884]/20 mt-2"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#222d34] text-center text-sm text-[#8696a0]">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-[#00a884] hover:underline font-semibold ml-1"
          >
            Sign In
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center text-xs text-[#8696a0] space-x-1.5">
        <BsShieldLock className="text-sm text-[#00a884]" />
        <span>End-to-end encrypted messaging</span>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Account created successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
