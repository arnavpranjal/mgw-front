import * as React from 'react';
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // Adjust the import path as per your icon library

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const [inputType, setInputType] = React.useState(type);

  const togglePasswordVisibility = () => {
    setInputType(prevType => prevType === 'password' ? 'text' : 'password');
  };

  return (
    <div className="relative flex items-center">
      <input
        type={inputType}
        className={cn(
          "w-full rounded-md border px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
      {type === 'password' && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
          {inputType === 'password' ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
