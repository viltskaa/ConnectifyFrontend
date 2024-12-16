import {MenuProps} from "antd";

export const items: MenuProps['items'] = [
    {
        key: 'reply',
        icon: <i className="bi bi-reply-fill fs-6"></i>,
        label: (<span>Ответить</span>),
    },
    {
        key: 'forward',
        icon: <i className="bi bi-reply-fill reverse fs-6"></i>,
        label: (<span>Переслать</span>),
    },
    {
        key: 'copy',
        icon: <i className="bi bi-clipboard2"></i>,
        label: (<span>Копировать текст</span>),
    },
    {
        key: 'ai',
        icon: <i className="bi bi-stars text-primary"></i>,
        label: (<span>AI помощь</span>)
    },
];