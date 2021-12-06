import React from 'react';
import { Player, Controls } from '@lottiefiles/react-lottie-player';


const Demo: React.FC<any> = () => {



  return (
    <div>
      qqq
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
    </div>
  );
}
export default Demo;
