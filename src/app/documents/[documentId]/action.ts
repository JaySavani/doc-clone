"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<"documents">[]) {
  return await convex.query(api.documents.getByIds, { ids });
}

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
