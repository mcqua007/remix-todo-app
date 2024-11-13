import Checkmark from "./icons/checkmark";

export interface CheckboxProps {
  disabled?: boolean;
  defaultChecked?: boolean;
  id: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
  name?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ className, onChange, ...props }: CheckboxProps) => (
  <div className={`relative flex gap-2 ${className}`}>
    <input
      className="disabled:border-slate-400 disabled:checked:bg-slate-400 peer relative size-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-slate-300 bg-white transition-colors checked:border-0 checked:bg-green-700 focus:outline-none focus:ring-2 checked:focus:ring-green-700/30  focus:ring-gray-400/30 focus:ring-offset-0"
      type="checkbox"
      data-slot="control"
      name={props?.name || "checkbox"}
      aria-label={props?.ariaLabel}
      onChange={onChange}
      {...props}
    />
    <Checkmark
      className="pointer-events-none absolute left-[1px] top-[-3px] mt-1 hidden size-3.5 fill-white stroke-white outline-none peer-checked:block"
      data-slot="icon"
    />
    {props.label && (
      <label htmlFor={props.id} data-slot="label">
        {props.label}
      </label>
    )}
  </div>
);

export default Checkbox;
