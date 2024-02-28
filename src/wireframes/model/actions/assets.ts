import { createAction, createReducer } from '@reduxjs/toolkit';
import { AssetsState } from './../internal';

export const filterShapes =
    createAction('shapes/shapes', (filter: string) => {
        return { payload: { filter } };
    });

export function assets(initialState: AssetsState) {
    return createReducer(initialState, builder => builder
        .addCase(filterShapes, (state, action) => {
            state.shapesFilter = action.payload.filter;
        }));
}
