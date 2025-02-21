import { Controller, Get, Middlewares, Route, Tags } from 'tsoa';
import { HomeResponseDto } from '../dto/home-response.dto';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import logger from '../../../utils/logger/logger';

async function sampleCustomMiddleware(req: Request, res: Response, next: NextFunction) {
    logger.info("Custom middleware...")
    next();
}

@Tags("Home API")
@Route()
@injectable()
export class HomeController extends Controller {
    /**
     * Welcome Home V1 endpoint 
     */
    // @Example<HomeResponseDto>({
    //     message: "V1 Welcome message"
    // })
    @Get()
    @Middlewares(sampleCustomMiddleware)
    public async getHomeMessage(): Promise<HomeResponseDto> {
        return { message: "Welcome to V1 API endpoints" };
    }
}

export default HomeController