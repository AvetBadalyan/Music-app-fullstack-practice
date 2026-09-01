/**
 * Vercel serverless entry point.
 *
 * Vercel treats every file under `api/` as a function and invokes the default
 * export with (req, res) - an Express app is already that shape, so the whole
 * API runs as a single function with `vercel.json` rewriting all paths here.
 *
 * The app deliberately does not call `listen()`; the platform owns the socket.
 */
import type { IncomingMessage, ServerResponse } from 'http';

// TEMPORARY DIAGNOSTIC - remove once the deployment is confirmed healthy.
// A throw while loading the app produces an opaque FUNCTION_INVOCATION_FAILED
// with no detail in the response or the request log; capturing it here reports
// the real cause instead. `require` rather than `import` so the failure is
// catchable.
type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let app: Handler | undefined;
let bootError: NodeJS.ErrnoException | undefined;

try {
  app = (require('../src/app') as { default: Handler }).default;
} catch (error) {
  bootError = error as NodeJS.ErrnoException;
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (bootError) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(
      JSON.stringify(
        {
          bootError: bootError.message,
          code: bootError.code,
          stack: String(bootError.stack || '').split('\n').slice(0, 10),
        },
        null,
        2,
      ),
    );
    return;
  }

  (app as Handler)(req, res);
}
