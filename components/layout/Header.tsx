/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NavItems } from "../../app/utils/NavItems";
import { ThemeSwitcher } from "../../app/utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { CustomModals } from "../../app/utils/CustomModal";
import { useModalStore } from "../../app/hooks/modalStore";
import { useSelector } from "react-redux";
import { IRootState } from "@/redux/store";
import { SessionProvider } from "next-auth/react";

export const Header = () => {
  const { user } = useSelector((state: IRootState) => state.auth);
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const pathname = usePathname();
  const { setOpenModal } = useModalStore();

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        active ? "bg-gray-100 dark:bg-zinc-800 shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              LMS
            </span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <NavItems activeItem={pathname} />
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            {user ? (
              <Link href={"/profile"}>
                <img
                  src={
                    user?.avatar
                      ? user.avatar.url
                      : "/assets/avatar-default.png"
                  }
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="rounded-full select-none cursor-pointer"
                />
              </Link>
            ) : (
              <HiOutlineUserCircle
                size={25}
                className="hidden md:block cursor-pointer text-gray-900 dark:text-white"
                onClick={() => setOpenModal("signin")}
              />
            )}
            <HiOutlineMenuAlt3
              size={25}
              className="md:hidden cursor-pointer text-gray-900 dark:text-white"
              onClick={() => setOpenSidebar(true)}
            />
          </div>
        </div>
      </div>
      <hr className="border-black dark:border-white" />

      {openSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpenSidebar(false)}
        >
          <div
            className="fixed right-0 top-0 xs:w-96 w-full h-full bg-gray-100 dark:bg-zinc-800 p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-6 text-gray-900 dark:text-white"
              onClick={() => setOpenSidebar(false)}
            >
              <HiX size={30} />
            </button>
            <div className="text-center py-6">
              <Link
                href={`/`}
                className="text-2xl font-bold text-gray-900 dark:text-white"
                passHref
                onClick={() => setOpenSidebar(false)}
              >
                LMS
              </Link>
            </div>
            <NavItems activeItem={pathname} />
            <div className="w-full flex justify-center mt-4">
              {user ? (
                <Link href={"/profile"}>
                  <img
                    src={
                      user?.avatar
                        ? user.avatar.url
                        : "/assets/avatar-default.png"
                    }
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="rounded-full select-none cursor-pointer"
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="cursor-pointer text-gray-900 dark:text-white"
                  onClick={() => setOpenModal("signin")}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <SessionProvider>
        <CustomModals />
      </SessionProvider>
    </header>
  );
};
