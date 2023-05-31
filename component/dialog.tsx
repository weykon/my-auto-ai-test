import ReactMarkdown from "react-markdown";

const Dialog = (props: DialogProps) => {

    return (
        <div style={{ backgroundColor: props.dir === 'right' ? '#8e8e' : '#efff9f', border: '1px solid grey' }}>
            <ReactMarkdown>{props.msg}</ReactMarkdown>
            <div style={{ position: 'absolute', bottom: -5 }}>{props.time?.toLocaleTimeString() || ''}</div>
        </div>
    )
}

type DialogProps = {
    dir: DialogDir,
    msg: string,
    time?: Date
}

type DialogDir = 'left' | 'right';

export default Dialog