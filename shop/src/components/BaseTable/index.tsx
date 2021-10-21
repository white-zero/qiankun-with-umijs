import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';
import { Table } from 'antd';
import './index.less';
import _ from 'lodash';
import { TableProps, ColumnProps } from 'antd/es/table';
import { oc } from 'ts-optchain';

export interface BaseTableProps extends TableProps<any> {
  height?: number;
  noNo?: boolean;
  autoHeight?: boolean;
  cutAutoHeight?: number;
  dataSource?: any;
}
const bottomHeight = 30;
const paginationHeight = 35;
const BaseTable: React.FC<BaseTableProps> = (props, ref) => {
  const TableDom = useRef<HTMLDivElement>(null);
  const tableDomCount = useRef<number>(0);
  const [autoY, setAutoY] = useState(200);
  const [tableHead, setTableHead] = useState(0);

  const columns: ColumnProps<any>[] = _.cloneDeep(props.columns) || [];
  
  const initColumns = (list) => {
    list.forEach((item, index) => {
      if (!item.align) {
        item.align = 'center';
      }
      if (!item.render) {
        item.render = val =>
          val !== null && val !== undefined && val !== '' ? val : '-';
      }
      if (!item.width) {
        item.width = 100;
      }
      if (item.children) {
        initColumns(item.children);
      }
    })
  };
  initColumns(columns);
  // columns.forEach((item, index) => {
  //   if (!item.align) {
  //     item.align = 'center';
  //   }
  //   if (!item.render) {
  //     item.render = val =>
  //       val !== null && val !== undefined && val !== '' ? val : '-';
  //   }
  //   if (!item.width) {
  //     item.width = 100;
  //   }
  // });

  const x = columns.length
    ? columns
      .map(item => {
        if (item.children) {
          return item.children.map(i => (item.width ? +item.width : 100)).reduce((a, b) => a + b);
        }
        return (item.width ? +item.width : 100)
      })
      .reduce((a, b) => a + b)
    : undefined;
  const autoHeight = props.autoHeight;
  const onresize = () => {
    if (autoHeight && TableDom.current) {
      let tablePos = TableDom.current.getBoundingClientRect();
      const tableHead =
        TableDom.current.querySelector('.ant-table-thead')!.clientHeight || 0;
      let autoHeightY =
        document.body.clientHeight -
        tablePos.top -
        tableHead -
        (paginationHeight + bottomHeight) -
        16 - //去掉滚动条
        (props.cutAutoHeight || 0);
      autoHeightY = autoHeightY < 200 ? 200 : autoHeightY;
      setAutoY(autoHeightY);
      setTableHead(tableHead);
    }
  };
  useEffect(() => {
    window.onresize = onresize;
  }, []);
  useImperativeHandle(ref, () => ({
    onresize
  }));
  useEffect(() => {
    if (oc(props).dataSource([]).length === 0) return;
    // console.groupCollapsed(
    //   '%c%s',
    //   'padding: 6px; background: red; color: white; border-radius: 4px;',
    //   'TableDataSource'
    // );
    // console.table(props.dataSource, [
    //   ...(typeof props.rowKey === 'string' ? [props.rowKey] : []),
    //   ...oc(props)
    //     .columns([])
    //     .map(c => c.dataIndex)
    // ]);
    console.groupEnd();
  }, [props.columns, props.dataSource]);
  return (
    <div
      ref={dom => {
        // const oldDom = TableDom.current;
        TableDom.current = dom;
        if (dom && tableDomCount.current === 0) {
          tableDomCount.current = tableDomCount.current + 1;
          setTimeout(() => {
            onresize();
          }, 10);
        }
      }}
      style={autoHeight ? { height: autoY + tableHead + paginationHeight } : {}}
    >
      <Table
        bordered={true}
        size="small"
        scroll={{ x, y: autoHeight ? autoY : props.height }}
        {...props}
        columns={
          (document.body.clientWidth > 1200 && columns.length < 12) ||
            columns.length < 6
            ? columns.map(i => {
              i.fixed = void 0;
              return i;
            })
            : columns
        }
      />
    </div>
  );
};
export interface IBaseTableRef {
  onresize: () => void;
}
export default forwardRef<IBaseTableRef, BaseTableProps>(BaseTable);
