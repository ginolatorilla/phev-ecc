import { ChangeEventHandler, ReactNode, useMemo } from "react";

/**
 * Dropdown selection with description
 * @param title Show this above the selection
 * @param options Array of options with name and description
 * @param choice The selected option, which must be the name of one of the options
 * @param onChange (Optional) Called when the selection changes
 * @param placeholder (Optional) Placeholder text to show when no option is selected
 * @param className (Optional) Additional CSS classes
 */
const SelectionWithDescription = ({
  title,
  options,
  choice,
  onChange,
  placeholder,
  className,
}: {
  title: string;
  choice: string;
  options: {
    name: string;
    description: string | ReactNode;
  }[];
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  placeholder?: string;
  className?: string;
}) => {
  const optionsMap = new Map(options.map((opt) => [opt.name, opt]));
  const selected = optionsMap.get(choice);
  const showPlaceholder = useMemo(() => placeholder !== undefined && choice.length === 0, [choice, placeholder]);

  return (
    <div className={`flex flex-col justify-center gap-2 ${className}`}>
      <label className="mb-1">{title}</label>
      <select
        className={`px-2 py-1 text-sm rounded-[0.15rem] hover:cursor-pointer ${showPlaceholder && "italic text-muted"}`}
        onChange={onChange}
        value={showPlaceholder ? placeholder : choice}
      >
        {showPlaceholder && <option disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.name}>{opt.name}</option>
        ))}
      </select>
      <div className="text-sm text-muted flex flex-col gap-2">{selected?.description}</div>
    </div>
  );
};

export default SelectionWithDescription;
