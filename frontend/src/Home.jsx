import React, { useContext } from "react";
import { AuthContext } from "./provider/authprovider";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="home-container bg-cover bg-center min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold">Welcome to MusicZone</h1>
        <p className="text-lg md:text-xl mt-4 opacity-80">
          Your favorite tunes, anytime, anywhere.
        </p>
        {/* <button className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition">
          Explore Now
        </button> */}

        {user.user.username}
      </div>
    </div>
  );
};

export default Home;
