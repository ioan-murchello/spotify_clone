import { useChatStore } from "@/stores/useChatStore";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";

const ChatHeader = () => {
  const { selectedUser, onlineUsers } = useChatStore();
  const userIsPresent = onlineUsers.has(selectedUser?.clerkId || "")
  return (
    <div className="p-4 border-b border-zinc-700">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={selectedUser?.imageUrl || ""} />
            <AvatarFallback>{selectedUser?.fullName[0] || ""}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{selectedUser?.fullName}</h2>
            <p className={`text-xs ${userIsPresent ?  "text-green-500" : "text-zinc-500"} `}>
              {userIsPresent
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div> 
      </div>
    </div>
  );
};
export default ChatHeader;
