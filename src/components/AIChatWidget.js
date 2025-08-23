import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { marked } from 'marked';
const AIChatWidget = () => {
    const { currentUser, userProfile } = useAuth();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const [authError, setAuthError] = useState(false);
    useEffect(() => {
        const tryLoginPuter = async () => {
            if (open) {
                try {
                    if (typeof puter?.init === 'function') {
                        await puter.init();
                    }
                    setAuthError(false);
                }
                catch (e) {
                    setAuthError(true);
                }
            }
        };
        tryLoginPuter();
        if (open && messages.length === 0) {
            setMessages([
                {
                    role: 'assistant',
                    content: `Hey! ${userProfile?.displayName || currentUser?.displayName || 'pianist'} how can I help you?`,
                },
            ]);
        }
    }, [open, userProfile, currentUser, messages.length]);
    useEffect(() => {
        if (open) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);
    if (!currentUser)
        return null;
    if (authError) {
        return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-end pointer-events-none", children: [_jsx("div", { className: "w-full h-full absolute top-0 left-0 pointer-events-auto", onClick: () => setOpen(false) }), _jsxs("div", { className: "relative m-6 w-full max-w-sm bg-[var(--background-darker)] rounded-xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto", style: { minHeight: 200, maxHeight: 300 }, children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[var(--background-darker)]", children: [_jsx("span", { className: "font-bold text-lg text-[var(--accent-green)]", children: "AI Assistant" }), _jsx("button", { className: "text-gray-400 hover:text-white", onClick: () => setOpen(false), "aria-label": "Close chat", children: _jsx(FaTimes, { size: 22 }) })] }), _jsx("div", { className: "flex-1 flex items-center justify-center px-4 py-6", children: _jsxs("span", { className: "text-red-400 text-center", children: ["You must log in to the Puter API to use the AI chat.", _jsx("br", {}), "Please reload the page or check your authentication."] }) })] })] }));
    }
    const handleSend = async () => {
        if (!input.trim())
            return;
        const newMessages = [
            ...messages,
            { role: 'user', content: input },
        ];
        setMessages(newMessages);
        setInput('');
        setLoading(true);
        try {
            if (typeof puter?.init === 'function') {
                await puter.init();
            }
            const prompt = `You are an expert assistant for the Chordia website and piano. Chordia is a platform for pianists where users can:\n\n- Register and create a personal profile.\n- Access a dashboard with their songs and progress.\n- Discover new songs in the Discover section.\n- Save and manage songs in their Library.\n- Create new songs and chord progressions.\n- Edit their profile and view information about other users.\n- Access tools like an AI chord generator, an interactive piano, and learning resources.\n- Admins can manage platform songs.\n\nFor creating a song in Chordia, the user must go to the 'Create Song' section, introduce the title, chords, progression, and any relevant additional information. They can use the AI chord generator for suggestions and the interactive piano to test the chords. Once completed, they can save the song in their personal library.\n\nYou can also help with questions about music theory, piano practice, website usage, technical issues, and recommendations. Respond clearly, helpfully, and in a friendly manner.\n\nUser: ${input}`;
            console.log('AIChatWidget: Enviando prompt a puter.ai.chat:', prompt);
            const response = await puter.ai.chat(prompt);
            console.log('AIChatWidget: Respuesta bruta de puter.ai.chat:', response);
            let aiMessage;
            if (!response) {
                aiMessage = 'No response from AI.';
            }
            else if (typeof response === 'string') {
                aiMessage = response;
            }
            else if (response.message?.content) {
                aiMessage = response.message.content;
            }
            else if (response.choices?.[0]?.message?.content) {
                aiMessage = response.choices[0].message.content;
            }
            else {
                aiMessage = 'AI did not return a valid message.';
            }
            setMessages([...newMessages, { role: 'assistant', content: aiMessage }]);
        }
        catch (e) {
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: `An error occurred while connecting to the AI.\n${e instanceof Error ? e.message : JSON.stringify(e, null, 2)}`,
                },
            ]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const handleClear = () => {
        setMessages([
            {
                role: 'assistant',
                content: `Hey! ${userProfile?.displayName || currentUser?.displayName || 'pianist'} how can I help you?`,
            },
        ]);
    };
    return (_jsxs(_Fragment, { children: [!open && (_jsx("button", { className: "fixed bottom-6 right-6 z-50 bg-[var(--accent-green)] text-black rounded-full shadow-lg p-4 flex items-center justify-center hover:bg-green-400 transition-all", onClick: () => setOpen(true), "aria-label": "Open AI chat", children: _jsx(FaComments, { size: 28 }) })), open && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-end pointer-events-none", children: [_jsx("div", { className: "w-full h-full absolute top-0 left-0 pointer-events-auto", onClick: () => setOpen(false) }), _jsxs("div", { className: "relative m-6 w-full max-w-sm bg-[var(--background-darker)] rounded-xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto", style: { minHeight: 420, maxHeight: 600 }, children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[var(--background-darker)]", children: [_jsx("span", { className: "font-bold text-lg text-[var(--accent-green)]", children: "AI Assistant" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "text-gray-400 hover:text-white", onClick: handleClear, "aria-label": "Clear chat", children: _jsx(FaTrash, { size: 18 }) }), _jsx("button", { className: "text-gray-400 hover:text-white", onClick: () => setOpen(false), "aria-label": "Close chat", children: _jsx(FaTimes, { size: 22 }) })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[var(--background-darker)]", style: { minHeight: 200 }, children: [messages.map((msg, i) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `rounded-lg px-3 py-2 max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-[var(--accent-green)] text-black' : 'bg-gray-700 text-white'}`, children: msg.role === 'assistant' ? (_jsx("span", { dangerouslySetInnerHTML: { __html: marked.parse(msg.content) } })) : (msg.content) }) }, i))), _jsx("div", { ref: chatEndRef })] }), _jsxs("div", { className: "px-4 py-3 border-t border-white/10 bg-[var(--background-darker)] flex gap-2", children: [_jsx("input", { type: "text", className: "flex-1 rounded-lg px-3 py-2 bg-gray-800 text-white outline-none border-none", placeholder: "Type your message...", value: input, onChange: e => setInput(e.target.value), onKeyDown: handleKeyDown, disabled: loading, autoFocus: true }), _jsx("button", { className: "bg-[var(--accent-green)] text-black rounded-lg px-3 py-2 flex items-center justify-center disabled:opacity-60", onClick: handleSend, disabled: loading || !input.trim(), "aria-label": "Send", children: _jsx(FaPaperPlane, { size: 18 }) })] })] })] }))] }));
};
export default AIChatWidget;
