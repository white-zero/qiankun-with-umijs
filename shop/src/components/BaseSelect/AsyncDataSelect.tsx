import React, { useEffect, useState, CSSProperties, useRef } from 'react';
import { OptionProps, SelectProps } from 'antd/es/select';
import { AxiosResponse } from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import {
  Empty,
  Select,
  Tooltip,
  Divider
} from 'antd';
import { httpGet } from '@/utils/RequestUtil/request';

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
interface Item extends OptionProps {
  value: string | number;
  label: string;
}

interface Adaptor {
  (response: BaseResponse): Item[];
}
interface Props extends SelectProps<any> {
  dataSourceApi: string;
  responseAdaptor?: Adaptor;
  requestInit?: RequestInit;
  hideSyncBtn?: boolean;
  ref?: any;
  extraContext?: React.ReactNode;
  wrapperStyle?: CSSProperties;
}

const AsyncDataSelect: React.FC<Props> = React.forwardRef<any, Props>(
  (props, ref) => {
    const popupContainerRef = useRef<HTMLDivElement>(null);
    const [dataSource, setDataSource] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const responseAdaptor = (response: BaseResponse) => {
      if (!response.success || !response.data) {
        return [];
      }
      const { success, data } = response;
      if (success) {
        const dataSourceAdaptor = props.responseAdaptor
          ? props.responseAdaptor(response)
          : response.data;
        return dataSourceAdaptor;
      }
      return [];
    };
    useEffect(() => {
      /** 如果后端返回的value值是number类型,而选项的值是字符串类型,需要特殊处理一下 */
      if (
        typeof props.value == 'number' &&
        dataSource.find(item => typeof item.value != 'number')
      ) {
        setDataSource(
          dataSource.map(item => {
            return {
              ...item,
              /** 如果(+value) 不是number类型,就不能做处理 */
              value: typeof +item.value == 'number' ? +item.value : item.value
            };
          })
        );
      }
    }, [dataSource, props.value]);
    const loadData = async () => {
      if (props.dataSourceApi) {
        setLoading(true);
        const response = await httpGet(props.dataSourceApi, props.requestInit);
        const { success, data } = response;
        setLoading(false);
        if (success && data) {
          const dataSource1 = responseAdaptor(response);
          setDataSource(Array.isArray(dataSource1) ? dataSource1 : []);
        }
      }
    };
    useEffect(() => {
      if (props.dataSourceApi) {
        loadData();
      } else {
        setDataSource([]);
      }
    }, [props.dataSourceApi]);
    const reloadData = () => {
      loadData();
    };
    return (
      <div style={{ display: 'inline-block', width: '100%' }}>
        <div
          ref={popupContainerRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            minHeight: 40,
            position: 'relative',
            ...props.wrapperStyle
          }}
        >
          <Select
            ref={props.ref || ref}
            allowClear={true}
            loading={loading}
            placeholder={'请选择'}
            showSearch={true}
            optionFilterProp="children"
            style={{ width: '100%' }}
            dropdownMatchSelectWidth={false}
            notFoundContent={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <a onClick={reloadData} style={{ cursor: 'pointer' }}>
                    {/* <Icon type={'reload'} /> */}
                    &nbsp;重新加载
                  </a>
                }
              />
            }
            dropdownRender={menu => {
              return (
                <div>
                  {menu}
                  {props.extraContext && (
                    <>
                      <Divider style={{ margin: '4px 0' }} />
                      {props.extraContext}
                    </>
                  )}
                </div>
              );
            }}
            getPopupContainer={() =>
              popupContainerRef.current as HTMLDivElement
            }
            {...props}
          >
            {dataSource.map(e => (
              <Select.Option key={e.value} value={e.label} {...e}>
                {e.label}
              </Select.Option>
            ))}
          </Select>
          {!props.hideSyncBtn && (
            <div
              style={{
                height: '100%',
                width: 30,
                textAlign: 'center'
              }}
            >
              <Tooltip title={'同步数据源'}>
                <SyncOutlined onClick={reloadData} spin={loading} style={{ cursor: 'pointer', paddingLeft: 10 }}/>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default AsyncDataSelect;
