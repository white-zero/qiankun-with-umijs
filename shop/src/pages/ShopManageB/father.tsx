//起存储数据的redux页面，父组件
import React ,{ createContext,useReducer } from 'react';
export const Context = createContext({})

interface Props {
}
export const Father:React.FC<Props> =props=>{

   {/* reducer作为变量而不是函数*/}
  const reducer = (state:any,action:any)=>{
    switch (action.type){
        case 'son1':
            return action.colorValue
        case 'son2':
            return action.testValue
        default :
            return 'purple'
    }
  } 
    const [colorValue,dispatch] = useReducer(reducer,'purple')
    return (
        <Context.Provider value={{colorValue,dispatch}}>
            {/* <div>
              我是father组件,我的内容是：
              {colorValue}
            </div> */}
            {props.children}
        </Context.Provider>
    )
}