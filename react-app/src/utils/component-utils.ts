import { RefObject, useEffect } from 'react';

export const useClickOutside = (ref: RefObject<HTMLElement>, closeHandler: () => void) => {
  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      closeHandler();
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}

export const reachedBottom = (eventWhenReached: () => void) => {
  let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
  let max = document.documentElement.scrollHeight - 125;

  if(pos >= max)   {
    eventWhenReached()
  }
}