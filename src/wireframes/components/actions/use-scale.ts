import * as React from 'react';
import { useEventCallback } from '@app/core';
import { RootState, useAppDispatch } from '@app/store';
import { texts } from '@app/texts';
import { addShape, getDiagramId } from '@app/wireframes/model';
import { UIAction } from './shared';
import { useStore as useReduxStore } from 'react-redux'
import { getEditor, useStore } from '@app/wireframes/model'
import { useEffect } from 'react'

export function useScale() {
    const dispatch = useAppDispatch();
    const store = useReduxStore<RootState>()

    const editor = useStore(getEditor)
    const [scaleDisable, setScaleDisable] = React.useState(true);
    useEffect(() => {
        if (editor.backgroundImg) {
            setScaleDisable(false)
        }
    }, [editor.backgroundImg])

    const setScale = useEventCallback(() => {
        const selectedDiagramId = getDiagramId(store.getState())
        if (selectedDiagramId) {
            dispatch(
                addShape(selectedDiagramId, 'HorizontalLine', {
                    position: { x: 100, y: 100 }
                })
            )
        }
    })



    const scaleAction: UIAction = React.useMemo(() => ({
        disabled: scaleDisable,
        icon: 'icon-search',
        label: texts.common.setScale,
        tooltip: texts.common.setScale,
        onAction: setScale,
    }), [setScale, scaleDisable]);

    return { setScale: scaleAction };
}
