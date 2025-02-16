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
