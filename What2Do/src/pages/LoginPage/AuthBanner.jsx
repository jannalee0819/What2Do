import React from "react";
import { signOut, useAuthState } from "../../utilities/firebase_helper";
import { useNavigate, Link } from "react-router-dom";

const AuthBanner = () => {
  const [user] = useAuthState();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative z-10 h-full flex items-center justify-between px-8 py-6">
        <div className="flex-1 flex items-center space-x-4">
          <h1 className="text-2xl font-light text-gray-800 tracking-wide">
            My Trips
          </h1>

          <Link
            to="/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
                       self-start transition-all duration-200"
          >
            Add New Trip
          </Link>
        </div>

        {user && (
          <div className="backdrop-blur-sm bg-white/30 rounded-xl p-4 shadow-lg flex items-center space-x-4">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-10 h-10 rounded-full border-2 border-white/50"
              />
            )}
            <div className="flex flex-col">
              <span className="text-gray-800 font-medium">
                {user.displayName}
              </span>
              <span className="text-sm text-gray-600">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="ml-4 bg-red-500 text-white rounded-lg py-2 px-4 
                       hover:bg-red-600 transform hover:scale-[1.02] 
                       transition-all duration-200 shadow-md
                       flex items-center justify-center space-x-2"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthBanner;
