import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const otlpExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});
