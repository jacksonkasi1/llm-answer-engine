// Define a type for the model values
export type ModelValue = "groq" | "cloudflare";

export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

// Updated interface for Streamable
export interface Streamable {
  update: (update: any) => void;
  done: (finalState: any) => void;
}

//  Define initial AI and UI states
export const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

export const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];
