//操作数据的子组件
import React ,{ useState ,useContext }from 'react';
import { Context } from './father'
export const Son1 =()=>{
     {/* 这里是对象，不是数组，value是对象 */}
    const {colorValue,dispatch} = useContext(Context)
    return(
        <div style={{background:'lightgreen',marginBottom:20}}>
          这里是子组件1
            <p style={{color:colorValue}}>text:{colorValue}</p>
            {/* 因为type是“son1”，所以传的值是colorValue,testValue不会传递 */}
            <button onClick={()=>{dispatch({type:'son1',colorValue:"给son2的值:22222",testValue:"给son2的值:1111111",})}}>给son2传值</button>&nbsp;
          
            <button onClick={()=>{dispatch({type:'son1',colorValue:"我自己修改我自己的值:66666"})}}>我修改自己的值</button>&nbsp;
        </div>
    )
}