import { Request, Response, NextFunction } from 'express';
import { APIResponseBodyStatus } from '../core/types/api-response-body-status';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = err?.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: APIResponseBodyStatus.ERROR,
        message: message,
    });
}