import {
  customProvider,
  createProviderRegistry,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai, createOpenAI } from '@ai-sdk/openai';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { isTestEnvironment } from '@/lib/constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from '@/lib/ai/models.test';
import { ragMiddleware } from '@/lib/ai/middleware/rag';

const registry = createProviderRegistry(
  {
    anthropic: createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
    openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    google: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY }),
  },
  {
    separator: ':',
  },
);

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
        'chat-model': registry.languageModel('openai:gpt-4o-mini'),
        'chat-gemini': registry.languageModel('google:gemini-2.5-flash'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('gpt-4o-2024-08-06'),
          middleware: [
            ragMiddleware,
            // only extracting the reasoning part inside <think></think>. But didn't reasoning.
            // extractReasoningMiddleware({ tagName: 'think' }),
          ],
        }),
        'deepseak-reasoning-model': wrapLanguageModel({
          model: openai('gpt-4o-2024-08-06'),
          middleware: [
            ragMiddleware,
            // only extracting the reasoning part inside <think></think>. But didn't reasoning.
            extractReasoningMiddleware({ tagName: 'think' }),
          ],
        }),
        'gpt-reasoning-model': wrapLanguageModel({
          model: openai('gpt-4o-2024-08-06'),
          middleware: [
            ragMiddleware,
            // only extracting the reasoning part inside <think></think>. But didn't reasoning.
            // extractReasoningMiddleware({ tagName: 'think' }),
          ],
        }),
        'gemini-reasoning-model': wrapLanguageModel({
          model: google('gemini-2.5-pro-exp-03-25', {
            useSearchGrounding: true,
          }),
          middleware: [
            ragMiddleware,
            // only extracting the reasoning part inside <think></think>. But didn't reasoning.
            extractReasoningMiddleware({ tagName: 'think' }),
          ],
        }),
        'title-model': registry.languageModel('openai:gpt-4o-mini'),
        'artifact-model': openai('gpt-4o-mini'),
      },
      textEmbeddingModels: {
        textEmbeddingModels: registry.textEmbeddingModel(
          'openai:text-embedding-3-small',
        ),
      },
      imageModels: {
        'small-model': openai.image('dall-e-2'),
      },
    });
