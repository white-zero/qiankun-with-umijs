import React, { useState, useEffect, useImperativeHandle } from 'react';
import styles from './index.less';
import BaseSearch from './search';
import { getRender } from './RenderParams';
import {Card} from 'antd';
import SearchTable from './table';
import { ColumnProps } from 'antd/lib/table';
import ColumnSelection from './ColumnSelection';
import _ from 'lodash';

interface Props  {
  wrappedComponentRef?: any;
  total?: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  defaultValue?: any,
  paginations?: boolean;
  newSearchField?: string;
  searchFieldsList?:any;
  hideSearch?:any;
  noSearchBorder?:any;
  noTableBorder?:any;
  needColumnsSelection?:boolean;
  columns?:any;
}
const storageName = 'searchParams';
const getParamsStorage = () => {
  const storage = sessionStorage.getItem(storageName);
  const storageParams = storage ? JSON.parse(storage) : ({} as any);
  return storageParams;
};
const setParamsStorage = (searchParams: any) => {
  sessionStorage.setItem(storageName, JSON.stringify(searchParams));
};
const clearParamsStorage = () => {
  sessionStorage.removeItem(storageName);
};
const BaseFormSearch =(props,ref) => {
  const [loading, setLoading] = useState(false);
  const [querys, setQuerys] = useState<any>({});
  const [total, setTotal] = useState(0);
  const [dataList, setDataList] = useState([] as any[]);
  const [activeColumns, setActiveColumns] = useState([] as ColumnProps<any>[]);


  const handleSearch = async (values: any) => {
    setLoading(true);
    const params = getRender(values, props.searchParamsRender);
    setQuerys(params);
    if (props.dataSourceFunc) {
      console.log(params,'paramstest')
      const res = await props.dataSourceFunc(params);
      const { data, success } = res;
      if (success && data && data instanceof Array) {
        setTotal(res.total || 0);
        setDataList(data);
        props.form.setFieldsValue(values);
      }
    }
    setLoading(false);
  };

  const setStorage = (searchParams: any) => {
    console.log(searchParams, 'setStorage')
    if (props.needCache) {
      setParamsStorage(searchParams);
    }
  };
  const clearStorage = () => {
    if (props.needCache) {
      clearParamsStorage();
    }
  };
  const getStorage = () => {
    if (props.needCache) {
      return getParamsStorage();
    }
    return {};
  };
  const baseProps = {
    ...props,
    loading,
    handleSearch,
    storageProps: {
      setStorage,
      clearStorage,
      getStorage
    },
  }
  const searchDom = <BaseSearch {...baseProps} />;
  const getExtends = () => {
    if (props.extendBetween) {
      if (typeof props.extendBetween === 'function') {
        const values = props.form.getFieldsValue();
        console.log(values,'values');
        const params = getRender(values, props.searchParamsRender);
        return (
          <div style={{ width: '100%' }}>{props.extendBetween(params)}</div>
        );
      }
      return <div style={{ width: '100%' }}>{props.extendBetween}</div>;
    }
    return '';
  };
  const tableDom = (
    <div style={{ clear: 'both' }}>
      <div style={{ marginBottom: 16 }} className={styles.extendsItem}>
        {getExtends()}
        {props.needColumnsSelection && (
          <ColumnSelection
            columns={props.columns || []}
            setSelectColKeys={keys => {
              const cols = _.cloneDeep(props.columns);
              if (cols) {
                if (props.columnsSelection && props.columnsSelection.treeSelectColumns) {
                  const columns: any[] = [];
                  cols.map(item => {
                    const col = _.cloneDeep(item);
                    if (item.children) {
                      col.children = [];
                      item.children.map((i) => {
                        if (keys.indexOf(i.dataIndex!) > -1) {
                          col.children.push(i);
                        }
                      })
                    }
                    if (col.children && col.children.length) {
                      columns.push(col);
                    }
                  });
                  setActiveColumns(columns);
                } else {
                  const columns = cols.filter(item => {
                    return keys.indexOf(item.dataIndex!) > -1;
                  });
                  setActiveColumns(columns);
                }
              }
            }}
            {...props.columnsSelection}
          />
        )}
      </div>
      <SearchTable
        dataSource={dataList}
        {...baseProps}
        columns={activeColumns}
      />
    </div>
  )
  useImperativeHandle(ref,()=>({
    testFun:()=>{
      console.log('子组件的方法');
    }
  }),[])
  useEffect(() => {
    if (_.isBoolean(props.loading)) {
      setLoading(props.loading);
    }
  }, [props.loading]);
  return (
    <div className={styles.tableSearchWrapper}>
      {props.hideSearch ? (
        <div style={{ display: 'none' }}>{searchDom}</div>
      ) : props.noSearchBorder ? (
        <Card
          bordered={false}
          bodyStyle={{ padding: '12px 16px 2px' }}
          style={{ marginBottom: 16 }}
        >
          {searchDom}
        </Card>
      ) : (
            searchDom
          )}
      {!props.noTableBorder ? (
        <Card bordered={false} bodyStyle={{ padding: 16 }}>
          {tableDom}
        </Card>
      ) : (
          tableDom
        )}
    </div>
  );
};
export interface IFormSearchRef {
  querys: any;
  reload: () => void;
  total: number;
  // form: WrappedFormUtils;
}
const FormSearch = React.forwardRef< IFormSearchRef,Props>(BaseFormSearch)
export default FormSearch;
