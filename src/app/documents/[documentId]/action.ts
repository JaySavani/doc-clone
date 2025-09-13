"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
export async function getUser() {
  const { sessionClaims } = await auth();
  const clerk = await clerkClient();

  const respose = await clerk.users.getUserList({
    organizationId: [(sessionClaims?.o as { id?: string })?.id ?? ""],
  });
  const user = respose.data.map((user) => ({
    id: user.id,
    name:
      user.firstName ??
      user.username ??
      user.primaryEmailAddress?.emailAddress ??
      "Anonymous",
    avatar: user.imageUrl,
  }));
  return user;
}
