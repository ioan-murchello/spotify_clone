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

// const MainLayout = () => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   return (
//     <div className="mx-2 bg-black text-white h-screen flex-col overflow-hidden">
//       {isMobile ? (
//         <MobileMainLayout />
//       ) : (
//         <ResizablePanelGroup
//           direction="horizontal"
//           className=" flex h-full overflow-hidden p-2"
//         >
//           <AudioPlayer />
//           {/* left sidebar */}
//           <ResizablePanel
//             defaultSize={20}
//             minSize={isMobile ? 0 : 20}
//             maxSize={30}
//           >
//             <LeftSidebar />
//           </ResizablePanel>

//           <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

//           {/* Main content */}
//           <ResizablePanel defaultSize={60} collapsedSize={0}>
//             <Topbar/>
//             <Outlet />
//           </ResizablePanel>

//           {!isMobile && (
//             <>
//               <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

//               {/* right sidebar */}
//               <ResizablePanel
//                 defaultSize={20}
//                 minSize={0}
//                 maxSize={25}
//                 collapsedSize={0}
//               >
//                 <FriendsActivity />
//               </ResizablePanel>
//             </>
//           )}
//         </ResizablePanelGroup>
//       )}
//       {!isMobile && <PlaybackControls />}

//     </div>
//   );
// };

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

              <ResizablePanel defaultSize={60} minSize={0}>
                <div className="h-full flex flex-col overflow-hidden">
                  <Topbar />

                  {/* 2. Give the Outlet container flex-1 and min-h-0 */}
                  <div className="flex-1 min-h-0 relative">
                    <Outlet />
                  </div>
                </div>

                {/* <Topbar />
                <div className="h-full overflow-hidden">
                  <Outlet />
                </div> */}
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



// In MainLayout.tsx
{/* <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
  {isMobile ? (
    <MobileMainLayout />
  ) : (
    <>
      <div className="flex-1 min-h-0 overflow-hidden px-2">
         {/* ResizablePanelGroup logic here */}
//       </div>
      
//       {/* This should be a normal block element that flexbox accounts for */}
//       <footer className="shrink-0">
//         <PlaybackControls />
//       </footer>
//     </>
//   )}
// </div> */}