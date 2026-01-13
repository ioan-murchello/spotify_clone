import { Outlet, useLocation } from "react-router-dom";

import AudioPlayer from "@/components/AudioPlayer";
import Topbar from "@/components/Topbar";

import PlaybackControls from "@/components/PlaybackControls";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import AlbumsList from "@/components/AlbumsList";

const MobileMainLayout = () => {
  const isKeyboardVisible = useKeyboardVisible();
  const location = useLocation();
  const isChatRoute = location.pathname.includes("chat");

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-black text-white p-2">
      {/* Row 1: Topbar & Header */}
      <header className="shrink-0">
        {" "}
        <AudioPlayer />
        <Topbar />
        {!isChatRoute && <AlbumsList />}
      </header>
      {/* Row 3: Scrollable middle content */}
      <Outlet />
      {/* Row 4 & 5: Footer */}
      {!isKeyboardVisible && (
        <footer className="shrink-0 border-t border-neutral-800 animate-in fade-in slide-in-from-bottom-2">
          <PlaybackControls />
        </footer>
      )}
    </div>
  );
};

export default MobileMainLayout;
