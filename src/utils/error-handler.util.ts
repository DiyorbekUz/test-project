import { Response } from 'express';
import { ErrorWithStatusCode, Unauthorized } from '../common/exception/error.exception';
import { JsonWebTokenError } from 'jsonwebtoken';

export function handleErrorResponse(res: Response, error: Error | ErrorWithStatusCode | JsonWebTokenError): void {
    if (error instanceof ErrorWithStatusCode) {
        console.error({
            statusCode: error.statusCode,
            message: error.message,
            error_name: error.error_name,
        });

        res.status(error.statusCode).json({
            ok: false,
            message: error.message,
            error_name: error.error_name || 'INTERNAL_SERVER_ERROR',
        });
    } else if (error instanceof JsonWebTokenError) {
        console.error({
            statusCode: 401,
            message: error.message,
            error_name: "UNAUTHORIZED",
        });
        if (error.message == "jwt expired") {
            let err = new Unauthorized();
            res.status(err.statusCode).json({ ok: false, message: err.message, error_name: err.error_name });
        } else if(error.message == "jwt malformed") {
            let err = new Unauthorized();
            res.status(err.statusCode).json({ ok: false, message: err.message, error_name: err.error_name });
        }else if(error.message == "invalid signature") {
            let err = new Unauthorized();
            res.status(err.statusCode).json({ ok: false, message: err.message, error_name: err.error_name });
        }else {
            let err = new Unauthorized();
            res.status(err.statusCode).json({ ok: false, message: err?.message || "Internal server error", error_name: err?.error_name || "INTERNAL_SERVER_ERROR" });
        }
    } else {
        res.status(500).json({
            ok: false,
            message: error?.message || 'Internal server error',
            error_name: 'INTERNAL_SERVER_ERROR',
        });
    }
}
