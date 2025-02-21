import { Controller, Example, Get, Middlewares, Route, Tags } from 'tsoa';
import { HomeResponseDto } from '../dto/home-response.dto';
import { NextFunction, Request, Response } from 'express';

async function sampleCUstomMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log("Custom middleware...")
    next();
}

@Tags("Home API")
@Route()
export class HomeController extends Controller {
    /**
     * Welcome Home V1 endpoint 
     */
    // @Example<HomeResponseDto>({
    //     message: "V1 Welcome message"
    // })
    @Get()
    @Middlewares(sampleCUstomMiddleware)
    public async getHomeMessage(): Promise<HomeResponseDto> {
        return { message: "Welcome to V1 API endpoints" };
    }
}