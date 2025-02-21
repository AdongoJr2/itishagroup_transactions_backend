import { IsDefined, IsOptional } from 'class-validator';

import { APIResponseBodyStatus } from './api-response-body-status';

export class APIListResponseBodyDataDTO<T> {
  @IsDefined({
    message: '$property is required',
  })
  count: number;

  @IsDefined({
    message: '$property is required',
  })
  pages: number;

  @IsDefined({
    message: '$property is required',
  })
  list: T[];
}

export class APIListResponseBodyDTO<T> {
  @IsDefined({
    message: '$property is required',
  })
  status: APIResponseBodyStatus;

  @IsDefined({
    message: '$property is required',
  })
  message: string;

  @IsDefined({
    message: '$property is required',
  })
  data: APIListResponseBodyDataDTO<T>;
}

export class APIListResponseBodyOptionsDTO<T> {
  @IsOptional()
  message?: string;

  @IsDefined({
    message: '$property is required',
  })
  count: number;

  @IsDefined({
    message: '$property is required',
  })
  pageSize: number;

  @IsDefined({
    message: '$property is required',
  })
  records: T[];
}
