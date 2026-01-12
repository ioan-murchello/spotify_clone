import { axiosInstance } from '@/lib/axios';
import type { iMessages, iUser } from '@/types';
import { create } from 'zustand';

import { io } from 'socket.io-client';

interface ChatStore {
    users: iUser[],
    isLoading: boolean,
    error: string | null;
    socket: any;
    isConnected: boolean;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>;
    messages: iMessages[];
    selectedUser: iUser | null;

    typingUsers: Set<string | undefined>; // Track multiple people typing
    sendTyping: (receiverId: string, senderId: string) => void;
    stopTyping: (receiverId: string, senderId: string) => void;

    fetchUsers: () => Promise<void>,
    initSocket: (userId: string) => void,
    disconnectSocket: () => void,
    sendMessage: (receiverId: string, senderId: string, content: string) => void,
    setSelectedUser: (user: iUser | null) => void;
    fetchMessages: (userId: string) => Promise<void>,

}


const baseUrl = import.meta.env.MODE === "development" ? 'http://localhost:5001' : 'https://spotify-clone-xlpm.onrender.com';
const socket = io(baseUrl, {
    autoConnect: false, // Disable automatic connection, only if user is authenticated
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
});

export const useChatStore = create<ChatStore>((set, get) => {
    return {
        users: [],
        isLoading: false,
        error: null,
        socket: socket,
        isConnected: false,
        onlineUsers: new Set<string>(),
        userActivities: new Map<string, string>(),
        messages: [],
        selectedUser: null,
        typingUsers: new Set<string>(),

        initSocket: async (userId: string) => {
            // Only initialize if we aren't already connected
            if (!get().isConnected) {
                socket.auth = { userId };

                // --- CONNECTION HANDLERS ---
                socket.on('connect', () => {
                    socket.emit('user_connected', userId);
                    set({ isConnected: true });
                });

                socket.on("connect_error", (err) => {
                    if (err.message === "Session ID unknown") {
                        console.warn("Session expired, reconnecting...");
                        socket.connect();
                    }
                });

                // --- REAL-TIME DATA LISTENERS (Crucial for UI updates) ---

                // Listen for when a message is sent to YOU
                socket.on('receive_message', (message: iMessages) => {
                    set((state) => ({ messages: [...state.messages, message] }));
                });

                // Listen for confirmation that YOUR message was sent successfully
                socket.on('message_sent', (message: iMessages) => {
                    set((state) => ({ messages: [...state.messages, message] }));
                });

                socket.on('users_online', (users: string[]) => {
                    set({ onlineUsers: new Set(users) });
                });

                socket.on('user_connected', (uId: string) => {
                    set((state) => ({ onlineUsers: new Set([...state.onlineUsers, uId]) }));
                });

                socket.on('user_disconnected', (uId: string) => {
                    set((state) => {
                        const updatedOnlineUsers = new Set(state.onlineUsers);
                        updatedOnlineUsers.delete(uId);
                        return { onlineUsers: updatedOnlineUsers };
                    });
                });

                socket.on('activities', (activities: [string, string][]) => {
                    set({ userActivities: new Map(activities) });
                });

                socket.on('activity_updated', ({ userId: uId, activity }) => {
                    set((state) => {
                        const updatedActivities = new Map(state.userActivities);
                        updatedActivities.set(uId, activity);
                        return { userActivities: updatedActivities };
                    });
                });

                socket.on('user_typing', ({ userId }) => {
                    set((state) => ({ typingUsers: new Set(state.typingUsers).add(userId) }));
                });

                socket.on('user_stopped_typing', ({ userId }) => {
                    set((state) => {
                        const updated = new Set(state.typingUsers);
                        updated.delete(userId);
                        return { typingUsers: updated };
                    });
                });

                // Trigger the connection
                socket.connect();
            }
        },

        sendTyping: (receiverId, senderId) => {
            socket.emit('typing', { receiverId, senderId });
        },

        stopTyping: (receiverId, senderId) => {
            socket.emit('stop_typing', { receiverId, senderId });
        },

        sendMessage: (receiverId, senderId, content) => {
            const socket = get().socket;
            socket.emit('send_message', { receiverId, senderId, content });
        },

        fetchMessages: async (userId: string) => {
            set({ isLoading: true, error: null })
            try {
                const res = await axiosInstance.get(`/users/messages/${userId}`);

                set({ messages: res.data || [] });
            } catch (error: any) {
                console.log(error)
                set({ error: error?.response?.data?.message || 'Failed to fetch messages' })
            } finally {
                set({ isLoading: false })
            }
        },

        disconnectSocket: () => {
            if (get().isConnected) {
                socket.removeAllListeners(); // Clean up listeners
                socket.disconnect();
                set({ isConnected: false });
            }
        },

        fetchUsers: async () => {
            set({ isLoading: true, error: null })
            try {
                const res = await axiosInstance.get('/users');

                set({ users: res.data || [] });
            } catch (error: any) {
                console.log(error)
                set({ error: error?.response?.data?.message || 'Failed to fetch users' })
            } finally {
                set({ isLoading: false })
            }
        },



        setSelectedUser: (user: iUser | null) => {
            set({ selectedUser: user });
        }


    }

})