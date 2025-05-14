import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { isTestEnvironment } from '@/lib/constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from '@/lib/ai/models.test';
import { ragMiddleware } from '@/lib/ai/middleware/rag';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openai('gpt-4o'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('gpt-4o-2024-08-06'),
          middleware: [
            ragMiddleware,
            // only extracting the reasoning part inside <think></think>. But didn't reasoning.
            extractReasoningMiddleware({ tagName: 'think' }),
          ],
        }),
        'title-model': openai('gpt-4o-mini'),
        'artifact-model': openai('gpt-4o-mini'),
      },
      imageModels: {
        'small-model': openai.image('dall-e-2'),
      },
    });
