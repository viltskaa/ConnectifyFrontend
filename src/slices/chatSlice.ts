import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ChatType, ContactType, ContactRequestType, MessageType} from "../types.ts";

interface ChatState {
    messages: Record<number, MessageType[]>;
    chats: Record<number, ChatType>;
    contactRequests: Record<number, ContactRequestType>;
    contacts: Record<number, ContactType>;
    activeChatId: number | null;
}

const initialState: ChatState = {
    messages: {},
    chats: {},
    contactRequests: {},
    contacts: {},
    activeChatId: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveChat(state, action: PayloadAction<number | null>) {
            state.activeChatId = action.payload;
        },
        addMessage(state, action: PayloadAction<MessageType>) {
            const {chatId} = action.payload;
            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }
            state.messages[chatId].push(action.payload);
        },
        addChat(state, action: PayloadAction<ChatType>) {
            const {id} = action.payload;
            state.chats[id] = action.payload;
        },
        addRequest(state, action: PayloadAction<ContactRequestType>) {
            const {id} = action.payload;
            state.contactRequests[id] = action.payload;
        },
        removeRequest(state, action: PayloadAction<number>) {
            const id = action.payload;
            delete state.contactRequests[id];
        },
        deleteChat(state, action: PayloadAction<number>) {
            const id = action.payload;
            delete state.chats[id];
        },
        updateChat(state, action: PayloadAction<ChatType>) {
            const {id} = action.payload;
            state.chats[id] = action.payload;
        },
        addContact(state, action: PayloadAction<ContactType>) {
            const {id} = action.payload;
            state.contacts[id] = action.payload;
        }
    },
});

export const {
    setActiveChat,
    addMessage,
    addChat,
    addRequest,
    addContact,
    removeRequest,
    deleteChat,
    updateChat
} = chatSlice.actions;
export default chatSlice.reducer;