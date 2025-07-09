// const tracerProvider = new NodeTracerProvider();
// const result = await generateText({
//   model: openai('gpt-4-turbo'),
//   prompt: 'Write a short story about a cat.',
//   experimental_telemetry: {
//     isEnabled: true,
//     tracer: tracerProvider.getTracer('ai'),
//   },
// });
//
// export const tracerProvider;

// export default const CustomProcessor() => (){}

import { Tracer, trace } from '@opentelemetry/api';

export function getTracer({
  isEnabled = false,
  tracer,
}: {
  isEnabled?: boolean;
  tracer?: Tracer;
} = {}): Tracer {
  if (tracer) {
    return tracer;
  }

  return trace.getTracer('ai');
}
