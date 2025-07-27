import { ChangeEventHandler } from "react";

/** Combines a range slider and a number input
 * @param min Minimum value for the slider and number input
 * @param max Maximum value for the number input
 * @param rangeMax (Optional) Maximum value for the slider (defaults to `max`). Set this to a smaller value to limit the range of the slider.
 * @param value Current value of the slider and number input
 * @param onChange (Optional) Called when either the slider or number input changes
 * @param label (Optional) Show this text above the slider
 * @param caption (Optional) Show this text below the slider
 * @param className (Optional) Additional CSS classes
 */
const RangeNumber = ({
  min,
  max,
  rangeMax,
  value,
  onChange,
  label,
  caption,
  className,
}: {
  min: number;
  max: number;
  rangeMax?: number;
  value: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  label?: string;
  caption?: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      {label && <label className="mb-2">{label}</label>}
      <div className="flex flex-row items-center justify-between">
        <input
          className="w-full hover:cursor-pointer"
          type="range"
          min={min}
          value={value}
          max={rangeMax ?? max}
          onChange={onChange}
          step={0.1}
        />
        <input
          className="border-outline ml-2 px-1 py-1 text-right text-sm rounded-[0.15rem] hover:cursor-pointer"
          type="number"
          min={min}
          value={value}
          max={max}
          onChange={onChange}
          step={0.1}
          inputMode="decimal"
          aria-label="Enter a number"
        />
      </div>
      <label className="text-muted text-sm">{caption}</label>
    </div>
  );
};

export default RangeNumber;
