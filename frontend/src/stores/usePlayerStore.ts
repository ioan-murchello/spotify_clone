import { create } from "zustand";
import type { iSong } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerState {
    currentSong: iSong | null;
    isPlaying: boolean;
    queue: iSong[];
    currentIndex: number;
    audio: HTMLAudioElement | null;
    isRepeating: boolean;
    isPlayRandom: boolean;
    originalQueue: iSong[];

    setAudio: (audio: HTMLAudioElement) => void;
    repeatSong: () => void;
    initializeQueue: (songs: iSong[]) => void;
    playAlbum: (songs: iSong[], startIndex?: number) => void;
    setCurrentSong: (song: iSong | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleRandomPlay: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    originalQueue: [],
    currentIndex: -1,
    audio: null,
    isRepeating: false,
    isPlayRandom: false,



    setAudio: (audio) => set({ audio }),


    initializeQueue: (songs: iSong[]) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
        });
    },


    playAlbum: (songs: iSong[], startIndex = 0) => {
        if (songs.length === 0) return;
        const song = songs[startIndex] || songs[0];

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", { userId: socket.auth.userId, activity: `Playing ${song.title} by ${song.artist}` });
        }

        set({ queue: songs, currentIndex: startIndex, currentSong: song, isPlaying: true });
    },

    setCurrentSong: (song: iSong | null) => {
        if (!song) return;

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`,
            });
        }

        const songIndex = get().queue.findIndex((s) => s._id === song._id);
        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
        });
    },

    repeatSong: () => {

        const { audio, isRepeating } = get();
        if (!audio) return;

        audio.loop = !isRepeating;

        set({ isRepeating: !isRepeating });
    },




    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;
        const currentSong = get().currentSong;

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", { userId: socket.auth.userId, activity: willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Paused" });
        }

        set({ isPlaying: willStartPlaying });
    },


    playNext: () => {
        const { currentIndex, queue, isPlayRandom } = get();

        if (queue.length === 0) return;

        let nextIndex: number;

        if (isPlayRandom) {
            // pick a random index different from current
            if (queue.length === 1) return;

            do {
                nextIndex = Math.floor(Math.random() * queue.length);
            } while (nextIndex === currentIndex);
        }
        // normal sequential play
        if (currentIndex >= queue.length - 1) {
            set({ isPlaying: false });
            return;
        }
        nextIndex = currentIndex + 1;


        const nextSong = queue[nextIndex];

        set({
            currentIndex: nextIndex,
            currentSong: nextSong,
            isPlaying: true,
        });
    },


    playPrevious: () => {
        const { queue, currentIndex, isPlayRandom } = get();

        if (queue.length === 0) return;

        let prevIndex: number;

        if (isPlayRandom) {
            // random previous (different index)
            if (queue.length === 1) return;

            do {
                prevIndex = Math.floor(Math.random() * queue.length);
            } while (prevIndex === currentIndex);
        }
        // sequential previous
        if (currentIndex <= 0) {
            set({ isPlaying: false });
            return;
        }
        prevIndex = currentIndex - 1;


        const prevSong = queue[prevIndex];

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Listening to ${prevSong.title} by ${prevSong.artist}`,
            });
        }

        set({
            currentIndex: prevIndex,
            currentSong: prevSong,
            isPlaying: true,
        });
    },




    toggleRandomPlay: () => {
        const { isPlayRandom, queue, currentSong, currentIndex } = get();

        if (!currentSong) return;

        if (!isPlayRandom) {
            // turn shuffle ON
            set({ isPlayRandom: true });
        } else {
            // turn shuffle OFF → restore correct index
            const realIndex = queue.findIndex(
                song => song._id === currentSong._id
            );

            set({
                isPlayRandom: false,
                currentIndex: realIndex !== -1 ? realIndex : currentIndex,
            });
        }
    },




}))

