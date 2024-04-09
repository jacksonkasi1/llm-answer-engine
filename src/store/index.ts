import { atom } from "jotai";

// ** import types
import { Message, ModelValue } from "@/types";

export const messagesAtom = atom<Message[]>([]);
export const currentLlmResponseAtom = atom<string>("");
export const modelAtom = atom<ModelValue>("cloudflare");
