import { useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error, message, user } = useAuth();

  console.log("user", user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      navigate("/");
      console.log("Login successfull");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-blue-500">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center">
            <FaBoxOpen className="text-white text-3xl" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Stockpile
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* API Error */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 text-center rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-300 text-green-600 text-center rounded-lg p-3 text-sm">
              {message}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="mt-2 relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition ${errors.email
                  ? "border-red-500"
                  : "border-gray-200 focus:border-blue-500"
                  }`}
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="mt-2 relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition ${errors.password
                  ? "border-red-500"
                  : "border-gray-200 focus:border-blue-500"
                  }`}
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}