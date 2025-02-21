import { inject, injectable } from "inversify";
import { RefreshTokenService } from "../services/refresh-token.service";
import { Controller, Route } from "tsoa";

@Route('refresh-tokens')
@injectable()
export class RefreshTokenController extends Controller {
    constructor(
        @inject(RefreshTokenService)
        private userService: RefreshTokenService
    ) {
        super();
    }
}

export default RefreshTokenController