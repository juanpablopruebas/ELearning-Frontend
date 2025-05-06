"use client";

import { Profile } from "@/components/profile/Profile";
import { SessionProvider } from "next-auth/react";

const ProfilePage = () => {
  return (
    <SessionProvider>
      <Profile />
    </SessionProvider>
  );
};

export default ProfilePage;
