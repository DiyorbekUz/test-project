import { errors } from '../../utils/error.util';

export class ErrorWithStatusCode extends Error {
    statusCode: number;
    error_name: string;

    constructor(message: string, statusCode: number, error_name?: string) {
        super(message);
        this.statusCode = statusCode;
        this.error_name = error_name || 'UNKNOWN_ERROR_NAME';;
    }
}

export class NotFound extends ErrorWithStatusCode {
    constructor(name: string, error_name?: string) {
        const message: string = `${name} ${errors.notFound}`;
        const statusCode: number = 404;
        super(message, statusCode, error_name)
    }
}

export class Forbidden extends ErrorWithStatusCode {
    constructor() {
        const message: string = errors.forbidden;
        const statusCode: number = 403;
        super(message, statusCode, "FORBIDDEN")
    }
}

export class Unauthorized extends ErrorWithStatusCode {
    constructor() {
        const message: string = errors.unauthorized;
        const statusCode: number = 401;
        super(message, statusCode, "UNAUTHORIZED")
    }
}

export class BadRequest extends ErrorWithStatusCode {
    constructor(name: string, error_name?: string) {
        const message: string = `${errors.badRequest}: ${name}`;
        const statusCode: number = 400;
        super(message, statusCode, error_name);
    }
}