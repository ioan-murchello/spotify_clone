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

    fetchUsers: () => Promise<void>,
    initSocket: (userId: string) => void,
    disconnectSocket: () => void,
    sendMessage: (receiverId: string, senderId: string, content: string) => void,
    setSelectedUser: (user: iUser | null) => void;
    fetchMessages: (userId: string) => Promise<void>,

}


const baseUrl = import.meta.env.MODE === "development" ? 'http://localhost:5001' : '/api';
const socket = io(baseUrl, {
    autoConnect: false, // Disable automatic connection, only if user is authenticated
    withCredentials: true,
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

        initSocket: async (userId: string) => {
            if (!get().isConnected) {
                socket.auth = { userId };
                socket.connect();
                socket.emit('user_connected', userId);

                socket.on('users_online', (users: string[]) => {
                    set({ onlineUsers: new Set(users) })
                })

                socket.on('activities', (activities: [string, string][]) => {
                    set({ userActivities: new Map(activities) })
                })

                socket.on('user_connected', (userId: string) => {
                    set((state) => ({ onlineUsers: new Set([...state.onlineUsers, userId]) }))
                })

                socket.on('user_disconnected', (userId: string) => {
                    set((state) => {
                        const updatedOnlineUsers = new Set(state.onlineUsers);
                        updatedOnlineUsers.delete(userId);
                        return { onlineUsers: updatedOnlineUsers };
                    })
                })

                socket.on('receive_message', (message: iMessages) => {
                    set((state) => ({ messages: [...state.messages, message] }))
                })

                socket.on('message_sent', (message: iMessages) => {
                    set((state) => ({ messages: [...state.messages, message] }))
                })

                socket.on('activity_updated', ({ userId, activity }) => {
                    set((state) => {
                        const updatedActivities = new Map(state.userActivities);
                        updatedActivities.set(userId, activity);
                        return { userActivities: updatedActivities };
                    })
                })

                set({ isConnected: true, socket });

            }
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