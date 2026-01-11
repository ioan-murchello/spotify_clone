import { SignedOut, UserButton } from "@clerk/clerk-react";
import { HomeIcon, LayoutDashboardIcon, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
 const currentLocation = useLocation()
 const path = currentLocation.pathname.includes('chat')
  return (
    <div
      className="flex items-center justify-between p-4 bg-zinc-900/75 
      backdrop-blur-md  flex-wrap 
    "
    >
      <Link to={'/'} className="flex gap-2 items-center">
        <img src="/spotify.png" className="size-8" alt="Spotify logo" />
        <span className="hidden sm:inline">Spotify</span>
      </Link>
      <div className="flex  md:hidden lg:hidden justify-center items-center gap-4 p-4 ">
        <Link to="/">
          <HomeIcon className={`size-6 ${path === false ? "text-green-500":""}`}/> 
        </Link>
        <Link to="/chat">
          <MessageCircle className={`size-6 ${path === true ?"text-green-500":""}`} /> 
        </Link>
      </div>
      <div className="flex items-center justify-center gap-4">
        {isAdmin && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4 " />
            <span className="text-xs">Dashboard</span>
          </Link>
        )}

        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};
export default Topbar;
