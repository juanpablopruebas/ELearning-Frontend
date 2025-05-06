"use client";

import { IRootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLogoutQuery } from "@/redux/features/api/authApi";
import { SidebarProfile } from "@/components/profile/SidebarProfile";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ChangePassword } from "@/components/profile/ChangePassword";
import { CourseCard } from "@/components/public/CourseCard";
import { Course } from "@/types";
import { useGetCoursesByUserQuery } from "@/redux/features/api/courseApi";
import { Loader } from "@/components/layout/Loader";
import { ToggleRole } from "@/components/profile/ToggleRole";
import { signOut, useSession } from "next-auth/react";

export const Profile = () => {
  const { user } = useSelector((state: IRootState) => state.auth);
  const { data: dataSession, status } = useSession();

  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    user?.avatar?.url
  );
  const [triggerLogout, setTriggerLogout] = useState(false);
  const [userCourses, setUserCourses] = useState<Course[]>([]);

  const {} = useLogoutQuery(undefined, { skip: !triggerLogout });
  const { data, isLoading } = useGetCoursesByUserQuery({});

  const handleLogout = async () => {
    if (status === "authenticated" && dataSession?.user) {
      await signOut();
      return;
    }
    setTriggerLogout(true);
  };

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (data?.courses) {
      setUserCourses(data.courses);
    }
  }, [data?.courses]);

  const isSticky = scrollY > 80;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-800 p-4 pt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <aside
          className={`md:sticky ${
            isSticky ? "top-[120px]" : "top-[30px]"
          } w-full md:w-1/4`}
        >
          <SidebarProfile
            active={activeTab}
            setActive={setActiveTab}
            avatar={avatarUrl}
            user={user}
            handleLogout={handleLogout}
          />
          <ToggleRole user={user} />
        </aside>

        <main className="w-full md:w-3/4 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
          {activeTab === 1 && (
            <ProfileInfo
              avatar={avatarUrl}
              setAvatar={setAvatarUrl}
              user={user}
            />
          )}
          {activeTab === 2 && <ChangePassword />}
          {activeTab === 3 && (
            <section className="p-4">
              {isLoading ? (
                <Loader />
              ) : userCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userCourses.map((course) => (
                    <CourseCard key={course._id} course={course} isProfile />
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-200">
                  You haven&apos;t enrolled in any courses yet.
                </p>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
