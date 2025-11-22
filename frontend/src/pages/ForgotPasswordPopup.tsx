import { useState } from "react";
import ButtonSm from "../components/common/Buttons";
import Input from "../components/common/Input";
import Spinner from "../components/common/Spinner";
import { toast } from "react-toastify";

export const ForgotPasswordPopup = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);

  // SEND OTP
  const handleSendOtp = () => {
    if (!email.trim()) return toast.error("Email is required");

    setLoading(true);
    setTimeout(() => {
      toast.success("OTP sent to email ");
      setStep("otp");
      setLoading(false);
    }, 800);
  };

  // VERIFY OTP
  const handleVerifyOtp = () => {
    if (!otp.trim()) return toast.error("Enter OTP");

    setLoading(true);
    setTimeout(() => {
      toast.success("OTP Verified ");
      setStep("reset");
      setLoading(false);
    }, 800);
  };

  // RESET PASSWORD
  const handleReset = () => {
    if (!password.trim() || !confirm.trim())
      return toast.error("All fields required");

    if (password !== confirm)
      return toast.error("Passwords do not match");

    setLoading(true);
    setTimeout(() => {
      toast.success("Password reset successful ");
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-lg relative">

        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        {/* EMAIL STEP */}
        {step === "email" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Forgot Password
            </h2>

            <Input
              type="str"
              title="Email"
              inputValue={email}
              onChange={setEmail}
              placeholder="Enter your registered email"
            />

            <ButtonSm
              onClick={handleSendOtp}
              disabled={loading}
               className="text-white flex justify-center"
              state="default"
            >
              {loading ? <Spinner size="sm" /> : "Send OTP"}
            </ButtonSm>
          </div>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-700">Enter OTP</h2>

            <Input
              type="str"
              title="OTP"
              inputValue={otp}
              onChange={setOtp}
              placeholder="123456"
            />

            <ButtonSm
              onClick={handleVerifyOtp}
              disabled={loading}
              state="default"
               className="text-white flex justify-center"
            >
              {loading ? <Spinner size="sm" /> : "Verify OTP"}
            </ButtonSm>
          </div>
        )}

        {/* RESET PASSWORD STEP */}
        {step === "reset" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Reset Password
            </h2>

            <Input
              type="str"
              title="New Password"
              inputValue={password}
              onChange={setPassword}
              placeholder="Enter new password"
            />

            <Input
              type="str"
              title="Confirm Password"
              inputValue={confirm}
              onChange={setConfirm}
              placeholder="Re-enter password"
            />

            <ButtonSm
              onClick={handleReset}
              disabled={loading}
              state="default"
              className="text-white flex justify-center"
            >
              {loading ? <Spinner size="sm" /> : "Reset Password"}
            </ButtonSm>
          </div>
        )}
      </div>
    </div>
  );
};
