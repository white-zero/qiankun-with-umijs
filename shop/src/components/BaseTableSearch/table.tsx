import React, { useRef, useEffect, useState } from 'react';
import { SearchTableProps } from './bean';
// import { WrappedFormUtils } from 'antd/lib/form/Form';
// import { PaginationConfig } from 'antd/lib/table';
import BaseTable, { IBaseTableRef } from '../BaseTable';
import { size } from 'lodash';

interface Props extends SearchTableProps.BaseSearchTableProps {
  form: any;
  showAdvance: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
}
const SearchTable: React.FC<Props> = props => {
  const baseFormRef = useRef<IBaseTableRef>(null);
  const [pagesize, setPageSize] = useState(20)
  const onPageChange = (page: number, pageSize?: number) => {
    const searchParams = {
      ...props.form.getFieldsValue(),
      page: page - 1,
      size: pageSize
    };
    if (props.handleSearch) {
      props.handleSearch({
        ...searchParams
      });
    }
    props.form.setFieldsValue({ page: page - 1, size: pageSize });
    setStorage(searchParams);
  };
  const onShowSizeChange = (current: number, size: number) => {
    setPageSize(size)
    onPageChange(current, size)
  }
  const setStorage = (searchParams: any) => {
    if (props.storageProps) {
      props.storageProps.setStorage(searchParams);
    }
  };
  const { paginationProps, } = props;
  // let paginations: PaginationConfig | false;
  let paginations: any | false;
  if (paginationProps) {
    const { total, size, page, } = paginationProps;
    paginations = {
      total,
      showSizeChanger: props.showSizeChanger,
      pageSizeOptions: props.pageSizeOptions,
      current: page + 1,
      showQuickJumper: true,
      pageSize: pagesize,
      showTotal: (t, range) =>
        `共${t}条数据 第${page + 1}页 / 共${Math.ceil(total / pagesize)}页`,
      onChange: onPageChange,
      onShowSizeChange: onShowSizeChange
    };
  } else {
    paginations = false;
  }
  useEffect(() => {
    if (baseFormRef.current) {
      baseFormRef.current.onresize();
    }
  }, [props.showAdvance]);
  return (
    <BaseTable
      ref={baseFormRef}
      pagination={paginations ? { ...paginations, style: { marginBottom: 0, marginTop: 10 } } : paginations}
      // pagination={{ ...paginations, style: { marginBottom: 0, marginTop: 10 } }}
      loading={props.loading}
      {...props}
    />
  );
};
export default SearchTable;
