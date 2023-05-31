import { PromptsAssetContext, PromptsAssetContextProvider, usePromptsAsset } from "../store/prompts"
import styles from '../styles/Home.module.css'
import PromptPkg from "./prompt.pkg";

const PromptsBlock = () => {
    const { prompts, active_prompts } = usePromptsAsset();
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {
                prompts.map((prompt, index) => {
                    return (
                        <PromptPkg
                            key={prompt.uuid}
                            prompt={prompt}
                        />

                    )
                })
            }
        </div>
    )
}

export default PromptsBlock