import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
import { History, UserInputContext, useUserInput } from "../store/user.input";
import Dialog from "./dialog";

const MessagesCtrl = () => {
    const { history, aisay } = useUserInput();
    console.log(history);
    return (
        <div>
            {
                history.map((e: History) => {
                    return (
                        <Dialog
                            key={e.role+e.content[0]}
                            dir={e.role === 'assistant' ? 'left' : 'right'}
                            msg={e.content}
                        />
                    )
                })
            }

            {
                aisay !== '' && <Dialog
                    key={aisay + Date.now()}
                    dir={'left'}
                    msg={aisay}
                />
            }
        </div>
    )
}

export default MessagesCtrl