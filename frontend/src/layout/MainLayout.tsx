import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import LeftSidebar from "@/components/LeftSidebar";
import FriendsActivity from "@/components/FriendsActivity";
import AudioPlayer from "@/components/AudioPlayer";
import PlaybackControls from "@/components/PlaybackControls";
import { useEffect, useState } from "react";
import MobileMainLayout from "./MobileMainLayout";
import Topbar from "@/components/Topbar";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      {isMobile ? (
        <MobileMainLayout />
      ) : (
        <>
          {/* Main content */}
          <div className="flex-1 overflow-hidden px-2">
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full overflow-hidden"
            >
              <AudioPlayer />

              <ResizablePanel defaultSize={20} minSize={20} maxSize={30}>
                <LeftSidebar />
              </ResizablePanel>

              <ResizableHandle className="w-2 bg-black rounded-lg" />

              <ResizablePanel defaultSize={60}>
                <div className="h-full flex flex-col overflow-hidden">
                  <Topbar />

                  {/* 2. Give the Outlet container flex-1 and min-h-0 */}
                  <div className="flex-1 min-h-0 relative">
                    <Outlet />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle className="w-2 bg-black rounded-lg" />

              <ResizablePanel defaultSize={20} minSize={0} maxSize={25}>
                <FriendsActivity />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          {/* Playback controls — INSIDE height lock */}
          <PlaybackControls />
        </>
      )}
    </div>
  );
};

export default MainLayout;
 
