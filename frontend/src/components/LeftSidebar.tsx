import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PlaylistSkeleton from "./skeletons/PlaylistSkeleton";
import { ScrollArea } from "./ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";

const LeftSidebar = () => {
  const { albums, isLoading, fetchAlbums } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <aside className="h-full flex flex-col gap-3">
      <div className="flex flex-col items-start gap-2">
        <Link
          to="/"
          className="flex w-full items-start p-4 rounded-xl justify-start hover:bg-zinc-900 "
        >
          <HomeIcon className="size-5 mr-2" />
          <span className="hidden md:inline">Home</span>
        </Link>

        <Link
          to="/chat"
          className="flex w-full items-start p-4 rounded-xl   justify-start hover:bg-zinc-900"
        >
          <MessageCircle className="size-5 mr-2" />
          <span className="hidden md:inline">Messages</span>
        </Link>
      </div>

      {/* music library */}
      <div className="flex flex-col items-start gap-2  rounded-xl">
        <div className="flex items-center justify-start p-4">
          <Library className="size-5 mr-2" />
          <span className="hidden md:inline">Albums</span>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)] w-full p-4">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums?.map((album) => {
                return (
                  <Link
                    className="flex gap-3 items-center group rounded-md p-2 hover:bg-zinc-800 cursor-pointer"
                    key={album._id}
                    to={`/albums/${album._id}`}
                  >
                    <img
                      className="size-12 flex-shrink-0 rounded-md object-cover"
                      src={album.imageUrl}
                      alt="Album's image"
                    />
                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate ">{album.title}</p>
                      <p className="font-sm truncate text-zinc-500">Album {album.artist}</p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};
export default LeftSidebar;
