import React, { useState, useEffect, useImperativeHandle } from 'react';
import styles from './index.less';
import BaseSearch from './search';
import {Card} from 'antd';
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
}

const BaseFormSearch =(props,ref) => {
  console.log(props.searchFieldsList,'props???:::');

  const baseProps = {
    ...props,
  }
  console.log(props,'props???:::');
  
  const searchDom = <BaseSearch {...baseProps} />;
  // const searchDom = <>111</>;
  const tableDom = (<>222</>)
  useImperativeHandle(ref,()=>({
    testFun:()=>{
      console.log('子组件的方法');
    }
  }),[])
  return (
    <div className={styles.tableSearchWrapper}>
      {props.hideSearch ? (
        <div style={{ display: 'none' }}>{searchDom}</div>
      ) : !props.noSearchBorder ? (
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
