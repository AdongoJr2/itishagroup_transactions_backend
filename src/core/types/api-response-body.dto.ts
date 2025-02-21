import { IsDefined, IsOptional } from 'class-validator';

import { APIResponseBodyStatus } from './api-response-body-status';

export class APIResponseBodyDTO {
  @IsDefined({
    message: '$property is required',
  })
  status: APIResponseBodyStatus;

  @IsDefined({
    message: '$property is required',
  })
  message: string;

  @IsOptional()
  data?: any;
}
