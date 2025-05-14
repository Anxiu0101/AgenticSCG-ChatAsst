import { auth } from '@/app/(auth)/auth';
import { insertChunks } from '@/lib/db/queries';
import { getPdfContentFromUrl } from '@/lib/pdf';
import { openai } from '@ai-sdk/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { put } from '@vercel/blob';
import { embedMany } from 'ai';

// https://vercel.com/docs/vercel-blob/using-blob-sdk
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  const session = await auth();

  if (!session) {
    return Response.redirect('/login');
  }

  const { user } = session;

  if (!user) {
    return Response.redirect('/login');
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  // Now user cannot upload same name file to server.
  // TODO: solve file name conflict.
  const { downloadUrl } = await put(`${user.email}/${filename}`, request.body, {
    access: 'public',
    addRandomSuffix: false,
  });

  const content = await getPdfContentFromUrl(downloadUrl);
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
  });
  const chunkedContent = await textSplitter.createDocuments([content]);

  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: chunkedContent.map((chunk) => chunk.pageContent),
  });

  await insertChunks({
    chunks: chunkedContent.map((chunk, i) => ({
      id: `${user.email}/${filename}/${i}`,
      filePath: `${user.email}/${filename}`,
      content: chunk.pageContent,
      embedding: embeddings[i],
    })),
  });

  return Response.json({});
}
