import { Prompt } from "../store/prompts"
import styles from '../styles/Home.module.css';

const PromptPkg = ({ prompt }: { prompt: Prompt }) => {
    return (
        <button className={styles.prompt_pkg_in_prompts_block}>
            <div>{prompt.name}</div>
            <span className={styles.tooltiptext}
            >
                {prompt.content}
            </span>
        </button>
    )
}

export default PromptPkg