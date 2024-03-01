import { RendererService } from '@app/wireframes/model/renderer.service';
import { HorizontalLine, Label, Raster, Antenna, VerticalLine, Bbu, PowerDivider } from './dependencies';
import { AbstractControl } from './utils/abstract-control';

export function registerRenderers() {
    RendererService.addRenderer(new AbstractControl(new HorizontalLine()));
    RendererService.addRenderer(new AbstractControl(new VerticalLine()));
    RendererService.addRenderer(new AbstractControl(new Antenna()));
    RendererService.addRenderer(new AbstractControl(new Bbu()));
    RendererService.addRenderer(new AbstractControl(new PowerDivider()));
    RendererService.addRenderer(new AbstractControl(new Label()));
    RendererService.addRenderer(new AbstractControl(new Raster()));

}
