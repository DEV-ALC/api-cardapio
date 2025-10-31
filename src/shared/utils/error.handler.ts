export class AppError extends Error {
    constructor(public message: string, public status: number) {
        super(message);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}
