import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  ({ className, type, errorMessage = null, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:outline-secondaryColor",
            className,
            errorMessage && " !outline-errorColor/50"
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <span className="text-errorColor">{errorMessage}</span>
        )}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
