import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type ThumbAriaProps = Pick<React.AriaAttributes, "aria-label" | "aria-labelledby" | "aria-valuetext">;

/**
 * Slider (Radix) com área de toque confortável no celular.
 * Atributos ARIA são repassados ao "thumb", que é o elemento com role="slider".
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & ThumbAriaProps
>(({ className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-valuetext": ariaValueText, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center py-2", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-valuetext={ariaValueText}
      className="block h-6 w-6 cursor-grab rounded-full border-[3px] border-primary bg-white shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 active:scale-110 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
