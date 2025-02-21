import { injectable } from "inversify";
import { APIListResponseBody, APIListResponseBodyOptions } from "../../../core/types/api-list-response-body";
import { APIResponseBodyStatus } from "../../../core/types/api-response-body-status";
import { generateListResponseBodyData } from "../../../utils/response/response-body";

@injectable()
export class ApiListResponseService {
  public getResponseBody<T>({
    message,
    count,
    pageSize,
    records,
  }: APIListResponseBodyOptions<T>) {
    const resBody: APIListResponseBody<T> = {
      status: APIResponseBodyStatus.SUCCESS,
      message: message || 'records retrieved successfully',
      data: generateListResponseBodyData(count, pageSize, records),
    };

    return resBody;
  }
}
