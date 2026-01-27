import {useEffect,useRef} from 'react'
export default function useMountedState() {
    let mounted = useRef(false);
    const get = () => mounted.current;

    useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, []);
    return get;
}