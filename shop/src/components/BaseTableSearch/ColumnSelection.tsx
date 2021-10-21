import React, { useState, useEffect, useCallback } from 'react';
import { Button, Dropdown, Checkbox, Menu } from 'antd';
import styles from './index.less';
import { ColumnProps } from 'antd/lib/table';
// import { Icon } from 'antd';
import { ProfileOutlined } from '@ant-design/icons';

import TreeSelect, { ITreeSelect } from './TreeSelect';
import { httpGet, httpPut } from '@/utils/RequestUtil/request';

// const IconFont = Icon.createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_1250597_qddcbaymf5.js'
// });
export interface CacheConfig {
  /**
   * @description 缓存key
   */
  key: string;
}
export type ColumnsType = ColumnProps<any> & { classify?: any };
export interface ColumnSelectionProps {
  columns: ColumnsType[];
  treeSelectColumns: ColumnsType[];
  setSelectColKeys: Function;
  /**
   * @description 操作缓存
   */
  cacheConfig?: CacheConfig;
  /**
   * @description 分类筛选配置
   */
  treeSelect?: ITreeSelect;
  /**
   * @description 分类筛选配置
   */
   isMenuData?: boolean;
}
const cookiesName = 'columnsSelection';
const ColumnSelection: React.FC<ColumnSelectionProps> = props => {
  const [showColumns, setShowColumns] = useState(false);
  const [selectKeys, setSelectKeys] = useState<any>([]);
  const checkList = props.columns.filter(item => item);
  const minColumns = 1;
  const { setSelectColKeys, cacheConfig, isMenuData } = props;
  const setKeys = (keys) => {
    setSelectKeys(keys);
    setSelectColKeys(keys);
  };
  const onSelectChange = async (keys) => {
    setKeys(keys);
    if (cacheConfig) {
      const str = localStorage.getItem(cookiesName);
      console.log('isMenuData::', isMenuData)
      if(isMenuData) {
        const getdata = await httpGet(`/financing/api/v1/menu/get-menu-data`, {menuName: cacheConfig.key});
        console.log('getdata::', getdata)
        let putdate = "";
        if (getdata.data?.configName) {
          const columnsSelection = JSON.parse(getdata.data?.configName);
          columnsSelection[cacheConfig.key] = keys;
          putdate = JSON.stringify(columnsSelection);
        } else {
          const columnsSelection = {
            [cacheConfig.key]: keys
          };
          putdate = JSON.stringify(columnsSelection);
        }
        const putdata = await httpPut(`/financing/api/v1/menu/update-menu-data`, {menuName: cacheConfig.key, configName: putdate});
        console.log("putdata:::", putdata)
      } else if (str) {
        const columnsSelection = JSON.parse(str);
        columnsSelection[cacheConfig.key] = keys;
        localStorage.setItem(cookiesName, JSON.stringify(columnsSelection));
      } else {
        const columnsSelection = {
          [cacheConfig.key]: keys
        };
        localStorage.setItem(cookiesName, JSON.stringify(columnsSelection));
      }
    }
    
  };
  const menu = (
    <Menu className={styles.dropdownMenu}>
      {props.treeSelect ? (
        <TreeSelect
          columns={props.treeSelectColumns || props.columns}
          treeSelect={props.treeSelect}
          selectKeys={selectKeys}
          onSelectChange={onSelectChange}
        />
      ) : (
          <Checkbox.Group value={selectKeys} onChange={onSelectChange}>
            {checkList.map(item => {
              const disabled =
                selectKeys.length <= minColumns &&
                selectKeys.indexOf(item.dataIndex!) > -1;
              return (
                <div className={styles.dropdownItem} key={item.dataIndex}>
                  <Checkbox disabled={disabled} value={item.dataIndex}>
                    {item.title}
                  </Checkbox>
                </div>
              );
            })}
          </Checkbox.Group>
        )}
    </Menu>
  );
  const setDefaultAllKeys = useCallback(() => {
    let allKeys = props.columns.map(item => item.dataIndex) || []
    if (props.treeSelectColumns) {
      allKeys = props.treeSelectColumns.map(item => item.dataIndex) || []
    }
    setKeys(allKeys);
  }, [props.columns, props.treeSelectColumns]);
  const getMenu = async(cacheConfig, flag) => {
    const getdata = await httpGet(`/financing/api/v1/menu/get-menu-data`, {menuName: cacheConfig.key});
    if (getdata?.data?.configName) {
      try {
        const columnsSelection = JSON.parse(getdata?.data?.configName);
        const keys = columnsSelection[cacheConfig.key];
        if (keys) {
          flag = false;
          setKeys(keys);
        }
      } catch (error) {
        console.debug('表格字段筛选缓存Err::', error);
      }
    }
  }
  useEffect(() => {
    let flag = true;
    if (cacheConfig) {
      const str = localStorage.getItem(cookiesName);
      if(isMenuData) {
        getMenu(cacheConfig, flag);
      } else if (str) {
        try {
          const columnsSelection = JSON.parse(str);
          const keys = columnsSelection[cacheConfig.key];
          if (keys) {
            flag = false;
            setKeys(keys);
          }
        } catch (error) {
          console.debug('表格字段筛选缓存Err::', error);
        }
      }
    }
    flag && setDefaultAllKeys();
  }, [props.columns]);
  return (
    <Button.Group className={styles.opb}>
      <Dropdown
        overlay={menu}
        visible={showColumns}
        onVisibleChange={setShowColumns}
        trigger={['click']}
      >
        <Button>
        <ProfileOutlined style={{ color: '#ffffff' }}/>
          {/* <IconFont type="iconliebiao" style={{ color: '#ffffff' }} /> */}
        </Button>
      </Dropdown>
    </Button.Group>
  );
};
export default ColumnSelection;
