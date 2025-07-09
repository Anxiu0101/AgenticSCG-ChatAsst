export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      // const { registerOTel } = await import('@vercel/otel');
      // const { OTLPTraceExporter } = await import(
      //   '@opentelemetry/exporter-trace-otlp-http'
      // );
      // const otlpEndpoint =
      //   process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
      //   'http://localhost:4318/v1/traces';
      //
      // try {
      //   registerOTel({
      //     serviceName: 'ai-agent-local',
      //     traceExporter: new OTLPTraceExporter({
      //       url: otlpEndpoint,
      //     }),
      //   });
      // } catch (error) {
      //   console.error('Failed to register Telemetry', error);
      // }
      //
      await import('@/instrumentation.node')
    }
  } catch (error) {
    console.error('Failed to initialize monitoring', error);
  }
}
