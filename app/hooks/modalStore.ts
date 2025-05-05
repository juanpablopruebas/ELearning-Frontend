import { create } from "zustand";

type ModalType = "signin" | "signup" | "verification" | null;

interface ModalStore {
  openModal: ModalType;
  setOpenModal: (modal: ModalType) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  setOpenModal: (modal) => set({ openModal: modal }),
}));
