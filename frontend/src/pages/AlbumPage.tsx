import { Button } from "@/components/ui/button";
import { useMusicStore } from "../stores/useMusicStore.ts";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePlayerStore } from "@/stores/usePlayerStore.ts";

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// const AlbumPage = () => {
//   const { albumId } = useParams();
//   const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();

//   const { isPlaying, currentSong, playAlbum, togglePlay } = usePlayerStore();

//   useEffect(() => {
//     if (albumId) {
//       fetchAlbumById(albumId);
//     }
//   }, [albumId, fetchAlbumById]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   const handlePlayAlbum = () => {
//     if (!currentAlbum) return;
//     const isCurentAlbumPlaying = currentAlbum.songs.some(
//       (song) => song._id === currentSong?._id
//     );
//     if (isCurentAlbumPlaying) togglePlay();
//     else {
//       playAlbum(currentAlbum.songs, 0);
//     }
//   };

//   const handlePlaySong = (index: number) => {
//     if (!currentAlbum) return;
//     playAlbum(currentAlbum.songs, index);
//   };

//   return (
//     <div className="h-full">
//       <ScrollArea className="h-full rounded-md">
//         {/* Main Content */}
//         <div className="relative min-h-full">
//           {/* bg gradient */}
//           <div
//             className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
// 					 to-zinc-900 pointer-events-none"
//             aria-hidden="true"
//           />

//           {/* Content */}
//           <div className="relative z-10">
//             <div className="flex p-6 gap-6 pb-8">
//               <img
//                 src={currentAlbum?.imageUrl}
//                 alt={currentAlbum?.title}
//                 className="w-[240px] h-[240px] shadow-xl rounded"
//               />
//               <div className="flex flex-col justify-end">
//                 <p className="text-sm font-medium">Album</p>
//                 <h1 className="text-7xl font-bold my-4">
//                   {currentAlbum?.title}
//                 </h1>
//                 <div className="flex items-center gap-2 text-sm text-zinc-100">
//                   <span className="font-medium text-white">
//                     {currentAlbum?.artist}
//                   </span>
//                   <span>• {currentAlbum?.songs.length} songs</span>
//                   <span>• {currentAlbum?.releaseYear}</span>
//                 </div>
//               </div>
//             </div>

//             {/* play button */}
//             <div className="px-6 pb-4 flex items-center gap-6">
//               <Button
//                 onClick={handlePlayAlbum}
//                 size="icon"
//                 className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400
//                 hover:scale-105 transition-all"
//               >
//                 {isPlaying &&
//                 currentAlbum?.songs.some(
//                   (song) => song._id === currentSong?._id
//                 ) ? (
//                   <Pause className="h-7 w-7 text-black" />
//                 ) : (
//                   <Play className="h-7 w-7 text-black" />
//                 )}
//               </Button>
//             </div>

//             {/* Table Section */}
//             <div className="bg-black/20 backdrop-blur-sm">
//               {/* table header */}
//               <div
//                 className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm
//             text-zinc-400 border-b border-white/5"
//               >
//                 <div>#</div>
//                 <div>Title</div>
//                 <div>Released Date</div>
//                 <div>
//                   <Clock className="h-4 w-4" />
//                 </div>
//               </div>

//               {/* songs list */}

//               <div className="px-6">
//                 <div className="space-y-2 py-4">
//                   {currentAlbum?.songs.map((song, index) => {
//                     const isCurrentSong = currentSong?._id === song._id;
//                     return (
//                       <div
//                         key={song._id}
//                         onClick={() => handlePlaySong(index)}
//                         className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm
//                       text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
//                       `}
//                       >
//                         <div className="flex items-center justify-center">
//                           {isCurrentSong && isPlaying ? (
//                             <div className="size-4 text-green-500">♫</div>
//                           ) : (
//                             <span className="group-hover:hidden">
//                               {index + 1}
//                             </span>
//                           )}
//                           {!currentSong && (
//                             <Play className="h-4 w-4 hidden group-hover:block" />
//                           )}
//                         </div>

//                         <div className="flex items-center gap-3">
//                           <img
//                             src={song.imageUrl}
//                             alt={song.title}
//                             className="size-10"
//                           />

//                           <div>
//                             <div className={`font-medium text-white`}>
//                               {song.title}
//                             </div>
//                             <div>{song.artist}</div>
//                           </div>
//                         </div>
//                         <div className="flex items-center">
//                           {song.createdAt.split("T")[0]}
//                         </div>
//                         <div className="flex items-center">
//                           {formatDuration(song.duration)}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </ScrollArea>
//     </div>
//   );
// };

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum } = useMusicStore();
  const { isPlaying, currentSong, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [albumId, fetchAlbumById]);

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;
    const isCurrentAlbumPlaying = currentAlbum.songs.some(
      (s) => s._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) togglePlay();
    else playAlbum(currentAlbum.songs, 0);
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum.songs, index);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-zinc-900">
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide">
        {/* Main Content */}
        <div className="relative min-h-full pb-3">
          {/* Background Gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/60 via-zinc-900 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header Section: Stacked for Mobile */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 px-6 text-center">
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="size-36 shadow-2xl rounded-md mb-6 object-cover"
              />
              <div className="flex flex-col">
                <p className="text-xs uppercase tracking-widest font-bold text-zinc-200">
                  Album
                </p>
                <h1 className="text-3xl font-extrabold my-2 text-white">
                  {currentAlbum?.title}
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-300">
                  <span className="font-semibold text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span>•</span>
                  <span>{currentAlbum?.releaseYear}</span>
                </div>
                <div className="text-zinc-400 text-sm">
                  {currentAlbum?.songs.length} songs
                </div>
              </div>
            </div>

            {/* play button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400
                hover:scale-105 transition-all"
              >
                {isPlaying &&
                currentAlbum?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>
 
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                      `}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-green-500">♫</div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!currentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10"
                          />

                          <div>
                            <div className={`font-medium text-white`}>
                              {song.title}
                            </div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center">
                          {formatDuration(song.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;

// return (
//   <div className="h-full w-full flex flex-col overflow-hidden bg-zinc-900">
//     <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide">
//       <div className="relative min-h-full pb-32"> {/* Increased to pb-32 */}
//         <div className="absolute inset-0 bg-gradient-to-b ..." />

//         <div className="relative z-10">
//           <div className="flex flex-col ..."> {/* Header */} </div>
//           <div className="px-6 pb-4 ..."> {/* Play Button */} </div>

//           <div className="bg-black/20 ..."> {/* Table Wrapper */}
//             <div className="hidden sm:grid grid-cols-..."> {/* Header - Hidden on mobile */} </div>
//             <div className="bg-black/30 ..."> {/* Songs List */}
//               {/* .map logic */}
//             </div>
//           </div>
//         </div> {/* End z-10 */}
//       </div> {/* End min-h-full */}
//     </div> {/* End Scroller */}
//   </div> /* End Main Container */
// );
