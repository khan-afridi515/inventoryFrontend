import { useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function Signup() {
  const navigate = useNavigate();

  const { signUp, loading, error, message } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }


    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e) => {
 
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response) {
        localStorage.setItem("pendingEmail", formData.email);
        setTimeout(() => {
        navigate("/verifyemail");
      }, 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5 border border-blue-500">
        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center">
            <FaBoxOpen className="text-white text-2xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-3">
            Stockpile
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

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

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div className="mt-1.5 relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full pl-12 pr-4 py-2.5  border rounded-xl outline-none transition ${errors.name
                  ? "border-red-500"
                  : "border-gray-200 focus:border-blue-500"
                  }`}
              />
            </div>

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="mt-1.5 relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full pl-12 pr-4 py-2.5 border rounded-xl outline-none transition ${errors.email
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

            <div className="mt-1.5 relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full pl-12 pr-4 py-2.5 border rounded-xl outline-none transition ${errors.password
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

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="mt-1.5 relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full pl-12 pr-4 py-2.5 border rounded-xl outline-none transition ${errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-200 focus:border-blue-500"
                  }`}
              />
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}