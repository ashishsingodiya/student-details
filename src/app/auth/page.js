"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function AuthPage() {
    const searchParams = useSearchParams();
    const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
    const [mode, setMode] = useState(initialMode);

    useEffect(() => {
        const newMode = searchParams.get("mode");
        if (newMode === "signup" || newMode === "login") {
            setMode(newMode);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
                {mode === "login" && (
                    <LoginForm onForgotPassword={() => setMode("reset")} />
                )}
                {mode === "signup" && (
                    <SignUpForm onOtpVerified={() => setMode("login")} />
                )}
                {mode === "reset" && (
                    <ResetPasswordForm onResetSuccess={() => setMode("login")} />
                )}
                <div className="mt-4 text-center">
                    {mode === "login" && (
                        <p
                            className="text-gray-500 cursor-pointer hover:text-black hover:underline text-sm"
                            onClick={() => setMode("signup")}
                        >
                            Don't have an account? Signup
                        </p>
                    )}
                    {mode === "signup" && (
                        <p
                            className="text-gray-500 cursor-pointer hover:text-black hover:underline text-sm"
                            onClick={() => setMode("login")}
                        >
                            Already have an account? Sign in
                        </p>
                    )}
                    {mode === "reset" && (
                        <p
                            className="text-gray-500 cursor-pointer hover:text-black hover:underline text-sm"
                            onClick={() => setMode("login")}
                        >
                            Back to login
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}


function LoginForm({ onForgotPassword }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg(null);
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");
            localStorage.setItem("token", data.token);
            setMsg("Login successful, redirecting...");
            setTimeout(() => router.push("/dashboard"), 1000);
        } catch (err) {
            setMsg(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 mb-4">Sign in to Account</h2>
            <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <MdEmail size={20} />
                </span>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 pl-10 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <MdLock size={20} />
                </span>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
            </div>
            {msg && <p className="text-sm text-red-500">{msg}</p>}
            <div className="text-left">
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-green-600 hover:underline"
                >
                    Forgot Password?
                </button>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 rounded text-white transition-colors duration-300 text-sm sm:text-base ${isLoading
                    ? "bg-green-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500"
                    }`}
            >
                {isLoading ? (
                    <div className="flex justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    "Sign In"
                )}
            </button>
        </form>
    );
}

function SignUpForm({ onOtpVerified }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState(null);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const router = useRouter();
    const [name, setName] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [branch, setBranch] = useState("");
    const [customBranch, setCustomBranch] = useState("");

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const validatePassword = (pass) => {
        const isLongEnough = pass.length >= 8;
        const hasLetters = /[a-zA-Z]/.test(pass);
        const hasNumbers = /\d/.test(pass);
        return isLongEnough && hasLetters && hasNumbers;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setMsg(null);
        if (password !== confirmPassword) {
            setMsg("Passwords do not match.");
            return;
        }
        if (!validatePassword(password)) {
            setMsg("Password must be at least 8 characters and alphanumeric.");
            return;
        }
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Signup failed");
            setMsg(data.message);
            setShowOtp(true);
        } catch (err) {
            setMsg(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setMsg(null);
        if (isVerifyingOtp) return;
        setIsVerifyingOtp(true);
        try {
            const res = await fetch("/api/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "OTP verification failed");
            setMsg("OTP verified successfully!");
            setTimeout(() => {
                setShowDetailsForm(true);
            }, 1000);
        } catch (err) {
            setMsg(err.message);
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setMsg(null);
            const res = await fetch("/api/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to resend OTP");
            setMsg("OTP resent successfully!");
            setResendCooldown(30);
        } catch (err) {
            console.error("Error resending OTP:", err);
            setMsg(err.message);
        }
    };

    const handleSubmitDetails = async (e) => {
        e.preventDefault();
        const finalBranch = branch === "Other" ? customBranch : branch;
        try {
            const res = await fetch("/api/user-details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    name,
                    rollNo,
                    dob,
                    gender,
                    phone,
                    address,
                    branch: finalBranch,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit details");
            setMsg("Details submitted! Redirecting...");
            setTimeout(() => onOtpVerified(), 1500);
        } catch (err) {
            setMsg(err.message);
        }
    };

    const branchOptions = [
        "Computer Science and Engineering (CSE)",
        "Information Technology (IT)",
        "Electronics and Communication Engineering (ECE)",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Biotechnology",
        "Aerospace Engineering",
        "Industrial Engineering",
        "Electronics and Instrumentation Engineering",
        "Mining Engineering",
        "Agricultural Engineering",
        "Textile Technology",
        "Ceramic Engineering",
        "Automobile Engineering",
        "Production Engineering",
        "Dairy Technology",
        "Textile Engineering",
        "Applied Electronics & Instrumentation",
        "Other",
    ];

    return (
        <>
            {!showOtp && !showDetailsForm && (
                <form onSubmit={handleSignup} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 mb-4">Create Account</h2>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MdEmail size={20} />
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 pl-10 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MdLock size={20} />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MdLock size={20} />
                        </span>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                    </div>
                    {msg && <p className="text-sm text-red-500">{msg}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded text-white text-sm sm:text-base ${isLoading ? "bg-green-500" : "bg-green-600 hover:bg-green-500"}`}
                    >
                        {isLoading ? (
                            <div className="flex justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>
            )}
            {showOtp && !showDetailsForm && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">Verify OTP</h2>
                    <p className="text-sm text-gray-700">
                        Enter the OTP sent to <span className="font-semibold">{email}</span>
                    </p>
                    <input
                        type="text"
                        placeholder="OTP"
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    {msg && <p className="text-sm text-red-500">{msg}</p>}
                    <button
                        type="submit"
                        disabled={isVerifyingOtp}
                        className={`w-full py-2 rounded text-white text-sm sm:text-base ${isVerifyingOtp ? "bg-green-500" : "bg-green-600 hover:bg-green-500"}`}
                    >
                        {isVerifyingOtp ? (
                            <div className="flex justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            "Verify OTP"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0}
                        className={`w-full py-2 rounded text-sm sm:text-base ${resendCooldown > 0 ? "bg-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                        {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                    </button>
                </form>
            )}
            {showDetailsForm && (
                <form onSubmit={handleSubmitDetails} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 mb-4">Complete Your Profile</h2>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                    />
                    <input
                        type="text"
                        placeholder="Roll Number"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                    />
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                    />
                    <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                    >
                        <option value="">Select Branch</option>
                        {branchOptions.map((b, i) => (
                            <option key={i} value={b}>{b}</option>
                        ))}
                    </select>
                    {branch === "Other" && (
                        <input
                            type="text"
                            placeholder="Enter your Branch"
                            value={customBranch}
                            onChange={(e) => setCustomBranch(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                        />
                    )}
                    <div className="space-y-1">
                        <label
                            htmlFor="dob"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Date of Birth
                        </label>
                        <input
                            id="dob"
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                        />
                    </div>
                    {msg && <p className="text-sm text-red-500">{msg}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 rounded text-white bg-green-600 hover:bg-green-500 text-sm sm:text-base"
                    >
                        Submit
                    </button>
                </form>
            )}
        </>
    );
}

function ResetPasswordForm({ onResetSuccess }) {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [msg, setMsg] = useState(null);
    const [step, setStep] = useState(1);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const validatePassword = (pass) => {
        const isLongEnough = pass.length >= 8;
        const hasLetters = /[a-zA-Z]/.test(pass);
        const hasNumbers = /\d/.test(pass);
        return isLongEnough && hasLetters && hasNumbers;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMsg(null);
        if (isSendingOtp) return;
        setIsSendingOtp(true);
        try {
            const res = await fetch("/api/request-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send OTP");
            setMsg(data.message);
            setStep(2);
        } catch (err) {
            setMsg(err.message);
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMsg(null);
        if (newPassword !== confirmNewPassword) {
            setMsg("Passwords do not match.");
            return;
        }
        if (!validatePassword(newPassword)) {
            setMsg("Password must be at least 8 characters and alphanumeric.");
            return;
        }
        if (isResetting) return;
        setIsResetting(true);
        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Password reset failed");
            setMsg("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                onResetSuccess();
            }, 2000);
        } catch (err) {
            setMsg(err.message);
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <>
            {step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 mb-4">Reset Password</h2>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MdEmail size={20} />
                        </span>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-2 pl-10 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {msg && <p className="text-sm text-red-500">{msg}</p>}
                    <button
                        type="submit"
                        disabled={isSendingOtp}
                        className={`w-full py-2 rounded text-white text-sm sm:text-base transition-colors duration-300 ${isSendingOtp ? "bg-green-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"}`}
                    >
                        {isSendingOtp ? (
                            <div className="flex justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            "Send OTP"
                        )}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">Reset Password</h2>
                    <p className="text-sm text-gray-700">
                        Enter the OTP sent to <span className="font-semibold">{email}</span>
                    </p>
                    <input
                        type="text"
                        placeholder="OTP"
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MdLock size={20} />
                        </span>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showNewPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MdLock size={20} />
                        </span>
                        <input
                            type={showConfirmNewPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded text-gray-900 text-sm sm:text-base"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showConfirmNewPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                    </div>
                    {msg && <p className="text-sm text-red-500">{msg}</p>}
                    <button
                        type="submit"
                        disabled={isResetting}
                        className={`w-full py-2 rounded text-white text-sm sm:text-base transition-colors duration-300 ${isResetting ? "bg-green-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"}`}
                    >
                        {isResetting ? (
                            <div className="flex justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
            )}
        </>
    );
}