import { axiosInstance } from "../lib/axios.js";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const { user, isLoaded } = useUser();
  const syncAttempted = useRef(false); //? to prevent creating user twice
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = async () => {
      try {
        if (!isLoaded || !user) return;
        if (syncAttempted.current) return;

        syncAttempted.current = true;

        const loggedUser = await axiosInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });

        if (loggedUser) navigate("/");
        
      } catch (error) {
        console.log("Error in auth callback", error);
      }
    };

    syncUser();
  }, [isLoaded, navigate, user]);

  return (
    <section className="w-full h-screen bg-black flex items-center justify-center">
      <div className="w-4/5 max-w-md bg-zinc-700 border-zinc-500 rounded-xl p-6">
        <div className="flex items-center justify-center flex-col gap-4">
          <Loader className="size-6 text-emerald-500 animate-spin" />
          <h3 className="text-xl text-zinc-300">Logging you in</h3>
          <p className="text-md text-zinc-400">Redirecting...</p>
        </div>
      </div>
    </section>
  );
};
export default AuthCallbackPage;
