import React, { useRef } from 'react';
import { useRequest, request, Link } from 'umi';
import { Table, Button, Divider, Input } from 'antd';
import { Father } from './father';
import { Son1 } from './sonone';
import { Son2 } from './sontwo';
import { SearchTableProps } from '@/components/BaseTableSearch/bean';
import FormSearch from '@/components/BaseTableSearch'
import { RuleEnum } from '@/utils/type';

export default () => {
  const testRef = useRef<any>()
  const { data = [] } = useRequest(() => request('/api/shop/list'));

  const columns = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'name',
      title: '名称---',
    },
    {
      // dataIndex: 'address',
      dataIndex: '----',
      title: '地址',
      render: () => (
        <Link to={`/test`}>地址</Link>
      )
    },
    {
      dataIndex: 'id',
      title: '操作',
      render: (id: string) => (
        <Link to={`/shopDetail/${id}`}>详情</Link>
      )
    },
  ];
  const searchFieldsList: SearchTableProps.FormItemObj[] = [
    {
      label: '资产来源',
      modelName: `fundSource`,
      dom: <Input />
    },
    {
      label: '新旧车',
      modelName: `fundSourceB`,
      domConfig:{
        type: 'select',
        selectLists:[
          { value: '1', name: '新车' },
          { value: '0', name: '二手车'}
        ],
        domProps:{
          placeholder: '请选择新旧车',
        }
      }      
    },
    {
      label: '手机号',
      modelName: `fundSourceC`,
      ruleType: RuleEnum.手机号
    }
  ]
  return (
    <div>
      <div>
        <label>一、</label><span>useImperativeHandle +++ useRef的使用</span>
        <br /><span>(从当前组件调用子组件暴露出来的方法、获取值)</span>
        {/* <Button onClick={() => console.log(testRef, 'testRef::')}>父组件拿子组件的值</Button> */}
      </div>
      <div style={{ border: "1px solid" }}>
        <span>
          这里是子组件:
        </span>
        <div>
          <span>
            一个带搜索的table:
        </span>
        </div>
        <FormSearch
          ref={testRef}
          searchFieldsList={searchFieldsList}
        />
      </div>
      <Divider />

      {/* <Table rowKey="id" columns={columns} dataSource={data} /> */}
      <div>
        <label>二、</label><span>useContext与useReducer的使用==redux的效果（在父组件存储数据）</span>
      </div>
      {/* useContext与useReducer的使用 */}
      <Father>
        <Son1 />
        <Son2 />
      </Father>
    </div>
  );
}
