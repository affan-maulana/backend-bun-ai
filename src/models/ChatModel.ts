import { Messages, MessageHistory } from "@prisma/client";

export type MessageHistoryRequest = {
    build_id: string,
    history_id?: string,
    is_question: boolean,
    knowladge_id: string,
    level: string,
    message: string,
    sessionId: string,
}

export type MessageHistoryResponse = {
    id: string;
    sessionId: string;
    knowledgeId: string;
    buildId: string;
    messages: MessageHistoryData[]; 
    updatedAt: Date;
    createdAt: Date;
}

export type MessageHistoryData = {
    id: string; 
    message: string;
    token: number;
    is_question: boolean;
    messageHistoryId: string;
    createdAt: Date;
}

export function toMessageHistoryResponse(
    messageHistory: MessageHistory,
    messages: MessageHistoryData[]
  ): MessageHistoryResponse {
    return {
      id: messageHistory.id,
      sessionId: messageHistory.sessionId,
      knowledgeId: messageHistory.knowledgeId,
      buildId: messageHistory.buildId,
      messages: messages,
      updatedAt: messageHistory.updatedAt,
      createdAt: messageHistory.createdAt,
    };
  }