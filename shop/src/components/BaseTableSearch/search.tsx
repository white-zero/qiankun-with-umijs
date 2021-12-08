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
import { InputProps } from 'antd/lib/input';
import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';
import { RuleEnum } from '@/utils/type'
import { SpinProps } from 'antd/lib/spin';
import { SearchTableProps } from './bean';

interface Props {
  showAdvance?: boolean;
  setShowAdvance?: Function;
  handleSearch: Function;
  newSearchField?: string;
  advancedSearchProps?: any
  searchFieldsList?: any
  form?: any
  storageProps?: any
  loading?: boolean | SpinProps;
}
const { Option } = Select;
const BaseSearch: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const {loading} = props
  const submit = () => {
    // e.preventDefault();
    const values = form.getFieldsValue();
    const searchParams = { ...values, page: 0 };
    console.log(searchParams,'searchParams::');
    props.handleSearch(searchParams);
    form.setFieldsValue({ page: 0 });
    setStorage(searchParams);
  }
  const reset = ()=>{
      clearStorage();
      form.resetFields();
      const values = form.getFieldsValue();
      const { page, size } = values;
      props.handleSearch!({ size, page: 0 });
  }
  const setStorage = (searchParams:any)=>{
    if (props.storageProps) {
      props.storageProps.setStorage(searchParams);
    }
  }
  const clearStorage = () => {
    if (props.storageProps) {
      props.storageProps.clearStorage!();
    }
  };
  const colspan = {
    xs: 24,
    sm: 12,
    lg: 8,
    xxl: 6
  };
  const { showAdvance, advancedSearchProps = {}, } = props;
  const { foldNum, show, btnText } = advancedSearchProps;
  console.log(props.searchFieldsList,'props.searchFieldsList:::?');
  
  const searchFieldsList = _.isFunction(props.searchFieldsList)
    ? props.searchFieldsList(props.form)
    : props.searchFieldsList; 
  const getFormItem = (domConfig: SearchTableProps.DomConfig, ruleType?: number) => {
    const { type, selectLists } = domConfig;
    switch (type) {
      case 'select':
        return (
          <Select
            placeholder="请选择"
            style={{ width: '100%' }}
            allowClear={true}
            {...domConfig.domProps}
          >
            {selectLists &&
              selectLists.map((item, index) => (
                <Option key={index} value={item.value}>
                  {item.name}
                </Option>
              ))}
          </Select>
        );
      default: {
        const inputProps = {} as InputProps;
        switch (ruleType) {
          case RuleEnum.手机号: {
            inputProps.maxLength = 11;
            break;
          }
          case RuleEnum.身份证号: {
            inputProps.maxLength = 18;
            break;
          }
          default:
            break;
        }
        return (
          <Input placeholder="请输入" {...inputProps} {...domConfig.domProps} />
        );
      }
    }
  };

  const getColSearchLists = (item: SearchTableProps.FormItemObj, index: any) => {
    const col = item.colspan || colspan;
    const {
      label,
      modelName,
      dom,
      domConfig = {},
      options,
      ruleType,
      required
    } = item;
    return (
      <Col {...col} key={`${index}`} className={styles.colstyle}>
        <Form.Item label={label} wrapperCol={{ span: 8 }} required={required} name={modelName} initialValue={options && options.initialValue}>
          {dom?dom:getFormItem(domConfig, ruleType)}
        </Form.Item>
      </Col>
    );
  };
  return (
    <Form onFinish={submit} form={form} className={styles.formSty}>
      <Row gutter={32}>
        {console.log(searchFieldsList,'searchFieldsList:::?')}
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
                // props.setShowAdvance(!showAdvance);
              }}
              style={{ marginRight: 8 }}
            >
              {showAdvance ? '收起' : btnText || '更多'}
                &nbsp;
              <StarOutlined type={showAdvance ? 'up' : 'down'} />
            </a>
          )}
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            htmlType="submit"
            loading={loading}
          >
            查询
            </Button>
          <Button type="default" onClick={reset}
            loading={loading}
          >
            重置
            </Button>
          {
            <Button
              type="primary"
              onClick={() => { }}
            // loading={}
            >
              导出
              </Button>
          }
        </Col>
      </Row>
    </Form>
  );
};

export default BaseSearch;

