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
        const { currentSong } = get();

        set({
            queue: songs,
            currentSong: currentSong || songs[0],
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

        if (isPlayRandom && queue.length > 1) {
            // Логіка випадкового вибору
            do {
                nextIndex = Math.floor(Math.random() * queue.length);
            } while (nextIndex === currentIndex);
        } else {
            // Звичайна послідовна логіка
            nextIndex = currentIndex + 1;
        }

        // Перевіряємо, чи ми не вийшли за межі черги
        if (nextIndex < queue.length && nextIndex >= 0) {
            const nextSong = queue[nextIndex];

            set({
                currentIndex: nextIndex,
                currentSong: nextSong,
                isPlaying: true,
            });
        } else {
            // Якщо це була остання пісня — зупиняємо
            set({ isPlaying: false });
        }
    },

    playPrevious: () => {
        const { queue, currentIndex, isPlayRandom } = get();

        if (queue.length === 0) return;

        let prevIndex: number;

        if (isPlayRandom && queue.length > 1) {
            // Випадковий попередній
            do {
                prevIndex = Math.floor(Math.random() * queue.length);
            } while (prevIndex === currentIndex);
        } else {
            // Звичайний перехід назад
            prevIndex = currentIndex - 1;
        }

        // Якщо ми намагаємося піти далі першої пісні в звичайному режимі
        if (prevIndex < 0) {
            // У Spotify зазвичай пісня просто починається спочатку, 
            // або плеєр зупиняється, якщо це початок списку.
            set({ isPlaying: false });
            return;
        }

        const prevSong = queue[prevIndex];

        // Оновлення активності через сокети
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

