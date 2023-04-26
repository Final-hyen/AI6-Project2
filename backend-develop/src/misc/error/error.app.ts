export class AppError extends Error {
  name: string;
  httpCode: number;
  description: string;

  constructor(name: string, httpCode: number, description: string) {
    super(description);

    this.name = name;
    this.httpCode = httpCode;
    this.description = description;

    Error.captureStackTrace(this);
  }
}
