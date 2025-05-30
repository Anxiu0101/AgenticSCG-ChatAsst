import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityReport {
  reportId: string;
  vulnCount: number;
  message: string;
}

interface SecurityReportCardProps {
  report: SecurityReport;
}

export function SecurityReportCard({
  report,
}: SecurityReportCardProps) {
  // Pick badge colour based on vuln count
  const badgeClasses =
    report.vulnCount === 0
      ? 'bg-green-100 text-green-800'
      : report.vulnCount < 5
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="flex flex-row items-center gap-2">
          <ShieldAlert className="size-5 shrink-0" />
          <CardTitle className="text-xl font-semibold">
            Security Report
          </CardTitle>
          <Badge className={`ml-auto px-2 py-0.5 text-sm ${badgeClasses}`}>
            Vulnerabilities
          </Badge>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground leading-snug">
            {report.vulnCount} detected in this document.
          </p>
          <p className="text-xs text-gray-500">Report ID: {report.reportId}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
