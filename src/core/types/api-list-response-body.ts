import { APIResponseBody } from './api-response-body';
import { APIResponseBodyStatus } from './api-response-body-status';

export interface APIListResponseBody<T> extends APIResponseBody {
  status: APIResponseBodyStatus.SUCCESS;
  data: APIListResponseBodyData<T>;
}

export interface APIListResponseBodyData<T> {
  count: number;
  pages: number;
  list: T[];
}

export interface APIListResponseBodyOptions<T> {
  message?: string;
  count: number;
  pageSize: number;
  records: T[];
}
