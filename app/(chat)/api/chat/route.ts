import {
  type UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { addPlanningStep } from '@/lib/ai/tools/add-planning-step';
import { myProvider } from '@/lib/ai/providers';
import { auditCodeSecurity } from '@/lib/ai/tools/audit-code-security';
import { getTracer } from '@/agents/telemetry';
import { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';

// export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
      selectedFilePathnames,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
      selectedFilePathnames: string;
    } = await request.json();

    const session = await auth();

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      await saveChat({ id, userId: session.user.id, title });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Forbidden', { status: 403 });
      }
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          providerOptions: {
            google: {
              thinkingConfig: {
                thinkingBudget: 2048,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
          system: systemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 25,
          temperature: 0.2,
          topK: 20,
          experimental_activeTools: [
            'chat-model-reasoning',
            'gpt-reasoning-model',
            'gemini-reasoning-model',
            'deepseak-reasoning-model',
          ].includes(selectedChatModel)
            ? [
                'getWeather',
                'addPlanningStep',
                'createDocument',
                'updateDocument',
                'auditCodeSecurity',
                'requestSuggestions',
              ]
            : [],
          // experimental_providerMetadata > providerOptions
          experimental_providerMetadata: {
            files: {
              selection: selectedFilePathnames,
            },
          },
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          experimental_telemetry: {
            // isEnabled: isProductionEnvironment,
            isEnabled: true,
            tracer: getTracer({ isEnabled: true }),
            // functionId: 'stream-text',
          },
          tools: {
            getWeather,
            addPlanningStep: addPlanningStep({
              session,
              dataStream,
              chatId: id,
            }),
            auditCodeSecurity: auditCodeSecurity({ session, dataStream }),
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({ session, dataStream }),
          },
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === 'assistant',
                  ),
                });

                if (!assistantId) {
                  throw new Error('No assistant message found!');
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments:
                        assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (_) {
                console.error('Failed to save chat');
              }
            }
          },
          // onStepFinish: async ({ response}) => {
          //   // console.log(result.usage)
          // }
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return 'Oops, an error occurred!';
      },
    });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Forbidden', { status: 403 });
    }

    const deletedChat = await deleteChatById({ id });

    return Response.json(deletedChat, { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
