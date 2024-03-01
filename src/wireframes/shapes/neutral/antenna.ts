import { DefaultAppearance, Rect2, RenderContext, ShapePlugin, Vec2 } from '@app/wireframes/interface';

const DEFAULT_APPEARANCE = {
    [DefaultAppearance.BACKGROUND_COLOR]: 0xbdbdbd,
    [DefaultAppearance.FOREGROUND_COLOR]: 0xb50202,
    [DefaultAppearance.STROKE_COLOR]: 0xb50202,
    [DefaultAppearance.STROKE_THICKNESS]: 4,
    [DefaultAppearance.TEXT_DISABLED]: true,
};

export class Antenna implements ShapePlugin {
    public identifier(): string {
        return 'Antenna';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 30, y: 30 };
    }

    public render(ctx: RenderContext) {
        const border = ctx.shape.strokeThickness;

        const radius = Math.min(ctx.rect.width, ctx.rect.height) * 0.5;

        const circleY = ctx.rect.height * 0.5;
        const circleX = ctx.rect.width - radius;

        const circleCenter = new Vec2(circleX, circleY);
        const circleSize = radius - border;

        // Circle.
        ctx.renderer2.ellipse(0, Rect2.fromCenter(circleCenter, circleSize), p => {
            p.setBackgroundColor(ctx.shape.strokeColor);
        });
    }
}
