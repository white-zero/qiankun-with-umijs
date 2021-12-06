import React from 'react';
import { useRequest, request, Link } from 'umi';
import {Father} from './father';
import {Son1} from './sonone';
import {Son2} from './sontwo';
import { Table } from 'antd';

const  IndexPage: React.FC<any> = () => {

  const { data = [] } = useRequest(() => request('/api/shop/list'));

  const columns = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'name',
      title: '名称',
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
      <h1 style={{ marginBottom: 24 }}>商品列表</h1>

      <Table rowKey="id" columns={columns} dataSource={data} />
    </div>
  );
}
export default IndexPage;
