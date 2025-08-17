export const DEFAULT_CHAT_MODEL: string = 'chat-model';

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-gemini',
    name: 'Chat Gemini',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'chat-deepseek',
    name: 'chat deepseek',
    description: 'Powered by Deepseek',
  },
  {
    id: 'deepseak-reasoning-model',
    name: 'agent deepseek',
    description: 'Powered by Deepseek',
  },
  {
    id: 'gpt-reasoning-model',
    name: 'GPT based Agent',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'gemini-reasoning-model',
    name: 'Gemini based Agent',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'deepseak-reasoning-model',
    name: 'Deepseak based Agent',
    description: 'Uses advanced reasoning',
  },
];
