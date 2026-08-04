"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heart, HelpCircle, ListOrdered, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

const AccountPopover = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const userLinks = [
    {
      link: "/my-account",
      label: "My Account",
      icon: <User />,
      isActive: pathname.includes("/my-account"),
    },
    {
      link: "/wishlist",
      label: "Wishlist",
      icon: <Heart />,
      isActive: pathname.includes("/wishlist"),
    },
    {
      link: "/my-orders",
      label: "My Orders",
      icon: <ListOrdered />,
      isActive: pathname.includes("/my-orders"),
    },
    {
      link: "/help",
      label: "Help",
      icon: <HelpCircle />,
      isActive: pathname.includes("/help"),
    },
  ];

  return (
    <div className="hidden lg:block">
      <Popover>
        <PopoverTrigger className="flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 duration-200 p-2 rounded-md">
          <User size={25} />
        </PopoverTrigger>
        <PopoverContent
          className=" rounded-2xl 
      "
        >
          {status === "authenticated" ? (
            <ul className="space-y-1 text-center ">
              <UserAvatar />
              <Separator className="!my-2" />
              {userLinks.map((link) => (
                <Link
                  key={link.link}
                  href={link.link}
                  className={cn(
                    "flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md",
                    link.isActive && "bg-gray-200  dark:bg-gray-800"
                  )}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
              <Separator className="!my-2" />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-start justify-start gap-2 p-2 bg-transparent hover:opacity-50"
              >
                <LogOut />
                Logout
              </button>
            </ul>
          ) : (
            <div className="flex flex-col gap-2 text-center p-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sign in to view your account
              </p>
              <Link
                href="/sign-in"
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:opacity-80"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="p-2 rounded-md border hover:opacity-80"
              >
                Sign Up
              </Link>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccountPopover;