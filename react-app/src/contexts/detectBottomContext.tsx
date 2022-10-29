import { createContext, FC, useEffect, useState } from 'react';

const initValue = {
  reachedBottom: false,
}

export const DetectBottomContext = createContext(initValue);

export const DetectBottomProvider: FC<{ children: JSX.Element }> = ({ children }) => {
  const [reachedBottom, setReachedBottom] = useState(false);

  const didReachBottom = () => {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight - 125;
  
    if(pos >= max)   {
      setReachedBottom(true);
    } else {
      setReachedBottom(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", didReachBottom);
    return () => {
      window.removeEventListener("scroll", didReachBottom)
    }
  }, []);

  return (
    <DetectBottomContext.Provider
        value={{
          reachedBottom
        }}
    >
      {children}
    </DetectBottomContext.Provider>
  )
}