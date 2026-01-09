import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import SongsTabContent from "@/components/SongsTabContent";
import AlbumsTabContent from "@/components/AlbumsTabContent";

const AdminPage = () => {
  const { isAdmin } = useAuthStore();
  const {
    fetchSongs,
    fetchAlbums,
    fetchStats,
    songs,
    albums,
    isLoading,
    isSongsLoading,
    isStatsLoading,
  } = useMusicStore();

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
    fetchStats();
  }, [fetchSongs, fetchAlbums, fetchStats]);

  if (!isAdmin) {
    return <div>Access Denied. Unauthorized...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-600 text-zinc-100 p-8">
      <Header />
      <DashboardStats />

      <Tabs defaultValue="songs" className="w-full">
        <TabsList>
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-zinc-600"
          >
            <Music className="mr-2 size-4" />
            Music
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            className="data-[state=active]:bg-zinc-600"
          >
            <Album className="mr-2 size-4" />
            Albums
          </TabsTrigger>
        </TabsList>
        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AdminPage;
