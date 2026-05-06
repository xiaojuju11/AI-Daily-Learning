import { useEffect } from "react"

export default function useLifecycles(fn1, fn2) {
  useEffect(() => {
    if (fn1) {
      fn1()
    }

    return () => {
      if (fn2) {
        fn2()
      }
    }
  }, [])
}
