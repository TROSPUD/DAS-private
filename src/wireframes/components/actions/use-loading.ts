import * as React from 'react';
import html2canvas from 'html2canvas';
import { useEventCallback, useOpenFile } from '@app/core';
import { useAppDispatch } from '@app/store';
import { texts } from '@app/texts';
import { getDiagrams, loadDiagramFromFile, saveDiagramToFile, saveDiagramToServer, useStore } from '@app/wireframes/model';
import { UIAction } from './shared';

export function useLoading() {
    const dispatch = useAppDispatch();
    const diagrams = useStore(getDiagrams);


    const canSave = React.useMemo(() => {
        for (const diagram of diagrams.values) {
            if (diagram.items.size > 0) {
                return true;
            }
        }

        return false;
    }, [diagrams]);

    const openHandler = useOpenFile('.json', file => {
        dispatch(loadDiagramFromFile({ file }));
    });

    // const doNew = useEventCallback(() => {
    //     dispatch(newDiagram(true));
    // });

    const doSave = useEventCallback(() => {
        dispatch(saveDiagramToServer({ navigate: true }));
    });

    const doSaveToFile = useEventCallback(() => {
        dispatch(saveDiagramToFile());
    });

    const doExportToImage = useEventCallback(() => {
        // 找到要转换的HTML元素
        const editorElement = document.querySelector('.editor');
        if (editorElement) {
            html2canvas(editorElement as HTMLElement, { scale: 2 })
                .then((canvas) => {
                    const downloadLink = document.createElement('a');
                    // 创建一个下载链接
                    downloadLink.href = canvas.toDataURL('image/png'); // 可以是'image/jpeg', 'image/png'等格式
                    downloadLink.download = 'diagram.png'; // 您希望保存的图片名称

                    // 模拟点击链接以下载
                    document.body.appendChild(downloadLink); // 需要把链接加到文档中
                    downloadLink.click();
                    document.body.removeChild(downloadLink); // 下载后移除该链接
                })
                .catch(err => {
                    console.error("Capture failed:", err);
                });
        }
    })

    // const newDiagramAction: UIAction = React.useMemo(() => ({
    //     disabled: false,
    //     icon: 'icon-new',
    //     label: texts.common.newDiagram,
    //     shortcut: 'MOD + N',
    //     tooltip: texts.common.newDiagramTooltip,
    //     onAction: doNew,
    // }), [doNew]);

    const saveDiagram: UIAction = React.useMemo(() => ({
        disabled: !canSave,
        icon: 'icon-save',
        label: texts.common.saveDiagramTooltip,
        shortcut: 'MOD + S',
        tooltip: texts.common.saveDiagramTooltip,
        onAction: doSave,
    }), [doSave, canSave]);

    const saveDiagramToFileAction: UIAction = React.useMemo(() => ({
        disabled: !canSave,
        icon: 'icon-save',
        label: texts.common.saveDiagramToFileTooltip,
        tooltip: texts.common.saveDiagramToFileTooltip,
        onAction: doSaveToFile,
    }), [doSaveToFile, canSave]);

    const saveDiagramToImage: UIAction = React.useMemo(() => ({
        disabled: !canSave,
        icon: 'icon-new',
        label: texts.common.exportDiagramToImageTooltip,
        tooltip: texts.common.exportDiagramToImageTooltip,
        onAction: doExportToImage,
    }), [doExportToImage, canSave]);

    const openDiagramAction: UIAction = React.useMemo(() => ({
        disabled: false,
        icon: 'icon-folder-open',
        label: texts.common.openFromFile,
        tooltip: texts.common.openFromFileTooltip,
        onAction: openHandler,
    }), [openHandler]);

    const generateSolution: UIAction = React.useMemo(() => ({
        disabled: false,
        icon: 'icon-generate',
        label: texts.common.generateDiagram,
        tooltip: texts.common.generateDiagramTooltip,
        onAction: () => {
            console.log('generateDiagram')
        },
    }), [])

    return { saveDiagramToImage, openDiagramAction, saveDiagram, saveDiagramToFile: saveDiagramToFileAction, generateSolution };
}
