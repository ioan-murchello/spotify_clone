import { Link, Outlet, useLocation } from "react-router-dom";

// import { ScrollArea } from "@/components/ui/scroll-area";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import AudioPlayer from "@/components/AudioPlayer";
import Topbar from "@/components/Topbar";

import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import PlaybackControls from "@/components/PlaybackControls";

const MobileMainLayout = () => {
  const { isLoading, albums } = useMusicStore();
  const location = useLocation();
  const isChatRoute = location.pathname.includes("chat");

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Row 1: Topbar */}
      <AudioPlayer />
      <Topbar />

      {/* Row 2: Albums list (hidden on chat) */}
      {!isChatRoute && (
        <div>
          <div className="flex items-center justify-start p-2">
            <Library className="size-5 mr-2" />
            <span>Albums</span>
          </div>
          <div className="flex flex-col bg-zinc-800 rounded-lg mx-3">
            <div className="flex justify-around space-y-2 relative overflow-auto px-3 pb-2">
              {isLoading ? (
                <PlaylistSkeleton />
              ) : (
                albums?.map((album) => (
                  <Link
                    key={album._id}
                    to={`/albums/${album._id}`}
                    className={`flex gap-3 items-center group rounded-md p-2 hover:bg-zinc-800 cursor-pointer mt-2`}
                  >
                    <img
                      className="size-12 flex-shrink-0 rounded-md object-cover"
                      src={album.imageUrl}
                      alt={album.title}
                    />
                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate">{album.title}</p>
                      <p className="font-sm truncate text-zinc-500">
                        Album {album.artist}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Row 3: Scrollable middle content */}
      <div className="flex-1 w-full p-4">
        <Outlet />
      </div>

      {/* Row 4: Bottom navigation */}
      <div className="flex justify-center items-center gap-4 p-2 border-t border-neutral-800">
        <Link
          to="/"
          className="flex items-center p-2 rounded-xl justify-center hover:bg-zinc-900"
        >
          <HomeIcon className="size-5" />
          <span className="hidden md:inline ml-1">Home</span>
        </Link>

        <Link
          to="/chat"
          className="flex items-center p-2 rounded-xl justify-center hover:bg-zinc-900"
        >
          <MessageCircle className="size-5" />
          <span className="hidden md:inline ml-1">Messages</span>
        </Link>
      </div>

      {/* Row 5: Playback controls */}
      <PlaybackControls />
    </div>
  );
};

export default MobileMainLayout;
