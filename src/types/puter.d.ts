declare module 'puter' {
  export interface PuterAIResponse {
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  }

  export interface PuterAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

  export interface PuterAIChatOptions {
    messages: PuterAIMessage[];
    model?: string;
  }

  export interface PuterAI {
    chat(options: PuterAIChatOptions): Promise<PuterAIResponse>;
  }

  export interface Puter {
    init(): Promise<void>;
    ai: PuterAI;
  }

  export const puter: Puter;
} 