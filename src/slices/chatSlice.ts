import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ChatType, MessageType} from "../types.ts";

interface ChatState {
    messages: Record<number, MessageType[]>;
    chats: ChatType[];
    activeChatId: number | null;
}

const initialState: ChatState = {
    messages: {},
    chats: [],
    activeChatId: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveChat(state, action: PayloadAction<number>) {
            state.activeChatId = action.payload;
        },
        addMessage(state, action: PayloadAction<MessageType>) {
            const { chatId } = action.payload;
            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }
            state.messages[chatId].push(action.payload);
        },
        addChat(state, action: PayloadAction<ChatType>) {
            state.chats.push(action.payload);
        },
        setMessagesForChat(state, action: PayloadAction<{ chatId: number; messages: MessageType[] }>) {
            const { chatId, messages } = action.payload;
            state.messages[chatId] = messages;
        },
    },
});

export const { setActiveChat, addMessage, setMessagesForChat, addChat } = chatSlice.actions;
export default chatSlice.reducer;