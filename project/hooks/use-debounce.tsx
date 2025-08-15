import { useEffect, useState } from "react";

export default function useDebounce<T>(listenTo: T, millisecondsDelay: number) {
  const [debounced, setDebounced] = useState(listenTo);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(listenTo);
    }, millisecondsDelay);

    return () => clearTimeout(timeout);
  }, [listenTo, millisecondsDelay]);

  return debounced;
}
