//操作数据的子组件
import React ,{ useState ,useContext }from 'react';
import { Context } from './father'
export const Son2 =()=>{
     {/* 这里是对象，不是数组，value是对象 */}
    const {colorValue,dispatch} = useContext(Context)
    return(
        <div style={{width:200,height:200,background:'yellow'}}>
            这里是子组件2
            <br/>
            <button onClick={()=>{console.log(colorValue,"我从son1拿到的testValue");
            }}>我拿son1的值</button>&nbsp;
            <button onClick={()=>{dispatch({type:'son2',testValue:"通过son2改变son1的text的值为:333333"})
            }}>我修改son1的值</button>&nbsp;
            <button onClick={()=>{dispatch({type:'son1',colorValue:"通过son2改变son1的text的值为:444444"})
            }}>我修改son1的值</button>&nbsp;
        </div>
    )
}