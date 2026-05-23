import { Bot, ChevronDown, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { assetUrl } from '@/lib/assets';

const starterPrompts = [
    'Gợi ý cafe yên tĩnh',
    'Nên đi đâu cuối tuần?',
    'Tạo chuyến đi giúp tôi',
];

export default function Chatbot() {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            text: 'Chào bạn, mình là KhamPha AI của web này. Mình có thể trò chuyện kỹ hơn về kiểu chuyến đi bạn muốn, lọc địa điểm theo khu vực, nhóm trải nghiệm, hoặc giúp bạn bắt đầu một lịch trình. Bạn có muốn mình gợi ý vài lựa chọn trước không?',
            places: [],
            actions: [],
        },
    ]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const handleOpen = () => {
            if (!auth?.user) {
                router.visit(route('login'));
                return;
            }
            setOpen(true);
            setShowGreeting(false);
        };
        window.addEventListener('open-chatbot', handleOpen);
        return () => window.removeEventListener('open-chatbot', handleOpen);
    }, [auth]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading, open]);

    const sendMessage = async (text = input) => {
        const message = text.trim();
        if (!message || loading) return;

        setInput('');
        setLoading(true);
        setMessages(prev => [...prev, { role: 'user', text: message }]);

        try {
            const { data } = await axios.post(route('chatbot.message'), { message });
            setMessages(prev => [...prev, {
                role: 'bot',
                text: data.reply || 'Mình chưa có câu trả lời thật phù hợp. Bạn nói rõ hơn khu vực, kiểu địa điểm hoặc thời gian đi nhé. Bạn có muốn mình gợi ý không?',
                places: data.places || [],
                actions: data.actions || [],
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'bot',
                text: error.response?.data?.message || 'Mình đang gặp lỗi kết nối. Bạn thử lại sau một chút nhé.',
                places: [],
                actions: [],
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-20 right-4 z-[150] flex flex-col items-end gap-3 pointer-events-none lg:bottom-6 lg:right-6">
            {!open && showGreeting && (
                <div className="bg-white px-4 py-3 rounded-2xl shadow-xl border border-blue-100 flex items-center gap-3 animate-bounce origin-bottom-right pointer-events-auto">
                    <div className="bg-blue-50 p-2 rounded-full text-[#003d9b]">
                        <Bot className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-800">KhamPha AI</p>
                        <p className="text-xs text-gray-500">Trợ lý riêng của KhamPhaDD</p>
                    </div>
                    <button type="button" onClick={() => setShowGreeting(false)} className="ml-2 text-gray-400 hover:text-gray-600">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className={`transition-all duration-300 origin-bottom-right pointer-events-auto ${open ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute bottom-16 right-0'}`}>
                {open && (
                    <section className="mb-4 flex h-[650px] max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                        <header className="bg-[#003d9b] px-4 py-4 text-white">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-white/15 p-2">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black">KhamPha AI</p>
                                        <p className="text-xs text-white/70">Hiểu dữ liệu địa điểm và chuyến đi trong web</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
                                    aria-label="Đóng trợ lý"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto bg-[#F5F6FA] p-4">
                            <div className="space-y-3">
                                {messages.map((message, index) => (
                                    <ChatMessage key={index} message={message} />
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Đang tìm gợi ý...
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 bg-white p-3">
                            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
                                {starterPrompts.map(prompt => (
                                    <button
                                        key={prompt}
                                        type="button"
                                        onClick={() => sendMessage(prompt)}
                                        className="flex-shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-[#003d9b] hover:bg-blue-100"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    sendMessage();
                                }}
                                className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 focus-within:border-[#003d9b]"
                            >
                                <input
                                    value={input}
                                    onChange={event => setInput(event.target.value)}
                                    placeholder="Hỏi AI về địa điểm, bản đồ, chuyến đi..."
                                    className="min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-gray-800 outline-none focus:ring-0"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003d9b] text-white transition hover:bg-[#002a6e] disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </section>
                )}
            </div>

            <button
                type="button"
                onClick={() => {
                    if (!auth?.user) {
                        router.visit(route('login'));
                        return;
                    }
                    setOpen((value) => !value);
                    setShowGreeting(false);
                }}
                className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003d9b] text-white shadow-xl shadow-blue-950/20 transition-all hover:-translate-y-0.5 hover:bg-[#0052cc] focus:outline-none focus:ring-4 focus:ring-[#003d9b]/20 pointer-events-auto"
                aria-label={open ? 'Thu nhỏ trợ lý' : 'Mở trợ lý du lịch'}
            >
                {open ? <ChevronDown className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                {!open && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[#1A1A1A]">
                        <Sparkles className="h-3 w-3" />
                    </span>
                )}
            </button>
        </div>
    );
}

function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                isUser ? 'bg-[#003d9b] text-white' : 'bg-white text-gray-700'
            }`}>
                <p className="whitespace-pre-line leading-relaxed">{message.text}</p>

                {!isUser && message.places?.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {message.places.map(place => (
                            <a key={place.id}
                                href={place.url}
                                className="block rounded-xl border border-gray-100 bg-gray-50 p-2 transition hover:border-[#003d9b]/30 hover:bg-blue-50/40">
                                <div className="flex gap-2">
                                    <div className="h-12 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                                        {place.image && (
                                            <img
                                                src={assetUrl(place.image)}
                                                alt={place.name}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-black text-gray-900">{place.name}</p>
                                        <p className="truncate text-[10px] font-semibold text-[#003d9b]">{place.category || place.city || 'Địa điểm'}</p>
                                        <p className="line-clamp-2 text-[10px] text-gray-500">{place.reason}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {!isUser && message.actions?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map((action, index) => (
                            <a key={index}
                                href={action.url}
                                className="rounded-full bg-[#003d9b] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#002a6e]">
                                {action.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
