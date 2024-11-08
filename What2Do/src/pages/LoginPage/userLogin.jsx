import React, { useEffect } from "react";
import {
  signInWithGoogle,
  signOut,
  useAuthState,
} from "../../utilities/firebase_helper";
import { useNavigate } from "react-router-dom";
import { WorldMapBackground } from "./loginBackground";

const LoginPage = () => {
  const [user] = useAuthState();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <WorldMapBackground />

      <div className="relative min-h-screen flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full backdrop-blur-sm bg-white/70 rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col text-center gap-2 mb-12">
            <h2 className="text-4xl font-bold text-gray-700 tracking-wide">
              Welcome to <span className="text-blue-500">W2D!</span>
            </h2>
            <h3 className="text-xl text-gray-500">
              Plan your next adventure. 
            </h3>
          </div>

          <div className="space-y-6">
            {user ? (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-xl text-gray-800">
                    Welcome, {user.displayName}
                  </div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>

                <button
                  onClick={signOut}
                  className="w-full bg-red-500 text-white rounded-lg py-3 px-4 
                             hover:bg-red-600 transform hover:scale-[1.02] 
                             transition-all duration-200 shadow-md
                             flex items-center justify-center space-x-2"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="w-full bg-white text-gray-700 rounded-lg py-3 px-4 
                           hover:bg-gray-50 transform hover:scale-[1.02] 
                           transition-all duration-200 shadow-md
                           flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
