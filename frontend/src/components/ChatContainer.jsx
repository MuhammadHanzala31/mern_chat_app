import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useChatStore } from '../store/zustand/chatStore'
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeleton/MessageSkeleton';
import avatar from '../assets/user.png'
import { useAuthStore } from '../store/zustand/authStore';
import { formatMessageTime } from '../utils/messageDateFormate';
function ChatContainer() {

    const { messages, getMessages, selectedUser, isMessagesLoading, unSuscribeMessage, suscribedMessage } = useChatStore()
    const { authUser } = useAuthStore()
    const messageEndRef = useRef(null);

    console.log(messages, "Msgs")


    useEffect(() => {
        getMessages(selectedUser?._id)

        suscribedMessage()

        return () => unSuscribeMessage()
    }, [selectedUser?._id, getMessages, suscribedMessage, unSuscribeMessage]);

    useLayoutEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    if (isMessagesLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessageSkeleton />
                <ChatInput />
            </div>)
    }

    if (messages.lenght) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                    No Chat send Message to Start Conversation
                </div>
                <ChatInput />
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />
            {
                !messages ? <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                    No Chat send Message to Start Conversation
                </div> : <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (

                        <div
                            key={message._id}
                            className={`chat ${message.senderId == authUser?._id ? "chat-end" : "chat-start"}`}
                            ref={messageEndRef}
                        >
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img
                                        src={
                                            message?.senderId === authUser?._id
                                                ? authUser?.avatar || avatar
                                                : selectedUser.avatar || avatar
                                        }
                                        alt="profile pic"
                                    />
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {formatMessageTime(message?.createdAt)}
                                </time>
                            </div>
                            <div className="chat-bubble flex flex-col">
                                {message?.image && (
                                    <img
                                        src={message?.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )}
                                {message?.message && <p>{message?.message}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            }

            <ChatInput />
        </div>
    )
}

export default ChatContainer
