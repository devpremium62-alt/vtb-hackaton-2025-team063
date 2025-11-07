'use client';
import { MantineProvider } from '@mantine/core';
import { PropsWithChildren } from 'react';

export default function MantineClientProvider({ children }: PropsWithChildren) {
    return (
        <MantineProvider
            defaultColorScheme="auto"
            theme={{
                fontFamily: 'var(--font-sf-pro)',
                headings: { fontFamily: 'var(--font-sf-pro)' },
            }}
        >
            {children}
        </MantineProvider>
    );
}