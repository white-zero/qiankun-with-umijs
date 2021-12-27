import React,{useEffect,useState} from 'react';



const Countdown: React.FC<any> = () => {
  const [refreshTime,setRefreshTime] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => {
        if (document.getElementById('freshTimeBox') == null) {
            clearInterval(timer) 
        } else {
            if (refreshTime == 0) {
                //执行刷新
                setRefreshTime(30)
            } else {
                setRefreshTime(refreshTime - 1)
            }
        }
    }, 1000)
    return () => {
        clearInterval(timer)
    }
})

  return (
    <div>
      <span id={'freshTimeBox'}>
      {refreshTime}
      </span>      
    </div>
  );
}
export default Countdown;
