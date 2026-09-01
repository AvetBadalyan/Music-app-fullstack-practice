import type { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';

/**
 * Connection caching for a serverless runtime.
 *
 * On Vercel each request may hit a fresh function instance, and re-running
 * `initialize()` per invocation exhausts Postgres' connection limit fast. A
 * warm instance keeps this module in memory between requests, so caching the
 * promise here means we connect once per instance rather than once per
 * request - and requests arriving while the connection is still opening await
 * that same promise instead of opening a second one.
 */
let connectionPromise: Promise<DataSource> | undefined;

export const connectToDatabase = async (): Promise<void> => {
  if (!connectionPromise) {
    connectionPromise = AppDataSource.initialize();

    // A failed attempt must not stay cached, or every later request reuses the
    // rejected promise and the instance can never recover.
    connectionPromise.catch(() => {
      connectionPromise = undefined;
    });
  }

  await connectionPromise;
};
