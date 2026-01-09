const PlaylistSkeleton = () => {
  return Array.from({ length: 7 }).map((_, i) => {
    return (
      <div key={i} className=" flex items-center gap-3 rounded-xl p-2">
        <div className="size-12 p-2 bg-zinc-800 rounded-md flex flex-shrink-0 animate-pulse" />
        <div className="flex-1 min-w-0 hidden md:block space-y-2">
          <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-3 w-1/2 bg-zinc-800 rounded animate-pulse"></div>
        </div>
      </div>
    );
  });
};
export default PlaylistSkeleton;
