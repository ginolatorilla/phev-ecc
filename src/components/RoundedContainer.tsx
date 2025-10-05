import { ReactNode } from "react";

/** General purpose rounded container with a light border
 * @param title Show this text atop the container
 * @param caption (Optional) Show this HTML below the title
 * @param children (Optional) The main content of the container
 * @param className (Optional) Additional CSS classes
 * @param innerClassName (Optional) Additional CSS classes for the inner container, which wraps `children`
 */
const RoundedContainer = ({
  title,
  caption,
  children,
  className,
  innerClassName,
}: {
  title: string;
  caption?: ReactNode;
  children?: ReactNode;
  className?: string;
  innerClassName?: string;
}) => {
  return (
    <div className={`border-outline flex flex-col gap-4 rounded-lg border p-4 ${className}`}>
      <h1 className="text-xl font-bold">{title}</h1>
      {caption}
      <div className={`flex grow gap-4 ${innerClassName ?? "flex-col"}`}>{children}</div>
    </div>
  );
};

export default RoundedContainer;
