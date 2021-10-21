import React, { useMemo } from 'react';
import { Tree } from 'antd';
import { ColumnProps } from 'antd/lib/table';

const { TreeNode } = Tree;
export type ColumnsType = ColumnProps<any> & { classify?: any };

export interface TreeData {
  title: string;
  key: string;
  children: TreeData;
}
export interface ITreeSelect {
  classify: { title: string; key: any }[];
}
interface Props {
  columns: ColumnsType[];
  treeSelect?: ITreeSelect;
  selectKeys: any[];
  onSelectChange: Function;
}
const TreeSelect: React.FC<Props> = props => {
  const treeData = useMemo(() => {
    const treeCols = props.columns.map(item => ({
      key: item.dataIndex,
      title: item.title,
      classify: item.classify
    }));
    return props.treeSelect
      ? props.treeSelect.classify.map(item => ({
          ...item,
          children: treeCols.filter(col => col.classify == item.key)
        }))
      : [];
  }, [props.treeSelect, props.columns]);
  const noClassify = useMemo(() => {
    return props.columns
      .filter(item => !item.classify)
      .map(item => item.dataIndex);
  }, [props.columns]);
  const renderTreeNodes = (tree: any[]) => {
    return tree.map(item => {
      if (item.children) {
        return (
          // <TreeNode title={item.title} key={item.key} dataRef={item}>
            
          <TreeNode title={item.title} key={item.key} >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });
  };
  const onCheck = (keys: any) => {
    props.onSelectChange([...keys, ...noClassify]);
  };
  return (
    <Tree checkable onCheck={onCheck} checkedKeys={props.selectKeys}>
      {renderTreeNodes(treeData)}
    </Tree>
  );
};
export default TreeSelect;
