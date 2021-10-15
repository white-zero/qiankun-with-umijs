import React from 'react';

export const layout = {
  title: '商城管理',
  menuDataRender: () => (
    [
      {
        name: '商铺管理A',
        path: '/shop'
      },
      {
        name: '用户管理B',
        path: '/user'
      },
      {
        name: '父组件取值&&useContext+useReducer',
        path: '/shop/ShopManageB'
      }
    ]
  )
}