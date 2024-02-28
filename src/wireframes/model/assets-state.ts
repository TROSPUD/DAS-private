import { ShapePlugin } from './../interface';
import { RendererService } from './renderer.service';

export interface AssetInfo {
    // The name of the asset.
    name: string;

    // The display name.
    displayName: string;

    // The display search property.
    displaySearch: string;
}

export interface ShapeInfo extends AssetInfo {
    // The plugin.
    plugin: ShapePlugin;
}

export interface IconInfo extends AssetInfo {
    // The name of the icon.
    text: string;

    // The font family.
    fontFamily: string;

    // The font class.
    fontClass: string;
}

export interface AssetsState {

    // The shapes to show.
    shapes: ShapeInfo[];

    // The shapes filter.
    shapesFilter: string;
}

export const createInitialAssetsState: () => AssetsState = () => {
    const allShapes =
        RendererService.all().filter(x => x[1].plugin().showInGallery?.() !== false)
            .map(([name, renderer]) => {
                return {
                    plugin: renderer.plugin(),
                    displayName: name,
                    displaySearch: name,
                    name,
                };
            });

    return {
        shapes: allShapes,
        shapesFilter: ''
    };
};

export interface AssetsStateInStore {
    assets: AssetsState;
}
