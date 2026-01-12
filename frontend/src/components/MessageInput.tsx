import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState, useRef } from "react"; 

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const { selectedUser, sendMessage, sendTyping, stopTyping } = useChatStore();

  // Use a ref to keep track of the timer across re-renders
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!selectedUser || !user || !newMessage) return;
    sendMessage(selectedUser.clerkId, user.id, newMessage.trim());

    // Immediately stop typing indicator when message is sent
    stopTyping(selectedUser.clerkId, user.id);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    setNewMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!selectedUser || !user) return;

    // 1. Tell the server we are typing
    sendTyping(selectedUser.clerkId, user.id);

    // 2. Clear existing timer
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // 3. Set a new timer to stop the indicator after 1.5 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(selectedUser.clerkId, user.id);
    }, 2000);
  };

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={handleInputChange} // Changed this
          className="border-none bg-zinc-800 placeholder:text-zinc-500 placeholder:italic placeholder:text-sm focus-visible:ring-1 focus-visible:ring-emerald-500 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <Button
          size={"icon"}
          onClick={handleSend}
          disabled={!newMessage.trim()}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
