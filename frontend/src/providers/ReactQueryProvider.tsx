'use client'

import {MutationCache, QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactNode, useState} from 'react'
import {usePopup} from "@/providers/GlobalPopupProvider";

export const REFETCH_INTERVAL = 10000;

export default function ReactQueryProvider({children}: { children: ReactNode }) {
    const {showPopup} = usePopup();

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1
            }
        },
        queryCache: new QueryCache({
            onError: (error) => {
                console.error(error);
                showPopup({
                    text: error.message,
                    background: "var(--error-color)"
                });
            },
        }),
        mutationCache: new MutationCache({
            onError: (error) => {
                console.error(error);
                showPopup({
                    text: error.message,
                    background: "var(--error-color)"
                });
            },
        }),
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}