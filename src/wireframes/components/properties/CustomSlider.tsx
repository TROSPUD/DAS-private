 

import { Slider } from 'antd';
import * as React from 'react';
import { useEffect } from 'react';

interface CustomSliderProps {
    // The slider value.
    value: number;

    // The minimum slider value.
    min: number;

    // The maximum slider value.
    max: number;

    // Change the items appearance..
    onChange: (value: number) => void;
}

export const CustomSlider = React.memo(({ max, min, onChange, value }: CustomSliderProps) => {
    const [sliderValue, setSliderValue] = React.useState<number>(value);

    useEffect(() => {
        setSliderValue(value);
    }, [value]);

    return (
        <Slider
            value={sliderValue}
            min={min}
            max={max}
            onChange={setSliderValue}
            onAfterChange={onChange} />
    );
});
