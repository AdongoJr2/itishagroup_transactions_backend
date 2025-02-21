import jwt from 'jsonwebtoken';
import * as express from "express";
import { TokenUserData } from '../core/types/token-user-data';
import { APIResponseBodyDTO } from '../core/types/api-response-body.dto';
import { APIResponseBodyStatus } from '../core/types/api-response-body-status';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string


export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
) {
    if (securityName === "jwt") {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const respBody: APIResponseBodyDTO = {
                status: APIResponseBodyStatus.ERROR,
                message: 'Bearer token is missing'
            }
            return Promise.reject(respBody);
        }

        const token = authHeader && authHeader?.split(' ')?.[1]?.trim();

        try {
            const tokenUserData = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenUserData
            return Promise.resolve(tokenUserData);
        } catch (error) {
            const respBody: APIResponseBodyDTO = {
                status: APIResponseBodyStatus.ERROR,
                message: 'Token is invalid or has expired'
            }
            return Promise.reject(respBody);
        }
    }
}
