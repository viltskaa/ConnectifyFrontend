import {useRef} from "react";

export const useFocus = <T extends HTMLElement>() => {
    const htmlElRef = useRef<T>(null)

    const setFocus = () => {
        if (htmlElRef && htmlElRef.current){
            htmlElRef.current.focus()
        }
    }

    return {
        ref: htmlElRef,
        setFocus,
    }
}