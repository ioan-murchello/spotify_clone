import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInAuthButton from "../SignInAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

const TopBar = () => {
  const { isAdmin } = useAuthStore();
  return (
    <header className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900 backdrop-blur-md z-100  ">
      <div className="flex gap-2 items-center">
        <img src="/spotify.png" alt="Logo" className="size-8" />
        Spotify Clone
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            className={cn(buttonVariants({ variant: "outline" }))}
            to="/admin"
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInAuthButton />
        </SignedOut>

        <UserButton />
      </div>
    </header>
  );
};
export default TopBar;
