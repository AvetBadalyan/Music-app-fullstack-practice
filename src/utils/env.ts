/**
 * Read a required environment variable, throwing a descriptive error if it
 * is missing or empty. Use at startup-time configuration sites so a missing
 * variable fails the process boot with a clear message instead of producing
 * a confusing runtime error later.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
