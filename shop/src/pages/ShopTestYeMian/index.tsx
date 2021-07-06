import React from 'react';
import { useRequest, request, Link } from 'umi';
import { Table } from 'antd';

export default () => {

  const { data = [] } = useRequest(() => request('/api/shop/list'));

  const columns = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>test列表</h1>
      <div>TTTTTTT</div>
      <Table rowKey="id" columns={columns} dataSource={[]} />
      
    </div>
  );
}
