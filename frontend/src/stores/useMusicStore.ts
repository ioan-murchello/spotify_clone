import { axiosInstance } from '../lib/axios.ts';
import type { iAlbum, iSong, iStats } from '@/types';
import toast from 'react-hot-toast';
import { create } from 'zustand'


interface MusicStore {
    songs: iSong[],
    albums: iAlbum[],

    isLoading: boolean,
    isStatsLoading: boolean,
    isSongsLoading: boolean,

    error: string | null;
    currentAlbum: iAlbum | null;
    madeForYouSongs: iSong[];
    trendingSongs: iSong[];
    featuredSongs: iSong[];
    stats: iStats;
    fetchAlbums: () => Promise<void>,
    fetchAlbumById: (albumId: string) => Promise<void>,
    fetchFeaturedSongs: () => Promise<iSong[]>,
    fetchMadeForYouSongs: () => Promise<iSong[]>,
    fetchTrendingSongs: () => Promise<iSong[]>,

    deleteSong: (songId: string) => Promise<void>,
    deleteAlbum: (albumId: string) => Promise<void>

    fetchStats: () => Promise<void>,
    fetchSongs: () => Promise<void>,

};

export const useMusicStore = create<MusicStore>((set) => {
    return {
        albums: [],
        songs: [],
        isLoading: false,
        error: null,
        currentAlbum: null,
        madeForYouSongs: [],
        trendingSongs: [],
        featuredSongs: [],
        stats: {
            totalSongs: 0,
            totalAlbums: 0,
            totalUsers: 0,
            totalArtists: 0,
        },
        isSongsLoading: false,
        isStatsLoading: false,

        deleteAlbum: async (albumId) => {
            set({ isLoading: true, error: null })
            try {
                await axiosInstance.delete(`/admin/albums/${albumId}`)
                set((prevState) => ({
                    albums: prevState.albums.filter(album => album._id !== albumId),
                    songs: prevState.songs.map(song => {
                        return song.albumId === prevState.albums.find(a => a._id === albumId)?.title ? { ...song, albumId: null } : song
                    })
                }))
            } catch (error) {
                console.log(error)
            }
        },

        deleteSong: async (songId: string) => {
            set({ isSongsLoading: true, error: null })
            try {
                await axiosInstance.delete(`/admin/songs/${songId}`)
                set((prevState) => ({
                    songs: prevState.songs.filter(s => s._id !== songId)
                }))
                toast.success('Song deleted')
            } catch (error) {
                console.log(error, 'error in deleteSong handler in zustand')
                toast.error('Error deleting song...')
            } finally {
                set({ isSongsLoading: false })
            }
        },

        fetchSongs: async () => {
            set({ isSongsLoading: true, error: null });
            try {
                const res = await axiosInstance.get('/songs')
                if (!res.data) {
                    throw new Error('No songs found');
                }
                set({ songs: res.data, isSongsLoading: false });
            } catch (error) {
                console.log(error)
                set({ error: (error as Error).message, isSongsLoading: false });
            }
        },
        fetchStats: async () => {
            set({ isStatsLoading: true, error: null });
            try {
                const res = await axiosInstance.get('/stats')
                if (!res.data) {
                    throw new Error('No songs found');
                }
              
                set({ stats: res.data, isStatsLoading: false });
            } catch (error) {
                console.log(error)
                set({ error: (error as Error).message, isStatsLoading: false });
            }
        },

        fetchAlbums: async () => {
            set({ isLoading: true, error: null })
            try {
                const res = await axiosInstance.get('/albums')
                set({ albums: res.data })

            } catch (error: any) {
                console.log(error);
                set({ error: error.response?.data?.message })
            } finally {
                set({ isLoading: false })
            }
        },
        fetchAlbumById: async (albumId) => {
            set({ isLoading: true, error: null })
            try {
                const res = await axiosInstance.get(`/albums/${albumId}`)
                set({ currentAlbum: res.data })
            } catch (error: any) {
                console.log(error)
                set({ error: error?.response?.data?.message })
            } finally {
                set({ isLoading: false })
            }
        },
        fetchFeaturedSongs: async (): Promise<iSong[]> => {
            set({ isLoading: true, error: null })
            try {
                const res = await axiosInstance.get('/songs/featured')
                set({ featuredSongs: res.data })
                return res.data
            } catch (error: any) {
                console.log(error)

                set({ error: error?.response?.data?.message })
                return [];
            } finally {
                set({ isLoading: false })
            }
        },
        fetchMadeForYouSongs: async () => {
            set({ isLoading: true, error: null })
            try {
                const res = await axiosInstance.get('/songs/made-for-you')
                set({ madeForYouSongs: res.data })
                return res.data
            } catch (error: any) {
                console.log(error)
                set({ error: error?.response?.data?.message })
                return [];
            } finally {
                set({ isLoading: false })
            }
        },
        fetchTrendingSongs: async () => {
            set({ isLoading: true, error: null })
            try {
                const res = await axiosInstance.get('/songs/trending')
                set({ trendingSongs: res.data })
                return res.data
            } catch (error: any) {
                console.log(error)
                set({ error: error?.response?.data?.message })
                return [];
            } finally {
                set({ isLoading: false })
            }
        },
    }
})