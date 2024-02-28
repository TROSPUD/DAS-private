import { RendererService } from '@app/wireframes/model/renderer.service';
import { Button, Heading, HorizontalLine, Image, Label, Raster, Rectangle, Shape, VerticalLine } from './dependencies';
import { AbstractControl } from './utils/abstract-control';

export function registerRenderers() {
    RendererService.addRenderer(new AbstractControl(new Button()));
    RendererService.addRenderer(new AbstractControl(new Heading()));
    RendererService.addRenderer(new AbstractControl(new HorizontalLine()));
    RendererService.addRenderer(new AbstractControl(new Image()));
    RendererService.addRenderer(new AbstractControl(new Label()));
    RendererService.addRenderer(new AbstractControl(new Raster()));
    RendererService.addRenderer(new AbstractControl(new Rectangle()));
    RendererService.addRenderer(new AbstractControl(new Shape()));
    RendererService.addRenderer(new AbstractControl(new VerticalLine()));
}
