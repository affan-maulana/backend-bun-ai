import { MessageResponse } from "./ChatModel";

export type SessionResponse = {
  id: string;
  userId: string;
  name: string | null,
  createdAt: Date;
  updatedAt: Date;
}

export type SessionRequest = {
  userId: string;
  sessionId: string;
}

export type SessionMessages = {
  id: string;
  userId: string;
  name: string | null;
  messages?: MessageResponse[]; 
  updatedAt: Date;
  createdAt: Date;
}