type BarConfig1 = {
    type: 'bar';
    vertical: 'top';
    outside: true;
};

type BarConfig2 = {
    type: 'bar';
    vertical: 'top';
    outside: false;
};

type BarConfig3 = {
    type: 'bar';
    vertical: 'bottom';
};

type CircleConfig1 = {
    type: 'circle';
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
    showPercentage: boolean;
};

export type ScrollProgressIndicatorConfig = BarConfig1 | BarConfig2 | BarConfig3 | CircleConfig1;