import { z } from 'zod';
import { tool, type DataStreamWriter } from 'ai';
import {
  getDocumentById,
  saveSecurityReport
} from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';
import type { Session } from 'next-auth';

// import path from 'node:path';
// import fs from 'node:fs';
// import { execSync } from 'node:child_process';

// // Secure Report Output Directory
// const OUTPUT_DIR = path.join(process.cwd(), '.sec-report');
// // Secure Analysis Tool Binary File Directory
// const SATBIN_DIR = path.join(process.cwd(), 'bin', 'bandit.exe');
// Read Scanner server api address from .env,
// Otherwise using the default value.
const SCANNER_API_URL =
    process.env.SECURE_SCAN_API_URL ??
    'http://localhost:8000/api/v1/secure-scan/python';

interface AuditCodeSecurityProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const auditCodeSecurity = ({
  session,
  dataStream,
}: AuditCodeSecurityProps) =>
  tool({
    description: 'Audit a code document for security vulnerabilities.',
    parameters: z.object({
      documentId: z
        .string()
        .describe('The ID of the code document waiting for being audited'),
    }),
    execute: async ({ documentId }) => {
      const document = await getDocumentById({ id: documentId });

      if (!document || !document.content) {
        return {
          error: 'Document not found',
        };
      }

      // Authority and Visibility
      if (!(document.userId === session.user?.id)) {
        return {
          error: 'Document not allowed to access.',
        };
      }

      // // Write document content to a temporary file
      // const tempFilePath = path.join(OUTPUT_DIR, documentId, 'main.py');
      //
      // try {
      //   await fs.promises.mkdir(path.join(OUTPUT_DIR, documentId), {
      //     recursive: true,
      //   });
      //
      //   fs.writeFileSync(tempFilePath, document.content, 'utf8');
      //   console.log(
      //     `[Tool|auditCodeSecurity] Temp file written: ${tempFilePath}`,
      //   );
      // } catch (err) {
      //   console.error('[Tool|auditCodeSecurity] File write error:', err);
      //   return {
      //     error: 'Failed to write temporary file for security scanning.',
      //   };
      // }
      //
      // // fs.writeFileSync(tempFilePath, document.content, "utf8");
      //
      // console.log(`[Tool|EXEC]: ${SATBIN_DIR} -r ${tempFilePath} -f json`);
      //
      // // Execute the security scanner (Bandit) and capture JSON output
      // const scannerOutput = execSync(
      //   `${SATBIN_DIR} -r ${tempFilePath} -f json --exit-zero`,
      //   {
      //     encoding: 'utf-8',
      //   },
      // );

      let reportContent: any;
      try {
        const apiRes = await fetch(SCANNER_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // The body directly passes the code text;
          body: JSON.stringify({ code: document.content }),
        });

        if (!apiRes.ok) {
          console.error('[Tools|auditCodeSecurity] API error', await apiRes.text());
          return { error: 'Security scanner API returned an error.' };
        }
        reportContent = await apiRes.json();
      } catch (err) {
        console.error('[Tools|auditCodeSecurity] API request failed', err);
        return { error: 'Failed to contact security scanner API.' };
      }

      console.log('Bandit Report Content', reportContent);

      // const reportContent = JSON.parse(reportContentStr);

      const totalVuln = reportContent.metrics._totals;
      const high = totalVuln['CONFIDENCE.HIGH'];
      const low = totalVuln['CONFIDENCE.LOW'];
      const medium = totalVuln['CONFIDENCE.MEDIUM'];
      const undef = totalVuln['CONFIDENCE.UNDEFINED'];

      const vulnTotalCount = high + low + medium + undef;

      console.log('vulnTotalCount: ', vulnTotalCount);

      const reportId = generateUUID();
      await saveSecurityReport({
        report: {
          id: reportId,
          createdAt: new Date(),
          documentId: documentId,
          documentCreatedAt: document.createdAt,
          targetLang: 'python',
          scannerTool: 'bandit',
          content: reportContent,
          vulnCount: vulnTotalCount,
          userId: document.userId,
        },
      });

      dataStream.writeData({
        type: 'vulnNum',
        content: vulnTotalCount,
      });

      return {
        reportId: reportId,
        vulnCount: vulnTotalCount,
        message: `Security report have been generated successfully. 
                The code contains ${vulnTotalCount} vulnerabilities totally.`,
      };
    },
  });
