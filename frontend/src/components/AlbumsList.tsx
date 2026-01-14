import { Library } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useMusicStore } from "@/stores/useMusicStore"; 

const AlbumsList = () => {
  const { albumId: activeAlbumId } = useParams();
  const { albums } = useMusicStore();

  if (!Array.isArray(albums)) {
    return <p>No albums available</p>;
  }

  return (
    <div className="mb-3">
      <div className="flex items-center justify-start p-2 mx-4">
        <Library className="size-5 mr-2" />
        <span>Albums</span>
      </div>
      <div className="flex flex-col bg-zinc-800 rounded-lg p-1 mb-4 mx-4">
        <div className="flex gap-2 justify-start space-y-2 relative overflow-auto px-3 pb-2">
          {albums?.map((album) => {
            const isActive = activeAlbumId === album._id;
            return (
              <Link
                key={album._id}
                to={`/albums/${album._id}`}
                // className={`flex gap-3 items-center group rounded-md p-2 hover:bg-zinc-800 cursor-pointer mt-2`}
                className={`flex gap-3 items-center group rounded-md px-2 py-2 mt-2 hover:bg-zinc-700/50 transition-colors cursor-pointer ${
                  isActive ? "bg-green-700 shadow-sm" : ""
                }`}
              >
                <img
                  className="size-14 flex-shrink-0 rounded-md object-cover"
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
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default AlbumsList;
