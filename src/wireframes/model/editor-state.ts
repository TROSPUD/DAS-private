import { Color, ImmutableList, ImmutableMap, MathHelper, Record, Vec2 } from '@app/core/utils';
import { Diagram } from './diagram';
import { UndoableState } from './undoable-state';

type Diagrams = ImmutableMap<Diagram>;
type DiagramIds = ImmutableList<string>;

type Props = {
    // The id of the selected diagram.
    selectedDiagramId?: string | null;

    // The actual diagrams.
    diagrams: Diagrams;

    // The list of ordered diagram ids.
    diagramIds: DiagramIds;

    // The size of all diagrams.
    size: Vec2;

    // The id of the state.
    id: string;

    // The color for all diagrams.
    color: Color;

    // The background image of diagram.
    backgroundImg?: string;

    // The Scale of diagram.
    // 以米/1坐标为全局单位
    scale?: number;

};

export type InitialEditorProps = {
    // The actual diagrams.
    diagrams?: { [id: string]: Diagram } | ImmutableMap<Diagram>;

    // The list of ordered diagram ids.
    diagramIds?: ReadonlyArray<string> | DiagramIds;

    // The size of all diagrams.
    size?: Vec2;

    // The color for all diagrams.
    color?: Color;

    // The background image of diagram.
    backgroundImg?: string;

    // The Scale of diagram.
    scale?: number;

};

export class EditorState extends Record<Props> {
    public get id() {
        return this.get('id');
    }

    public get selectedDiagramId() {
        return this.get('selectedDiagramId');
    }

    public get diagrams() {
        return this.get('diagrams');
    }

    public get diagramIds() {
        return this.get('diagramIds');
    }

    public get color() {
        return this.get('color');
    }

    public get size() {
        return this.get('size');
    }

    public get backgroundImg() {
        return this.get('backgroundImg')
    }

    public get scale() {
        return this.get('scale')
    }

    public get orderedDiagrams(): ReadonlyArray<Diagram> {
        return this.findDiagrams(this.diagramIds.values);
    }

    public static create(setup: InitialEditorProps = {}): EditorState {
        const { color, diagrams, diagramIds, size, backgroundImg, scale } = setup;

        const props: Props = {
            color: color || Color.BLUE,
            diagrams: ImmutableMap.of(diagrams),
            diagramIds: ImmutableList.of(diagramIds),
            id: MathHelper.guid(),
            size: size || new Vec2(800, 800),
            backgroundImg: backgroundImg || '',
            scale: scale
        };

        return new EditorState(props);
    }

    public findDiagrams(ids: ReadonlyArray<string>) {
        const result: Diagram[] = [];

        for (const id of ids) {
            const item = this.diagrams.get(id);

            if (item) {
                result.push(item);
            }
        }

        return result;
    }

    public changeSize(size: Vec2) {
        return this.set('size', size);
    }

    public changeColor(color: Color) {
        return this.set('color', color);
    }

    public changeBackgroundImg(backgroundImg: string) {
        return this.set('backgroundImg', backgroundImg);
    }

    public changeScale(scale: number) {
        return this.set('scale', scale);
    }

    public moveDiagram(diagramId: string, index: number) {
        return this.set('diagramIds', this.diagramIds.moveTo([diagramId], index));
    }

    public updateDiagram(diagramId: string, updater: (value: Diagram) => Diagram) {
        return this.set('diagrams', this.diagrams.update(diagramId, updater));
    }

    public updateAllDiagrams(updater: (value: Diagram) => Diagram) {
        return this.set('diagrams', this.diagrams.updateAll(updater));
    }

    public selectDiagram(diagramId: string | null | undefined) {
        if (!this.diagrams.get(diagramId!)) {
            return this;
        }

        return this.set('selectedDiagramId', diagramId);
    }

    public removeDiagram(diagramId: string) {
        return this.merge({
            diagrams: this.diagrams.remove(diagramId),
            diagramIds: this.diagramIds.remove(diagramId),
            selectedDiagramId: this.selectedDiagramId ? null : this.selectedDiagramId,
        });
    }

    public addDiagram(diagram: Diagram) {
        if (!diagram || this.diagrams.get(diagram.id)) {
            return this;
        }

        return this.merge({
            diagrams: this.diagrams.set(diagram.id, diagram),
            diagramIds: this.diagramIds.add(diagram.id),
        });
    }
}

export interface EditorStateInStore {
    editor: UndoableState<EditorState>;
}
