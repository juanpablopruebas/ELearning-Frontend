"use client";

import { Modal } from "@mui/material";
import { useModalStore } from "../hooks/modalStore";
import { SignIn } from "../../components/auth/SignIn";
import { SignUp } from "../../components/auth/SignUp";
import { Verification } from "../../components/auth/Verification";
import { useEffect } from "react";
import { IRootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useSocialAuthMutation } from "@/redux/features/api/authApi";

export const CustomModals = () => {
  const { openModal, setOpenModal } = useModalStore();
  const { user } = useSelector((state: IRootState) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();

  useEffect(() => {
    const handleAuth = async () => {
      if (!user) {
        if (data?.user) {
          await socialAuth({
            email: data.user?.email,
            name: data.user?.name,
            avatar: data.user?.image,
          });
        } else {
          await signOut();
        }
      }
      if (isSuccess) {
        toast.success("Login successfully");
      }
    };
    handleAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isSuccess, data?.user]);
  return (
    <>
      <Modal
        open={openModal === "signin"}
        onClose={() => setOpenModal(null)}
        aria-labelledby="signin-modal-title"
        aria-describedby="signin-modal-description"
        className="flex justify-center items-center"
      >
        <SignIn />
      </Modal>

      <Modal
        open={openModal === "signup"}
        onClose={() => setOpenModal(null)}
        aria-labelledby="signup-modal-title"
        aria-describedby="signup-modal-description"
        className="flex justify-center items-center"
      >
        <SignUp />
      </Modal>

      <Modal
        open={openModal === "verification"}
        aria-labelledby="verification-modal-title"
        aria-describedby="verification-modal-description"
        className="w-full h-full flex justify-center items-center"
      >
        <Verification />
      </Modal>
    </>
  );
};
