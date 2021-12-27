import React from 'react';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import Countdown from '@/pages/Demo/components/countdown/index'


const Demo: React.FC<any> = () => {



  return (
    <div>
      <h3>
        一、react-lottie-player -----动画
      </h3>      
      <Player
        autoplay={true}
        loop={false}
        src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
        style={{ height: '300px', width: '300px' }}
        keepLastFrame={true}
        onEvent={(value)=>{
          console.log(value,'----');
        }}
      >
        <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
      </Player>
      <h3>
        二、倒计时刷新
        <Countdown/>
      </h3>      
    </div>
  );
}
export default Demo;
