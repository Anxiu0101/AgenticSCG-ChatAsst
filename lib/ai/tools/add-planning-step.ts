import { z } from 'zod';
import { tool, type UIMessage, type DataStreamWriter } from 'ai';
import type { Session } from 'next-auth';
import { generateUUID } from '@/lib/utils';
import { savePlanningStep } from '@/lib/db/queries';

interface AddPlanningStepProps {
  session: Session;
  dataStream: DataStreamWriter;
  chatId: string;
}

export const addPlanningStep = ({
  session,
  dataStream,
  chatId,
}: AddPlanningStepProps) =>
  tool({
    description: 'Add a step to the reasoning process.',
    parameters: z.object({
      title: z.string().describe('The title of the reasoning step'),
      content: z
        .string()
        .describe(
          'The content of the reasoning step. WRITE OUT ALL OF YOUR WORK. Where relevant, prove things mathematically.',
        ),
      nextStep: z
        .enum(['continue', 'finalAnswer'])
        .describe(
          'Whether to continue with another step or provide the final answer',
        ),
    }),
    execute: async ({ title, content, nextStep }) => {
      const planningSteps: Array<PlanningStep> = [];
      const planningStep: PlanningStep = {
        title: title,
        content: content,
        nextStep: nextStep,
      };

      dataStream.writeData({
        type: 'planningStep',
        content: planningStep,
      });

      planningSteps.push(planningStep);

      if (session.user?.id) {
        const userId = session.user.id;

        await savePlanningStep({
          steps: planningSteps.map((planningStep) => ({
            id: generateUUID(),
            userId: userId,
            chatId: chatId,
            ...planningStep,
            createdAt: new Date(),
          })),
        });
      }

      return planningSteps;
    },
  });

export const planningStepSchema = z.object({
  title: z.string().describe('The title of the reasoning step'),
  content: z.string().describe('The content of the reasoning step.'),
  nextStep: z
    .enum(['continue', 'finalAnswer'])
    .describe(
      'Whether to continue with another step or provide the final answer',
    ),
});

export type PlanningStep = z.infer<typeof planningStepSchema>;

export function extractPlanningSteps(messages: UIMessage[]): PlanningStep[] {
  const steps: PlanningStep[] = [];

  for (const msg of messages) {
    // In message.parts: [{ type: 'tool', name: 'addPlanningStep', arguments: {...} }]
    // Or in the end of streaming: [{ type: 'toolResult', name: 'addPlanningStep', result: {...} }]
    for (const part of (msg.parts ?? []) as any[]) {
      const isPlanning =
        (part.type === 'tool-invocation' ||
          part.type === 'function' ||
          part.type === 'tool' ||
          part.type === 'toolResult') &&
        part.name === 'addPlanningStep';

      // console.log("extract planning payload is", isPlanning)

      if (isPlanning) {
        // console.log("planning payload loading......")
        const payload = part.arguments ?? part.result;
        if (payload?.title && payload?.content) {
          console.log('planning working...');

          steps.push({
            title: payload.title,
            content: payload.content,
            nextStep: payload.nextStep as 'continue' | 'finalAnswer',
          });
        }
      }
    }
  }
  return steps;
}
