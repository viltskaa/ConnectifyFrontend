import React from 'react';

type HighlightAtWordsProps = {
    text: string;
    className?: string;
}

const HighlightAtWords = ({text, className}: HighlightAtWordsProps): React.ReactElement => {
    const highlightedText = text.split(/(\s+)/).map((word, index) => {
        if (word.startsWith("@")) {
            return (<span key={index} className="text-primary fw-bold">{word}</span>);
        }
        return word;
    });

    return <pre className={className}>{highlightedText}</pre>;
};

export default HighlightAtWords;