import { atom } from "jotai";

// ** import types
import { Message } from "@/types";

export const messagesAtom = atom<Message[]>([]);
export const currentLlmResponseAtom = atom<string>("");
export const modelAtom = atom("cloudflare"); // Holds the value 'groq' or 'cloudflare'
