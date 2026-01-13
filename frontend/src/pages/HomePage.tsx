import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useMemo } from "react";
import FeaturedSection from "@/components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "@/components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {
  const { fetchSongs, songs, isLoading } = useMusicStore();
  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    if (songs.length > 0) {
      initializeQueue(songs);
    }
  }, [songs, initializeQueue]);

const featuredSongs = useMemo(() => songs.slice(0, 6), [songs]); // 0, 1, 2, 3
const madeForYouSongs = useMemo(() => songs.slice(6, 8), [songs]); // 4, 5, 6, 7
const trendingSongs = useMemo(() => songs.slice(8), [songs]); // 8 ... end

 
  return (
    <main className="h-full rounded-md overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900">
      <ScrollArea className="h-full">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good afternoon
          </h1>
          <FeaturedSection songs={featuredSongs} />

          <div className="space-y-8">
            <SectionGrid
              title="Made For You"
              songs={madeForYouSongs}
              isLoading={isLoading}
            />
            <SectionGrid
              title="Trending"
              songs={trendingSongs}
              isLoading={isLoading}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};
export default HomePage;
