import { injectable } from 'inversify';
import { APIResponseBodyDTO } from '../../../core/types/api-response-body.dto';

@injectable()
export class ApiResponseService {
  public getResponseBody({
    status,
    message,
    data,
  }: APIResponseBodyDTO): APIResponseBodyDTO {
    const resBody = {
      status,
      message,
      data,
    };

    return resBody;
  }
}
