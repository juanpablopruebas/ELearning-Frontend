"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { useLoadUserQuery } from "@/redux/features/api/indexApi";
import { Loader } from "../../components/layout/Loader";
import { usePathname } from "next/navigation";

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return (
    <Provider store={store}>
      <CustomProvider>{children}</CustomProvider>
    </Provider>
  );
};

export default ReduxProvider;

const CustomProvider = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const isProfileOrAdminPage = pathName === "/profile" || pathName === "/admin";
  const { isLoading } = useLoadUserQuery(isProfileOrAdminPage);

  return <>{isLoading ? <Loader /> : children}</>;
};
