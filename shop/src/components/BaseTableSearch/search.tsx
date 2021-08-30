import React, { useState, useEffect, useImperativeHandle } from 'react';
import styles from './index.less';
import _ from 'lodash';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
} from 'antd';
interface Props {
  showAdvance?: boolean;
  setShowAdvance?: Function;
  newSearchField?: string;
  advancedSearchProps?: any
}

const BaseSearch: React.FC<Props> = (props) => {
  const submit = () => {
    console.log(11);
  }
  const colspan = {
    xs: 24,
    sm: 12,
    lg: 8,
    xxl: 6
  };
  const { showAdvance, advancedSearchProps = {}, } = props;
  const { foldNum, show, btnText } = advancedSearchProps;
  const searchFieldsList = _.isFunction(props.searchFieldsList)
      ? props.searchFieldsList(props.form)
      : props.searchFieldsList;
  return (
    <Form onFinish={submit} className={styles.formSty}>
      <Row gutter={32}>
        {!show || showAdvance
          ? searchFieldsList.map(getColSearchLists)
          : searchFieldsList.slice(0, foldNum).map(getColSearchLists)}
        <Col
          {...colspan}
          className={styles.colstyle}
          style={{
            float: 'right',
            textAlign: 'right',
            minWidth: 230
          }}
        >
          {show && (
            <a
              className={styles.advanceCtrlBtn}
              onClick={() => {
                this.props.setShowAdvance(!showAdvance);
              }}
              style={{ marginRight: 8 }}
            >
              {showAdvance ? '收起' : btnText || '更多'}
                &nbsp;
              <Icon type={showAdvance ? 'up' : 'down'} />
            </a>
          )}
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            htmlType="submit"
            loading={loading}
          >
            {newSearchField ? newSearchField : '查询'}
          </Button>
          <Button type="default" onClick={this.reset} loading={loading}>
            重置
            </Button>
          {needExport && (
            <Button
              type="primary"
              onClick={this.export}
              loading={exportLoading}
            >
              导出
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};
export default BaseSearch;
