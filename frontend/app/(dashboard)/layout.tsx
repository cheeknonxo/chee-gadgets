import DashboardHeader from "@/components/dashboard/header/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/sidebar/DashboardSidebar";
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const role = (session.user as any).role;
  if (role !== "SELLER" && role !== "ADMIN") {
    redirect("/my-account");
  }

  return (
    <div>
      <DashboardHeader />
      <div className="max-w-screen-xl mx-auto  flex flex-col md:flex-row gap-2  md:px-8">
        <DashboardSidebar />
        {children}
      </div>
    </div>
  );
};

export default layout;