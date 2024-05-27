import { ActionReducerMapBuilder, createAction } from '@reduxjs/toolkit';
import { EditorState } from './../internal';
import { createItemsAction, DiagramRef, ItemsRef } from './utils';

export enum OrderMode {
    BringToFront = 'BRING_TO_FRONT',
    BringForwards = 'BRING_FORWARDS',
    SendBackwards = 'SEND_BACKWARDS',
    SendToBack = 'SEND_TO_BACK',
}

export const orderItems =
    createAction('items/order', (mode: OrderMode, diagram: DiagramRef, items: ItemsRef) => {
        return { payload: createItemsAction(diagram, items, { mode }) };
    });

export const moveItems =
    createAction('items/move', (diagram: DiagramRef, items: ItemsRef, index: number) => {
        return { payload: createItemsAction(diagram, items, { index }) };
    });

export function buildOrdering(builder: ActionReducerMapBuilder<EditorState>) {
    return builder
        .addCase(moveItems, (state, action) => {
            const { diagramId, itemIds, index } = action.payload;

            return state.updateDiagram(diagramId, diagram => {
                return diagram.moveItems(itemIds, index);
            });
        })
}
