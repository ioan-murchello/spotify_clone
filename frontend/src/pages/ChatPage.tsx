import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import UsersList from "@/components/UsersList";
import ChatHeader from "@/components/ChatHeader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "@/components/MessageInput";

const formatTime = (date: string | number) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchUsers, fetchMessages, typingUsers } =
    useChatStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    // Use a small timeout to ensure the DOM has rendered the typing bubble
    const timer = setTimeout(() => {
      scrollRef.current?.scrollIntoView({
        behavior: "auto", // "smooth" feels more like a chat app
        block: "end",
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [messages, typingUsers]);

  return (
    <main className="grid grid-cols-[60px_1fr] md:grid-cols-[100px_1fr] lg:grid-cols-[150px_1fr] grid-rows-[auto_1fr_auto] h-full overflow-hidden">
      <div className="w-full row-span-2 overflow-y-auto">
        <UsersList />
      </div>

      {/* 2. Chat header - Top right */}
      {selectedUser && (
        <div className="shrink-0">
          <ChatHeader />
        </div>
      )}

      {!selectedUser ? (
        <div className="col-start-2 row-span-3 flex items-center justify-center">
          <NoConversationPlaceholder />
        </div>
      ) : (
        <div className="min-h-0 overflow-y-auto px-4 py-2 space-y-4 scrollbar-hide">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex items-start gap-3 ${
                message.senderId === user?.id ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="size-8">
                <AvatarImage
                  src={
                    message.senderId === user?.id
                      ? user.imageUrl
                      : selectedUser?.imageUrl
                  }
                />
              </Avatar>
              <div
                className={`rounded-xl p-3 max-w-[70%] ${
                  message.senderId === user?.id ? "bg-gray-700" : "bg-zinc-800"
                }`}
              >
                <p className="text-sm break-all">{message.content}</p>
                <span className="text-xs text-zinc-300 mt-1 block">
                  {formatTime(message.createdAt ?? 0)}
                </span>
              </div>
            </div>
          ))}
          {typingUsers?.has(selectedUser?.clerkId) && (
            <div className="bubble flex gap-1 items-center bg-zinc-800 text-zinc-400 px-4 py-3 rounded-2xl rounded-bl-none relative w-fit h-[40px]">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      )}

      {/* 4. Input - Spans both columns at the bottom */}
      {selectedUser && (
        <div className="col-start-2  shrink-0 border-t ">
          <MessageInput />
        </div>
      )}
    </main>
  );
};
export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-[80%]">
    <img
      src="/spotify.png"
      alt="Spotify"
      className="size-12 sm:size-16 animate-bounce"
    />
    <div className="text-center">
      <h3 className="text-zinc-300 text-md md:text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);
