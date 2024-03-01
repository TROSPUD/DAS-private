import { ConfigurableFactory, DefaultAppearance, Rect2, RenderContext, ShapePlugin, Vec2 } from '@app/wireframes/interface';

const STATE = 'Type';
const STATE_TYPEA = 'Amp BBU a';
const STATE_TYPEB = 'Amp BBU b';

const DEFAULT_APPEARANCE = {
  [DefaultAppearance.BACKGROUND_COLOR]: 0xbdbdbd,
  [DefaultAppearance.FOREGROUND_COLOR]: 0xb50202,
  [DefaultAppearance.STROKE_COLOR]: 0x008a22,
  [DefaultAppearance.STROKE_THICKNESS]: 4,
  [DefaultAppearance.TEXT_DISABLED]: true,
  [STATE]: STATE_TYPEA,
};

export class Bbu implements ShapePlugin {
  public identifier(): string {
    return 'Amp BBU';
  }

  public defaultAppearance() {
    return DEFAULT_APPEARANCE;
  }

  public defaultSize() {
    return { x: 30, y: 30 };
  }

  public configurables(factory: ConfigurableFactory) {
    return [
      factory.selection(STATE, 'Type', [
        STATE_TYPEA,
        STATE_TYPEB
      ]),
    ];
  }

  public render(ctx: RenderContext) {
    const border = ctx.shape.strokeThickness;

    const radius = Math.min(ctx.rect.width, ctx.rect.height) * 0.5;

    const state = ctx.shape.getAppearance(STATE);

    console.log(state, '<====type of Amp BBU selected')

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
