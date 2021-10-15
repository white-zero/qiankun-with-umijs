import React from 'react';
import _ from 'lodash';

interface Props {
  selectedRowKeys: any[];
  clearSelect: Function;
}
const RowSelectTip: React.FC<Props> = props => {
  const { selectedRowKeys } = props;
  if (!_.isArray(selectedRowKeys)) {
    return null;
  }
  return selectedRowKeys.length ? (
    <span>
      已选中
      <span style={{ color: '#1890ff', margin: '0 3px' }}>
        {selectedRowKeys.length}
      </span>
      条&#x3000;
      <a
        onClick={() => {
          props.clearSelect();
        }}
      >
        取消全部
      </a>
    </span>
  ) : null;
};
export default RowSelectTip;
