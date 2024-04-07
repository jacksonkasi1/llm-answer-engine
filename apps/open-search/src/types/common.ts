import {
  GoogleImageSearchItem,
  ScraperVideoResult,
  SearchResult,
} from "./search";

export interface Message {
  id: number;
  type: string;
  content: string;
  userMessage: string;
  images: GoogleImageSearchItem[];
  videos: ScraperVideoResult[];
  followUp: FollowUp | null;
  isStreaming: boolean;
  searchResults?: SearchResult[];
}

export interface StreamMessage {
  searchResults?: any;
  userMessage?: string;
  llmResponse?: string;
  llmResponseEnd?: boolean;
  images?: any;
  videos?: any;
  followUp?: any;
}

export interface FollowUp {
  choices: {
    message: {
      content: string;
    };
  }[];
}
