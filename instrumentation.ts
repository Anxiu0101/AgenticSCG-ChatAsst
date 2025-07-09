export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerOTel } = await import('@vercel/otel');
    const { OTLPTraceExporter } = await import(
      '@opentelemetry/exporter-trace-otlp-http'
    );

    registerOTel({
      serviceName: 'ai-agent-local',
      traceExporter: new OTLPTraceExporter({
        url:
          process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
          'http://localhost:4318/v1/traces',
      }),
    });
  }

  // if (process.env.NEXT_RUNTIME === 'edge') {
  //     const { registerOTel } = await import('@vercel/otel');
  //     const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
  //
  //     registerOTel({
  //         serviceName: "ai-agent-local",
  //         traceExporter: new OTLPTraceExporter({
  //             url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  //                 ?? "http://localhost:4318/v1/traces",
  //         }),
  //     });
  // }
}
