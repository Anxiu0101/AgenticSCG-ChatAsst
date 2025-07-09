/*instrumentation.ts*/
export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('@/instrumentation.node');
    }
  } catch (error) {
    console.error('Failed to initialize monitoring', error);
  }
}
