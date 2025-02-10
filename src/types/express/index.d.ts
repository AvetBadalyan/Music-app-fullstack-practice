declare module 'express' {
  interface Request {
    validatedData?: Record<string, any>;
  }
}
