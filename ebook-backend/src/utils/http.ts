import { Response } from 'express';

export const sendSuccessResponse = (res: Response, data: any, message: string = 'Success') => {
    res.status(200).json({
        status: 'success',
        message,
        data,
    });
};

export const sendErrorResponse = (res: Response, error: any, message: string = 'Error') => {
    res.status(error.status || 500).json({
        status: 'error',
        message,
        error: error.message || 'Internal Server Error',
    });
};