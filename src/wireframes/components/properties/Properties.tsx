 

import { Collapse } from 'antd';
import { CollapseProps } from 'antd/lib';
import classNames from 'classnames';
import { texts } from '@app/texts';
import { getDiagram, getSelection, useStore } from '@app/wireframes/model';
import { Colors } from './Colors';
import { CustomProperties } from './CustomProperties';
import { DiagramProperties } from './DiagramProperties';
import { LayoutProperties } from './LayoutProperties';
import { TransformProperties } from './TransformProperties';

const layoutItems: CollapseProps['items'] = [
    {
        key: 'layout',
        label: texts.common.layout,
        children: (
            <>
                <LayoutProperties />

                <TransformProperties />
            </>
        ),
    },
    {
        key: 'custom',
        label: texts.common.custom,
        children: <CustomProperties />,
    },
];

const diagramItems: CollapseProps['items'] = [
    {
        key: 'diagram',
        label: texts.common.diagram,
        children: <DiagramProperties />,
    },
    {
        key: 'colors',
        label: texts.common.colors,
        children: <Colors />,
    },
];

export const Properties = () => {
    const hasSelection = useStore(getSelection).selectedItems.length > 0;
    const hasDiagram = !!useStore(getDiagram);

    return (
        <>
            <Collapse className={(classNames({ hidden: !hasSelection }))} items={layoutItems}
                bordered={false} defaultActiveKey={['layout', 'visual', 'more', 'custom']} />

            <Collapse className={(classNames({ hidden: hasSelection || !hasDiagram }))} items={diagramItems}
                bordered={false} defaultActiveKey={['diagram', 'colors']} />
        </>
    );
};