'use client';
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

const UserAvatar = () => {
  const { data: session } = useSession();

  const name = session?.user?.name || "Guest";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={session?.user?.image || undefined} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold text-lg">Welcome,</h2>
        <p className="-mt-1">{name}</p>
      </div>
    </div>
  );
};

export default UserAvatar;