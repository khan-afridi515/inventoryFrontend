import { useRef, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { verifyemail } from "../../services/authServices";



export default function VerifyEmail() {
  const navigate = useNavigate();

  const { verifyEmail, error, message, loading, resendotp } = useAuth();

  const email = localStorage.getItem("pendingEmail");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      alert("Please enter the 6-digit verification code.");
      return;
    }

    const response = await verifyEmail({
      email: email,
      otp : code
    });

    if (response) {
      localStorage.removeItem("pendingEmail");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };


  const resendCode = async (e) => {
      e.preventDefault();
     
        const response = await resendotp({email : email});

        console.log(response);
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-blue-500 p-6">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center">
            <FaBoxOpen className="text-white text-2xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-3">
            Stockpile
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Verify your email
          </p>
        </div>

        <h2 className="text-center text-xl font-semibold text-gray-900">
          Enter Verification Code
        </h2>

        <p className="text-center text-sm text-gray-500 mt-2 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        {/* API Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-600 text-center rounded-lg p-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="bg-green-100 border border-green-300 text-green-600 text-center rounded-lg p-3 text-sm mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:border-blue-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition"
          >
            Verify Email
          </button>

          <button
            onClick={resendCode}
            type="button"
            className="w-full mt-3 cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
          >
            {loading ? "Sending..." : "Resend Code"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full mt-2 text-gray-600 hover:text-gray-800"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}