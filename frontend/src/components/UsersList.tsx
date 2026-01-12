import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import type { iUser } from "@/types";
const UsersList = () => {
  const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } =
    useChatStore();

  // Helper to handle keyboard selection
  const handleKeyDown = (e: React.KeyboardEvent, user: iUser) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Prevent page scroll on Space
      setSelectedUser(user);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center h-full overflow-y-auto px-2 py-4 gap-3 scrollbar-hide">
        {isLoading ? (
          <UsersListSkeleton />
        ) : (
          users.map((user: iUser) => (
            <div
              key={user._id}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, user)} // Trigger on Enter/Space
              onClick={() => setSelectedUser(user)}
              className={`flex size-10 items-center justify-center
										 cursor-pointer transition-colors p-2 rounded-full
                    ${
                      selectedUser?.clerkId === user.clerkId
                        ? "bg-emerald-600"
                        : "hover:bg-zinc-500 bg-green-900"
                    }`}
            >
              <div className="relative">
                <Avatar className="size-8">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                </Avatar>
                {/* online indicator */}
                <div
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
                        ${
                          onlineUsers.has(user.clerkId)
                            ? "bg-green-500"
                            : "bg-zinc-500"
                        }`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersList;
