import { createContext, useContext, useEffect, useRef, useState } from "react"
import { EventSourceMessage, fetchEventSource } from "@microsoft/fetch-event-source";
import { ChatCompletionRequestMessageRoleEnum, CreateChatCompletionRequest } from "openai-edge/types/types/chat";
export type History = {
    role: ChatCompletionRequestMessageRoleEnum;
    content: string;
    name?: string
}
type UserInputContextType = {
    onSubmit: (text: string) => void;
    history: History[];
    aisay: string
    setHistory: (history: {}[]) => void;
    saying: boolean;
}
export const UserInputContext = createContext<UserInputContextType | any>(null)

export const UserInputProvider = ({ children }: { children: JSX.Element }) => {

    // 可以把它当作viewHistory
    const [history, setHistory] = useState<History[]>([]);
    // 这个可以当作sourceHistory
    const _refHistory = useRef<History[]>([]);
    const [aisay, setAisay] = useState<string>('')
    const _refAiSay = useRef('');
    const [saying, setSaying] = useState<boolean>(false);

    useEffect(() => {
        if (!saying) {
            if (_refAiSay.current !== '') {
                setAisay('');
                _refAiSay.current = '';
                setHistory(_refHistory.current)
            }
        }
    }, [saying])

    return (
        <UserInputContext.Provider value={{
            history,
            setHistory,
            aisay,
            saying,
            onSubmit: (human_text: string) => {
                console.log(human_text);
                setSaying(true);
                const reqCtrl = new AbortController();

                const reqBodyData: CreateChatCompletionRequest = {
                    model: "gpt-3.5-turbo",
                    messages: [
                        ..._refHistory.current,
                        {
                            role: 'user',
                            content: human_text,
                        }
                    ]
                }

                // 先更新source
                _refHistory.current.push({
                    role: 'user',
                    content: human_text,
                })

                fetchEventSource('/api/chat', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reqBodyData),
                    signal: reqCtrl.signal,
                    async onopen(response) {
                        console.log('onopen')
                        return
                    },
                    onclose() {
                        console.log('onclose')
                    },
                    onmessage(msg: EventSourceMessage) {
                        console.log('msg', msg)
                        try {
                            const { data } = msg
                            let text = JSON.parse(data).choices[0].delta.content
                            console.log('text', text);
                            _refAiSay.current += text ?? '';
                            setAisay(
                                _refAiSay.current
                            );
                        } catch (error) {
                            console.log("aborting")
                            console.log('_refHistory.current', _refHistory.current)
                            _refHistory.current.push({
                                role: 'assistant',
                                content: _refAiSay.current,
                            })
                            console.log('_refHistory.current', _refHistory.current)
                            reqCtrl.abort();
                            setSaying(false)
                        }
                    },
                    onerror(err) {
                        console.log('err', err)
                    },
                });
            }
        }}>
            {children}
        </UserInputContext.Provider>
    )
}

export const useUserInput = () => {
    return useContext(UserInputContext)
}


