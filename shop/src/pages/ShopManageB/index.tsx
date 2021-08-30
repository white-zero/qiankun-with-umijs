import React,{useRef} from 'react';
import { useRequest, request, Link } from 'umi';
import { Table,Button } from 'antd';
import {Father} from './father';
import {Son1} from './sonone';
import {Son2} from './sontwo';
import FormSearch from '@/components/BaseTableSearch'

export default () => {
  const testRef = useRef()
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
      dataIndex:'----',
      title: '地址',
      render: ()=>(
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

  return (
    <div>
      wwww
      <h1 style={{ marginBottom: 24 }}>商品列表</h1>
      <Button onClick={()=>console.log(testRef,'testRef::')}>父组件拿子组件的值</Button>
      <FormSearch ref={testRef}/>
      {/* <Table rowKey="id" columns={columns} dataSource={data} /> */}

      {/* useContext与useReducer的使用 */}
      <Father>
          <Son1/>
          <Son2/>
      </Father>
    </div>
  );
}
