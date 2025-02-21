import { APIResponseBodyStatus } from './api-response-body-status';

export interface APIResponseBody {
  status: APIResponseBodyStatus;
  message: string;
  data: any;
}
