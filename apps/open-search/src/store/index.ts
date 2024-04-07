import { atom } from "jotai";

// ** import types
import { Message } from "@/types";

export const messagesAtom = atom<Message[]>([]);
export const currentLlmResponseAtom = atom<string>("");
