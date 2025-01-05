import * as React from 'react';

import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
    ({ className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const [typeInput, setTypeInput] = React.useState(type);

        return (
            <div className="relative">
                <input
                    type={typeInput}
                    className={cn(
                        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                {type === 'password' &&
                    (!showPassword ? (
                        <EyeOff
                            size={14}
                            className="absolute right-3 top-[50%] -translate-y-1/2 cursor-pointer"
                            onClick={() => {
                                setShowPassword(true);
                                setTypeInput('text');
                            }}
                        />
                    ) : (
                        <Eye
                            size={14}
                            className="absolute right-3 top-[50%] -translate-y-1/2 cursor-pointer"
                            onClick={() => {
                                setShowPassword(false);
                                setTypeInput('password');
                            }}
                        />
                    ))}
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
