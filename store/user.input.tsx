import { createContext, useContext, useState } from "react"
import { EventSourceMessage, fetchEventSource } from "@microsoft/fetch-event-source";
import { CreateChatCompletionRequest } from "openai-edge/types/types/chat";
type UserInputContextType = {
    currentProcessText: string;
    onSubmit: (text: string) => void;
}
export const UserInputContext = createContext<UserInputContextType | any>(null)

export const UserInputProvider = ({ children }: { children: JSX.Element }) => {
    const [currentProcessText, setCurrentProcessText] = useState<string>('')
    const [history, setHistory] = useState<any[]>([])
    const [aisay, setAisay] = useState<string>('')
    return (
        <UserInputContext.Provider value={{
            currentProcessText,
            onSubmit: (text: string) => {
                console.log(text);
                const reqCtrl = new AbortController();
                const reqBodyData: CreateChatCompletionRequest = {
                    model: "gpt-3.5-turbo",
                    messages: [
                        ...history,
                        {
                            role: 'user',
                            content: text,
                        }
                    ]
                }

                fetchEventSource('/api/chat', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reqBodyData),
                    signal: reqCtrl.signal,
                    async onopen(response) {
                        console.log('response', response)
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
                            // console.log('text', text);
                            setAisay(
                                aisay + (text ?? '')
                            );
                        } catch (error) {
                            console.log("aborting")
                            setAisay(
                                aisay + ('\n')
                            );
                            reqCtrl.abort()
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


