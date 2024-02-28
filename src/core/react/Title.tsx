 

import * as React from 'react';
import { useEffect } from 'react';

export const Title = React.memo(({ text }: { text: string }) => {
    useEffect(() => {
        document.title = text;
    }, [text]);

    return null;
});
