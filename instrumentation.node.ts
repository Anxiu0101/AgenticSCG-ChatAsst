/*instrumentation.node.ts*/
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OpenAIInstrumentation } from '@elastic/opentelemetry-instrumentation-openai';

const otlpEndpoint =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces';

try {
  const sdk = new NodeSDK({
    // serviceName: 'next-app',
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'agenticscg-chatasst',
    }),
    spanProcessors: [
      new SimpleSpanProcessor(
        new OTLPTraceExporter({
          url: otlpEndpoint,
        }),
      ),
    ],
    instrumentations: [
      new OpenAIInstrumentation({
        captureMessageContent: true,
      }),
    ],
  });
  sdk.start();
} catch (error) {
  console.error('Fail to start telemetry sdk', error);
}

// console.log('OpenTelemetry configuration:', {
//   serviceName: 'ai-agent-local',
//   otlpEndpoint,
//   runtime: process.env.NEXT_RUNTIME,
// });
