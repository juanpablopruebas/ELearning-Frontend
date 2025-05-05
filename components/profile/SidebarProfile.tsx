/* eslint-disable @next/next/no-img-element */
import { User } from "@/types";
import Link from "next/link";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";

type SidebarProfileType = {
  active: number;
  setActive: (active: number) => void;
  user: User | null;
  handleLogout: () => void;
  avatar: string | undefined;
};

export const SidebarProfile = ({
  active,
  avatar,
  user,
  setActive,
  handleLogout,
}: SidebarProfileType) => {
  const commonClasses =
    "flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md";
  const activeClasses = "bg-gray-200 dark:bg-zinc-700";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 space-y-2">
      <div
        className={`${commonClasses} ${active === 1 ? activeClasses : ""}`}
        onClick={() => setActive(1)}
      >
        <img
          src={user?.avatar?.url ?? avatar ?? "/assets/avatar-default.png"}
          alt="User profile avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <h5 className="text-gray-800 dark:text-white font-medium">
          My Account
        </h5>
      </div>
      <div
        className={`${commonClasses} ${active === 2 ? activeClasses : ""}`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine
          size={20}
          className="text-gray-600 dark:text-gray-300"
        />
        <h5 className="text-gray-800 dark:text-white font-medium">
          Change Password
        </h5>
      </div>
      <div
        className={`${commonClasses} ${active === 3 ? activeClasses : ""}`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="text-gray-600 dark:text-gray-300" />
        <h5 className="text-gray-800 dark:text-white font-medium">
          Enrolled Courses
        </h5>
      </div>
      {user?.role === "admin" ? (
        <Link
          href="/admin"
          prefetch
          className={`${commonClasses} ${active === 4 ? activeClasses : ""}`}
        >
          <MdOutlineAdminPanelSettings
            size={20}
            className="text-gray-600 dark:text-gray-300"
          />
          <h5 className="text-gray-800 dark:text-white font-medium">
            Admin Dashboard
          </h5>
        </Link>
      ) : null}
      <div className={commonClasses} onClick={handleLogout}>
        <AiOutlineLogout
          size={20}
          className="text-gray-600 dark:text-gray-300"
        />
        <h5 className="text-gray-800 dark:text-white font-medium">Logout</h5>
      </div>
    </div>
  );
};
