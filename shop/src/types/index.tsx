import { AxiosResponse } from 'axios';

export namespace Basic {
  export interface BaseProps<T = any> {
    form?: any;
    location?: Location & { query: any };
    activated?: Function;
    deactivated?: Function;
    [propsName: string]: any;
  }
  export interface BaseResponse<T = any> extends AxiosResponse<T> {
    total?: number;
    success?: boolean;
    headers: {
      'X-Total-Count'?: number;
      'x-total-count'?: number;
      totalCount?: number;
      [propName: string]: any;
    };
  }
}
export enum ViewType {
  look = 'look',
  add = 'add',
  edit = 'edit'
}
export type ViewTypeProps = 'add' | 'look' | 'edit';
