import { Link, Outlet } from "react-router-dom";

import { ScrollArea } from "@/components/ui/scroll-area";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import AudioPlayer from "@/components/AudioPlayer";
import Topbar from "@/components/Topbar";

import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import PlaybackControls from "@/components/PlaybackControls";

const MobileMainLayout = () => {
  const { isLoading, albums } = useMusicStore();
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <AudioPlayer />
      <Topbar />

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-start p-4">
          <Library className="size-5 mr-2" />
          <span>Albums</span>
        </div>

        <div className="flex justify-around space-y-2 pt-0">
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

      {/* Scrollable middle section */}
      <ScrollArea className="flex-1 w-full p-4 overflow-auto">
        <div className="mt-4">
          <Outlet />
        </div>
      </ScrollArea>

      {/* Bottom navigation */}
      <div className="border-t border-neutral-800">
        <div className="flex justify-center items-center gap-2">
          <Link
            to="/"
            className="flex items-center p-4 rounded-xl justify-center hover:bg-zinc-900"
          >
            <HomeIcon className="size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <Link
            to="/chat"
            className="flex items-center p-4 rounded-xl justify-center hover:bg-zinc-900"
          >
            <MessageCircle className="size-5" />
            <span className="hidden md:inline">Messages</span>
          </Link>
        </div>
      </div>

      {/* Playback controls always visible */}
      <PlaybackControls />
    </div>
  );
};
export default MobileMainLayout;
