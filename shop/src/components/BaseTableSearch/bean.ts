import React, { ReactDOM, ReactElement } from 'react';
import { ColProps } from 'antd/lib/col';
// import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import { SpinProps } from 'antd/lib/spin';
import { BaseTableProps } from '../BaseTable';
// import { SearchParamsRender } from './RenderParams';
// import { ColumnSelectionProps } from '../ColumnSelection';

export namespace SearchTableProps {
  export interface Selectlists {
    name: string;
    value: string;
  }
  export interface DomConfig {
    type?: 'select';
    selectLists?: Selectlists[];
    domProps?: any;
  }

  export interface SearchProps extends BaseSearch {
    loading?: boolean | SpinProps;
    handleSearch: Function;
    storageProps?: StorageMethod;
    paginationProps: PaginationProps;
  }
  export interface PaginationProps {
    total: number;
    size: number;
    page: number;
    showSizeChanger?: boolean;
  }
  interface StorageMethod {
    getStorage: Function;
    setStorage: Function;
    clearStorage: Function;
  }
  export interface BaseSearchTableProps extends BaseTable {
    paginationProps?: PaginationProps;
    handleSearch?: Function;
    storageProps?: StorageMethod;
  }
  export interface FormItemObj {
    label: string;
    modelName: string;
    dom?: ReactDOM | ReactElement<any>;
    required?: boolean;
    domConfig?: DomConfig;
    colspan?: ColProps;
    options?: any;
    ruleType?: number;
  }
  interface AdvancedSearchProps {
    show?: boolean;
    btnText?: string;
    foldNum?: number;
  }
  export interface FormItemFunc {
    (form: any): FormItemObj[];
  }
  interface BaseSearch {
    searchFieldsList: FormItemObj[] | FormItemFunc;
    handleExport?: Function;
    noSearchBorder?: boolean;
    advancedSearchProps?: AdvancedSearchProps;
    maxLabelFontNum?: number;
  }
  interface BaseTable extends BaseTableProps {
    tableHeight?: number | string;
    noTableBorder?: boolean;
  }
  export interface InnerFunc {
    reload: Function;
    form: any;
    query: any;
  }
  export interface QueryParams {
    pagination?: PaginationProps;
    querys?: any;
  }
  export interface ItemProps extends BaseSearch, BaseTable {
    extendBetween?: any;
    getInnerFunc?: (obj: InnerFunc) => void;
    dataSourceFunc?: (data?: any) => Promise<any>;
    searchParamsRender?: any;
    defaultSize?: number;
    needCache?: boolean;
    needColumnsSelection?: boolean;
    columnsSelection?: Partial<any>;
    hideSearch?: boolean;
    onQuery?: (v: QueryParams) => void;
  }
}
