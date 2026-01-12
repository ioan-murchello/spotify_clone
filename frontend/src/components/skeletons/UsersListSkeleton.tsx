const UsersListSkeleton = () => {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-zinc-800" />
        <div className="absolute bottom-0 right-0 size-3 bg-zinc-700 border-2 border-black rounded-full" />
      </div>
    </div>
  ));
};

export default UsersListSkeleton;
