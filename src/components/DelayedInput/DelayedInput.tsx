import React, {useState} from 'react';
import {Input} from "antd";

type DelayedInputProps = {
    timeoutValue?: number;
    placeholder?: string;
    onChange?: (value: string) => void;
    loading?: boolean;
}

const DelayedInput = ({timeoutValue, onChange, placeholder, loading}: DelayedInputProps): React.ReactElement => {
    const [inputValue, setInputValue] = useState('');
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const timeout = setTimeout(() => onChange && onChange(value), timeoutValue);

        setTypingTimeout(timeout);
    };

    return (
        <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={loading}
            allowClear
        />
    );
};

export default DelayedInput;