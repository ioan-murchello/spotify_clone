import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { useChatStore } from "@/stores/useChatStore";
import type { iUser } from "@/types";

const UsersList = () => {
  const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } =
    useChatStore();
  return (
     
      <div className="w-full min-h-16">
        <div className="flex w-full h-full overflow-y-auto p-2 bg-green-900">
          {isLoading ? (
            <UsersListSkeleton />
          ) : (
            users.map((user: iUser) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center flex-col justify-start gap-3
										rounded-2xl cursor-pointer transition-colors
                    ${
                      selectedUser?.clerkId === user.clerkId
                        ? "bg-zinc-700"
                        : "hover:bg-zinc-500"
                    }`}
              >
                <div className="relative">
                  <Avatar className="size-8 md:size-10">
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

                <div className="flex-1 min-w-0 hidden lg:block">
                  <span className="font-medium truncate">{user.fullName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
 
  );
};

export default UsersList;
