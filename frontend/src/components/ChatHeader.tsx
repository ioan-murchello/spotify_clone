import { useChatStore } from "@/stores/useChatStore";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";

const ChatHeader = () => {
  const { selectedUser, onlineUsers } = useChatStore();
  return (
    <div className="p-4 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={selectedUser?.imageUrl || ""} />
          <AvatarFallback>{selectedUser?.fullName[0] || ""}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{selectedUser?.fullName}</h2>
          <p className="text-xs text-green-500">
            {onlineUsers.has(selectedUser?.clerkId || "") ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
