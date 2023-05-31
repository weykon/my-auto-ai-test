import { createContext, useContext, useEffect, useState } from "react";
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type PromptsAssetConntextType = {
    prompts: Prompt[];
    active_prompts: string[];
}
export const PromptsAssetContext = createContext<PromptsAssetConntextType>({
    prompts: [],
    active_prompts: []
});

export const PromptsAssetContextProvider = ({ children }: { children: JSX.Element }) => {
    const { data, error, isLoading } = useSWR('/api/read?fileName=prompts.json', fetcher);

    const _data = data ?? []
    return <PromptsAssetContext.Provider value={{
        prompts: _data ?? [],
        active_prompts: []
    }}>
        {children}
    </PromptsAssetContext.Provider>
}
export const usePromptsAsset = () => {
    return useContext(PromptsAssetContext);
};

// --------------------------------------------

export type Prompt = {
    download_url?: string;
    name: string;
    uuid: string;
    content: string;
}

// --------------------------------------------