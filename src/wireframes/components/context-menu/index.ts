import { MenuProps } from 'antd/lib';
import { buildMenuItem, useClipboard, useRemove } from '../actions';

export const useContextMenu = (isOpen: boolean) => {
    const forClipboard = useClipboard();
    const forRemove = useRemove();

    if (!isOpen) {
        return DEFAULT_MENU;
    }

    const items: MenuProps['items'] = [
        buildMenuItem(forClipboard.cut, 'clipboardCut'),
        buildMenuItem(forClipboard.copy, 'clipboardCopy'),
        buildMenuItem(forClipboard.paste, 'clipboarPaste'),
        buildMenuItem(forRemove.remove, 'remove'),
    ];

    return { items, mode: 'vertical' } as MenuProps;
};

const DEFAULT_MENU: MenuProps = { items: [], mode: 'vertical' };