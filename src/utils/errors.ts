export class CustomError extends Error {
  statusCode: number;

  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string) {
    super('DatabaseError', message, 500);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super('ValidationError', message, 400);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super('NotFoundError', message, 404);
  }
}
