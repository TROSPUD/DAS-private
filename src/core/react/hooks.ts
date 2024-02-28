/* eslint-disable no-lonely-if */

import * as React from 'react';
import { useEffect } from 'react';

export function useOpenFile(fileType: string, onOpened: (file: File) => void): () => void {
    const fileInputRef = React.useRef<HTMLInputElement | null>();
    const fileCallback = React.useRef(onOpened);

    useEffect(() => {
        let invisibleInput = document.createElement('input');
        invisibleInput.type = 'file';
        invisibleInput.style.visibility = 'hidden';
        invisibleInput.accept = fileType;
    
        invisibleInput.addEventListener('change', () => {
            if (invisibleInput.files && invisibleInput.files.length > 0) {
                const file = invisibleInput.files[0];

                fileCallback.current(file);
            }
        });

        document.body.appendChild(invisibleInput);

        fileInputRef.current = invisibleInput;
        
        return () => {
            document.body.removeChild(invisibleInput);

            fileInputRef.current = null;
        };
    }, [fileType]);

    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = fileType;
        }
    }, [fileType]);

    const doClick = useEventCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    });

    return doClick;
}

export function useDetectPrint(): boolean {
    const [isPrinting, toggleStatus] = React.useState(false);

    useEffect(() => {
        const printMq = window.matchMedia && window.matchMedia('print');

        toggleStatus(!!printMq.matches);

        const eventListener = (mqList: MediaQueryListEvent) => {
            toggleStatus(!!mqList.matches);
        };

        printMq.addEventListener('change', eventListener);

        return () => {
            printMq.removeEventListener('change', eventListener);
        };
    }, []);

    return isPrinting;
}

export function useFullscreen(): [boolean, (value: boolean) => void] {
    const [fullscreen, setFullscreenValue] = React.useState(!!document.fullscreenElement);

    useEffect(() => {
        const listener = () => {
            setFullscreenValue(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', listener);

        return () => {
            document.removeEventListener('fullscreenchange', listener);
        };
    }, []);

    const setFullScreen = useEventCallback((value: boolean) => {
        if (value) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            }
        } else {
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    return [fullscreen, setFullScreen];
}

export const useDocumentEvent = <K extends keyof DocumentEventMap>(type: K, listener: (event: DocumentEventMap[K]) => any) => {
    const listenerRef = React.useRef(listener);

    listenerRef.current = listener;

    useEffect(() => {
        const callback = (event: any) => {
            listenerRef.current(event);
        };

        document.addEventListener(type, callback);

        return () => {
            document.removeEventListener(type, callback);
        };
    }, [type]);
};

export const useWindowEvent = <K extends keyof WindowEventMap>(type: K, listener: (event: WindowEventMap[K]) => any) => {
    const listenerRef = React.useRef(listener);

    listenerRef.current = listener;

    useEffect(() => {
        const callback = (event: any) => {
            listenerRef.current(event);
        };

        window.addEventListener(type, callback);

        return () => {
            window.removeEventListener(type, callback);
        };
    }, [type]);
};

type Fn<ARGS extends any[], R> = (...args: ARGS) => R;

export const useEventCallback = <A extends any[], R>(fn: Fn<A, R>): Fn<A, R> => {
    let ref = React.useRef<Fn<A, R>>(fn);

    React.useLayoutEffect(() => {
        ref.current = fn;
    });

    return React.useMemo(() => (...args: A): R => {
        return ref.current(...args);
    }, []);
};