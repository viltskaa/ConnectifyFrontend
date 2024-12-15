import {useRef} from "react";
import {MentionsRef} from "antd/es/mentions";

export const useLegacyFocus = () => {
    const htmlElRef = useRef<MentionsRef>(null)

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