import _ from 'lodash';

type RenderValue = (val: any, params: any) => any;

export interface RenderData {
  newKey?: string;
  newValue: RenderValue;
}

export type SearchParamsRender = {
  [propsName: string]: RenderData[] | RenderData | RenderValue;
};

export function getRender(
  params: { [propsName: string]: any },
  searchParamsRender?: SearchParamsRender
) {
  const renderParams: any = {};
  Object.keys(params).forEach(key => {
    if (!params[key] && params[key] !== 0) {
      params[key] = void 0;
    }
  });
  if (searchParamsRender) {
    Object.keys(params).forEach(key => {
      const renderItem = searchParamsRender[key];
      if (renderItem !== null && renderItem !== undefined) {
        if (typeof renderItem === 'function') {
          renderParams[key] = renderItem(params[key], params);
          return;
        }
        if (Array.isArray(renderItem)) {
          renderItem.forEach(item => {
            renderParams[item.newKey || key] = item.newValue(
              params[key],
              params
            );
          });
          return;
        }
        if (typeof renderItem === 'object') {
          renderParams[renderItem.newKey || key] = renderItem.newValue(
            params[key],
            params
          );
        }
      } else {
        renderParams[key] = params[key];
      }
    });
  } else {
    return params;
  }
  return _.cloneDeep(renderParams);
}
