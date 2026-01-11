import { Link, Outlet, useLocation } from "react-router-dom";

import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import AudioPlayer from "@/components/AudioPlayer";
import Topbar from "@/components/Topbar";

import { Library } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import PlaybackControls from "@/components/PlaybackControls";

const MobileMainLayout = () => {
  const { isLoading, albums } = useMusicStore();
  const location = useLocation();
  const isChatRoute = location.pathname.includes("chat");

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-black text-white">
      {/* Row 1: Topbar & Header */}
      <header className="shrink-0">
        {" "}
        {/* Changed shring-0 to shrink-0 */}
        <AudioPlayer />
        <Topbar />
        {!isChatRoute && (
          <div className="mb-3">
            <div className="flex items-center justify-start p-2">
              <Library className="size-5 mr-2" />
              <span>Albums</span>
            </div>
            <div className="flex flex-col bg-zinc-800 rounded-lg">
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
      </header>

      {/* Row 3: Scrollable middle content */}
      <Outlet />

      {/* Row 4 & 5: Footer */}
      <footer className="shrink-0 border-t border-neutral-800">
        <PlaybackControls />
      </footer>
    </div>
  );
};

export default MobileMainLayout;
