"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUser } from "./action";
import { toast } from "sonner";

type user = {
  id: string;
  name: string;
  avatar: string;
};

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  const [users, setUsers] = useState<user[]>([]);

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUser();
        setUsers(list);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      throttle={16}
      resolveUsers={({ userIds }) =>
        users.filter((u) => userIds.includes(u.id))
      }
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;

        if (text) {
          const lowerText = text.toLowerCase();
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(lowerText)
          );
        }
        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={() => []}
    >
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense
          fallback={<FullscreenLoader label="Room Loading..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
