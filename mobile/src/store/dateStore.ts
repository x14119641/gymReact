import { create } from "zustand";

type DateStore = {
    homeDateISO:string;
    setHomeDateISO:(iso:string) =>void;
};

export const useDateStore = create<DateStore>((set) => ({
    homeDateISO: new Date().toISOString().slice(0,10),
    setHomeDateISO:(iso) => set({homeDateISO:iso}),
}));