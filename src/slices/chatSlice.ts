import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ChatType, ContactRequestType, MessageType} from "../types.ts";

interface ChatState {
    messages: Record<number, MessageType[]>;
    chats: Record<number, ChatType[]>;
    contactRequests: Record<number, ContactRequestType>
    activeChatId: number | null;
}

const initialState: ChatState = {
    messages: {},
    chats: {},
    contactRequests: {},
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
            const { id } = action.payload;
            if (!state.chats[id]) {
                state.chats[id] = [];
            }
            state.chats[id].push(action.payload);
        },
        addRequest(state, action: PayloadAction<ContactRequestType>) {
            const { id } = action.payload;
            if (!state.contactRequests[id]) {
                state.contactRequests[id] = action.payload;
            }
            state.contactRequests[id] = action.payload;
        }
    },
});

export const { setActiveChat, addMessage, addChat, addRequest } = chatSlice.actions;
export default chatSlice.reducer;