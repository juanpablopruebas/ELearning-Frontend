/* eslint-disable @next/next/no-img-element */
"use client";

import { IRootState } from "@/redux/store";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "next-themes";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import "react-pro-sidebar/dist/css/styles.css";
import {
  MdBarChart,
  MdCategory,
  MdExitToApp,
  MdGroups,
  MdHome,
  MdManageHistory,
  MdMap,
  MdMenu,
  MdOndemandVideo,
  MdPeopleOutline,
  MdReceipt,
  MdSettings,
  MdVideoCall,
  MdWeb,
  MdWysiwyg,
} from "react-icons/md";
import { useSelector } from "react-redux";
import "react-pro-sidebar/dist/css/styles.css";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useLogoutQuery } from "@/redux/features/api/authApi";

export const AdminSidebar = () => {
  const { user } = useSelector((state: IRootState) => state.auth);
  const [activeItem, setActiveItem] = useState<MenuItemKey>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [triggerLogout, setTriggerLogout] = useState(false);
  const { theme, systemTheme } = useTheme();
  const pathname = usePathname();
  const { data: dataSession, status } = useSession();
  const {} = useLogoutQuery(undefined, { skip: !triggerLogout });

  useEffect(() => {
    const routeMap: { prefix: string; id: MenuItemKey }[] = [
      { prefix: "/admin/users-analytics", id: "usersAnalytics" },
      { prefix: "/admin/users", id: "users" },
      { prefix: "/admin/invoices", id: "invoices" },
      { prefix: "/admin/create-course", id: "createCourse" },
      { prefix: "/admin/courses-analytics", id: "courseAnalytics" },
      { prefix: "/admin/courses", id: "liveCourses" },
      { prefix: "/admin/hero", id: "hero" },
      { prefix: "/admin/faq", id: "faq" },
      { prefix: "/admin/categories", id: "categories" },
      { prefix: "/admin/team", id: "manageTeam" },
      { prefix: "/admin/orders-analytics", id: "orderAnalytics" },
      { prefix: "/admin/settings", id: "settings" },
      { prefix: "/logout", id: "logout" },
    ];

    const currentPath = pathname?.toLowerCase();
    const found = routeMap.find((r) => currentPath?.startsWith(r.prefix));
    setActiveItem(found ? found.id : "dashboard");
  }, [pathname]);

  const handleLogout = async () => {
    if (status === "authenticated" && dataSession?.user) {
      await signOut();
    }
    setTriggerLogout(true);
  };

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className={`${isCollapsed ? "w-22" : "w-60"}`}>
      <Box
        className={`transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-60"
        }`}
        sx={{
          "& .pro-sidebar-inner": {
            width: isCollapsed ? "5rem" : "15rem",
            background: currentTheme === "dark" ? "#18181b" : "#f9fafb",
          },
          "& .pro-sidebar-layout": {
            paddingRight: isCollapsed ? "0" : "1rem",
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "8px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#1f2937 !important",
          },
        }}
      >
        <ProSidebar
          collapsed={isCollapsed}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
          }}
        >
          <Menu>
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={
                isCollapsed ? (
                  <IconButton>
                    <MdMenu
                      size={20}
                      color={`${
                        theme === "system"
                          ? systemTheme === "dark"
                            ? "#fff"
                            : "#1f2937"
                          : theme === "dark"
                          ? "#fff"
                          : "#1f2937"
                      }`}
                    />
                  </IconButton>
                ) : undefined
              }
            >
              {!isCollapsed && (
                <Link href="/">
                  <h3 className="text-2xl text-center font-bold text-gray-800 dark:text-gray-100">
                    ELearning
                  </h3>
                </Link>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box className="mb-6 text-center">
                <IconButton onClick={() => setIsCollapsed(true)}>
                  <MdMenu
                    color={`${
                      theme === "system"
                        ? systemTheme === "dark"
                          ? "#fff"
                          : "#1f2937"
                        : theme === "dark"
                        ? "#fff"
                        : "#1f2937"
                    }`}
                  />
                </IconButton>
                <div className="flex justify-center mb-4 mt-2">
                  <img
                    alt="User Profile"
                    width={80}
                    height={80}
                    src={
                      user?.avatar
                        ? user.avatar.url
                        : "/assets/avatar-default.png"
                    }
                    className="rounded-full border-4 border-blue-600"
                  />
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Admin
                </p>
              </Box>
            )}

            <Box pl={!isCollapsed ? "1rem" : undefined}>
              <SidebarItem
                id="dashboard"
                label="Dashboard"
                to="/admin"
                icon={<MdHome size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />

              {!isCollapsed && (
                <p className="mt-4 ml-4 text-xs font-semibold text-gray-500 uppercase">
                  Data
                </p>
              )}
              <SidebarItem
                id="users"
                label="Users"
                to="/admin/users"
                icon={<MdGroups size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                id="invoices"
                label="Invoices"
                to="/admin/invoices"
                icon={<MdReceipt size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />

              {!isCollapsed && (
                <p className="mt-4 ml-4 text-xs font-semibold text-gray-500 uppercase">
                  Content
                </p>
              )}
              <SidebarItem
                id="createCourse"
                label="Create Course"
                to="/admin/create-course"
                icon={<MdVideoCall size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                id="liveCourses"
                label="Live Courses"
                to="/admin/courses"
                icon={<MdOndemandVideo size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />

              {!isCollapsed && (
                <p className="mt-4 ml-4 text-xs font-semibold text-gray-500 uppercase">
                  Customization
                </p>
              )}
              <SidebarItem
                id="hero"
                label="Hero"
                to="/admin/hero"
                icon={<MdWeb size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                id="faq"
                label="FAQ"
                to="/admin/faq"
                icon={<MdWysiwyg size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                id="categories"
                label="Categories"
                to="/admin/categories"
                icon={<MdCategory size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />

              {!isCollapsed && (
                <p className="mt-4 ml-4 text-xs font-semibold text-gray-500 uppercase">
                  Controllers
                </p>
              )}
              <SidebarItem
                id="manageTeam"
                label="Manage Team"
                to="/admin/team"
                icon={<MdPeopleOutline size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />

              {!isCollapsed && (
                <p className="mt-4 ml-4 text-xs font-semibold text-gray-500 uppercase">
                  Analytics
                </p>
              )}
              <SidebarItem
                id="courseAnalytics"
                label="Course Analytics"
                to="/admin/courses-analytics"
                icon={<MdBarChart size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                id="orderAnalytics"
                label="Order Analytics"
                to="/admin/orders-analytics"
                icon={<MdMap size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                id="usersAnalytics"
                label="Users Analytics"
                to="/admin/users-analytics"
                icon={<MdManageHistory size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />

              {!isCollapsed && (
                <p className="mt-4 ml-4 text-xs font-semibold text-gray-500 uppercase">
                  Extras
                </p>
              )}
              <SidebarItem
                id="settings"
                label="Profile"
                to="/profile"
                icon={<MdSettings size={20} />}
                activeItem={activeItem}
                isCollapsed={isCollapsed}
              />
              <div onClick={handleLogout}>
                <SidebarItem
                  id="logout"
                  label="Logout"
                  icon={<MdExitToApp size={20} />}
                  activeItem={activeItem}
                  isCollapsed={isCollapsed}
                />
              </div>
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </div>
  );
};

export type MenuItemKey =
  | "dashboard"
  | "users"
  | "invoices"
  | "createCourse"
  | "liveCourses"
  | "hero"
  | "faq"
  | "categories"
  | "manageTeam"
  | "courseAnalytics"
  | "orderAnalytics"
  | "usersAnalytics"
  | "settings"
  | "logout";

interface SidebarItemProps {
  id: MenuItemKey;
  label: string;
  icon: JSX.Element;
  activeItem: MenuItemKey;
  to?: string;
  isCollapsed: boolean;
}

export const SidebarItem = ({
  id,
  label,
  icon,
  activeItem,
  to,
  isCollapsed,
}: SidebarItemProps) => {
  const isActive = activeItem === id;

  const menuItem = (
    <MenuItem
      active={isActive}
      icon={icon}
      className={`my-1 rounded-md ${
        isActive
          ? "bg-blue-600 !text-white"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      {to ? <Link href={to} /> : null}
    </MenuItem>
  );

  return isCollapsed ? (
    <Tooltip title={label} placement="right">
      <div>{menuItem}</div>
    </Tooltip>
  ) : (
    menuItem
  );
};
