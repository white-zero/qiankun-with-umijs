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
}

const BaseFormSearch = (props: { hideSearch?: any; noSearchBorder?: any; noTableBorder?: any; }, ref: any) => {
  const baseProps = {}
  // const searchDom = <BaseSearch {...baseProps} />;
  const searchDom = <>111</>;
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
const FormSearch = React.forwardRef(BaseFormSearch)
export default FormSearch;
