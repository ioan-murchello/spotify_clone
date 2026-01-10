import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import UsersList from "@/components/UsersList";
import ChatHeader from "@/components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [messages]);

  return (
    <main className="rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <div className="grid grid-rows-[auto_1fr_auto]">
        <UsersList />

        {/* chat message */}
        <div className="flex h-full flex-col">
          {selectedUser ? (
            <div className="w-full h-full">
              <ChatHeader />

              {/* Messages */}
              <div className="flex flex-col h-full overflow-y-auto">
                <ScrollArea className=" h-full p-4 space-y-4">
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
                              : selectedUser.imageUrl
                          }
                        />
                      </Avatar>

                      <div
                        className={`rounded-lg p-3 max-w-[70%]
    											${message.senderId === user?.id ? "bg-green-500" : "bg-zinc-800"}
    										`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-zinc-300 mt-1 block">
                          {formatTime(message.createdAt ?? 0)}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div ref={scrollRef} />
                </ScrollArea>
              </div>
            </div>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>

          {selectedUser && <MessageInput />}

      </div>
    </main>
  );
};
export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/spotify.png" alt="Spotify" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);

// import { useChatStore } from "@/stores/useChatStore";
// import { useUser } from "@clerk/clerk-react";
// import { useEffect, useRef } from "react";
// import UsersList from "@/components/UsersList";
// import ChatHeader from "@/components/ChatHeader";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import MessageInput from "@/components/MessageInput";

// const formatTime = (date: string | number) => {
//   return new Date(date).toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// const ChatPage = () => {
//   const { user } = useUser();
//   const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();
//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (user) fetchUsers();
//   }, [fetchUsers, user]);

//   useEffect(() => {
//     if (selectedUser) fetchMessages(selectedUser.clerkId);
//   }, [selectedUser, fetchMessages]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
//   }, [messages]);

//   return (
//     <main className="h-screen flex flex-col bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
//       {/* UsersList + optional header */}
      
//         <UsersList />
       

//       {/* Messages - scrollable */}
//       <div className="flex-1">
//         {selectedUser && <ChatHeader />}

//         <div className="p-4">
//           <div className="space-y-4">
//             {selectedUser ? (
//               messages.map((message) => (
//                 <>
//                   <div
//                     key={message._id}
//                     className={`flex items-start gap-3 ${
//                       message.senderId === user?.id ? "flex-row-reverse" : ""
//                     }`}
//                   >
//                     <Avatar className="size-8">
//                       <AvatarImage
//                         src={
//                           message.senderId === user?.id
//                             ? user.imageUrl
//                             : selectedUser.imageUrl
//                         }
//                       />
//                     </Avatar>

//                     <div
//                       className={`rounded-lg p-3 max-w-[70%] ${
//                         message.senderId === user?.id
//                           ? "bg-green-500"
//                           : "bg-zinc-800"
//                       }`}
//                     >
//                       <p className="text-sm">{message.content}</p>
//                       <span className="text-xs text-zinc-300 mt-1 block">
//                         {formatTime(message.createdAt ?? 0)}
//                       </span>
//                     </div>
//                   </div>
//                 </>
//               ))
//             ) : (
//               <NoConversationPlaceholder />
//             )}
//             <div ref={scrollRef} />
//           </div>
//         </div>
//       </div>

//       {/* Message input - always visible at bottom */}
//       {selectedUser && <MessageInput />}
//     </main>
//   );
// };

// export default ChatPage;

// const NoConversationPlaceholder = () => (
//   <div className="flex flex-col items-center justify-center h-full space-y-6">
//     <img src="/spotify.png" alt="Spotify" className="size-16 animate-bounce" />
//     <div className="text-center">
//       <h3 className="text-zinc-300 text-lg font-medium mb-1">
//         No conversation selected
//       </h3>
//       <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
//     </div>
//   </div>
// );
