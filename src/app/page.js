"use client";

import { useRouter } from "next/navigation";
import { FaBook, FaUsers, FaRocket } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function StudentPortal() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSignUp = () => {
    router.push("/auth?mode=signup");
  };

  const handleSignIn = () => {
    router.push("/auth?mode=login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-24 sm:pt-32 pb-16 px-4 min-h-[80vh]">
        <h1
          className={`text-4xl sm:text-6xl font-bold text-gray-800 mb-6 tracking-tight transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Welcome to Student Portal
        </h1>
        <p
          className={`text-lg sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Ignite your learning journey with tools, community, and inspiration.
        </p>
        <div
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <button
            onClick={handleSignUp}
            className="bg-green-600 text-white py-3 px-10 rounded-lg text-lg sm:text-xl font-semibold hover:bg-green-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
          >
            Join
          </button>
          <button
            onClick={handleSignIn}
            className="bg-blue-600 text-white py-3 px-10 rounded-lg text-lg sm:text-xl font-semibold hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
          >
            Log In
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div
            className={`bg-white rounded-xl p-8 text-center shadow-md transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            } hover:shadow-xl hover:scale-105`}
          >
            <FaBook className="text-blue-600 text-4xl mx-auto mb-4 animate-bounce-slow" />
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Rich Resources</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Access courses and materials to fuel your academic passion.
            </p>
          </div>
          <div
            className={`bg-white rounded-xl p-8 text-center shadow-md transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            } hover:shadow-xl hover:scale-105`}
          >
            <FaUsers className="text-green-600 text-4xl mx-auto mb-4 animate-bounce-slow" />
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Connect & Grow</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Collaborate with peers to share ideas and insights.
            </p>
          </div>
          <div
            className={`bg-white rounded-xl p-8 text-center shadow-md transition-all duration-700 delay-600 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            } hover:shadow-xl hover:scale-105`}
          >
            <FaRocket className="text-blue-600 text-4xl mx-auto mb-4 animate-bounce-slow" />
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Soar Higher</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Track your progress and launch toward your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}