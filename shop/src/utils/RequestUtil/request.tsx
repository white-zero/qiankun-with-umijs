import axios, { AxiosRequestConfig } from 'axios';
import { message, Modal } from 'antd';
import { Basic } from '@/types';
import { getToken, getRefreshToken, setToken } from '@/utils/TokenUtil';
import { oc } from 'ts-optchain';
import { AxiosResponse } from 'axios';

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

let outloginFlag = false;
axios.interceptors.request.use(
  req => {
    // req.headers.tenant_code = '1000';

    // req.headers.tenant_code = '1000';
    // req.headers.tenant_code = 'default';
    try {
      const token = getAuthorization();
      const Refresh = getRefreshToken();
      // if (req.url!.includes('financing/api')) {
      //   return req;
      // }
      if (!req.headers) {
        if (token) {
          req.headers = { Refresh, Authorization: getAuthorization() };
        }
      } else {
        if (token) {
          req.headers.Authorization = getAuthorization();
        }
        if (Refresh) {
          req.headers.Refresh = Refresh;
        }
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return req;
  },
  error => {
    return Promise.resolve(error);
  }
);
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (axios.isCancel(error)) {
      const response = {
        config: {} as Basic.BaseResponse,
        headers: {},
        status: -999,
        statusText: '中断请求',
        data: undefined
      };
      return Promise.resolve(response);
    }
    return Promise.resolve(error.response);
  }
);
function parseJSON(response: BaseResponse) {
  if (response.headers['x-total-count']) {
    response.headers.totalCount = response.headers['x-total-count'];
    response.total = +oc(response).headers['x-total-count'](0);
  }
  if (response.status >= 200 && response.status < 300) {
    response.success = true;
  } else {
    response.success = false;
  }
  if (response.headers['Access-token']) {
    setToken(
      response.headers['Access-token'],
      response.headers['Refresh-token']
    );
  }
  return response;
}
const getBackLogin = (response: BaseResponse) => {
  outloginFlag = true;
  // Modal.warning({
  //   // content: response.data.message,
  //   content: '登录超时请重新登录！',
  //   okText: '确认',
  //   onOk: () => {
  //     outloginFlag = false;
  //     store.dispatch.app.logout();
  //   }
  // });
};
function checkStatus(response: BaseResponse) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (
    response.status === 401 &&
    response.request.responseURL.indexOf('/auth/logout') === -1
  ) {
    if (!outloginFlag) {
      getBackLogin(response);
    }
  }
  return {
    config: response.config,
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
    data: response.data
  };
}
export function getHeaders() {
  return { headers: { Authorization: getAuthorization() } };
}
export function getAuthorization() {
  // let idToken = localStorage.getItem('jhi-authenticationToken'); // eslint-disable-line
  let idToken = getToken();
  if (idToken !== undefined && idToken !== 'undefined' && idToken !== null) {
    idToken = idToken.replace('"', '');
    idToken = idToken.replace('"', '');
    return `Bearer ${idToken}`;
  }
  return undefined;
}
export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}
export interface RequestParams {
  method: Method | string;
  url: string;
  payload?: any;
}
export function httpGet<T = any>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig
) {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.GET,
    ...options
  } as any);
}
export function httpPost<T>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig
) {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.POST,
    ...options
  } as any);
}
export function httpPut<T>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig
) {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.PUT,
    ...options
  });
}
export function httpDelete<T>(url: string, data?: any) {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.DELETE
  });
}
export function httpRequest<T>(req: RequestParams): Promise<BaseResponse<T>> {
  return request({
    ...req,
    [req.method === Method.GET ? 'params' : 'data']: req.payload
  } as any).then(errorProcess);
}
export default function request(options: AxiosRequestConfig) {
  return axios(options)
    .then(checkStatus)
    .then(parseJSON);
}
export function errorProcess(response: BaseResponse) {
  const { status, data } = response;
  const tipStatus = [500, 400];
  if (tipStatus.includes(status)) {
    message.error('请确认您的操作或输入是否正确！');
    return response;
  }
  if (response.config.responseType === 'blob') {
    const fr = new FileReader();
    fr.onloadend = () => {
      try {
        const msg = JSON.parse(fr.result as string);
        message.error(msg.message);
      } catch (e) {
        //
      }
    };
    fr.readAsText(data);
    return response;
  }
  if (data && data.message && status === 417) {
    message.error(data.message);
    return response;
  }
  const errorMsg = getErrorMessage(status);
  if (errorMsg) {
    message.error(`错误代码：${status} ，${errorMsg}`);
  }
  return response;
}

export function getErrorMessage(statusCode: number): string | undefined {
  const statusMsgMap = {
    400: 'Bad Request/错误请求!',
    401: 'Unauthorized/未授权!',
    403: 'Forbidden/禁止!',
    404: 'Not Found/未找到资源!',
    405: 'Method Not Allowed/方法未允许!',
    406: 'Not Acceptable/无法访问!',
    407: 'Proxy Authentication Required/代理服务器认证要求!',
    408: 'Request Timeout/请求超时!',
    409: 'Conflict/冲突!',
    410: 'Gone/已经不存在!',
    417: 'Expectation Failed/请求头信息期望失败!',
    500: 'Internal Server Error/内部服务器错误!！',
    501: 'Not Implemented/未实现!',
    502: 'Bad Gateway/错误的网关!`',
    503: 'Service Unavailable/服务无法获得!',
    504: 'Gateway Timeout/网关超时!',
    505: 'HTTP Version Not Supported/不支持的 HTTP 版本!'
  } as { [propsName: string]: string };
  return statusMsgMap[statusCode];
}
