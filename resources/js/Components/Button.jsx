import { cn } from "@/lib/utils";

export default function Button({ className, variant = "primary", ...props }) {
    const variants = {
        primary: "btn-primary",
        glass: "btn-glass",
        secondary: "px-8 py-4 bg-white text-[#1A1A1A] font-bold rounded-xl hover:bg-[#E5E1DA] transition-all",
        outline: "px-8 py-4 bg-transparent border border-[#E5E1DA] text-[#1A1A1A] font-bold rounded-xl hover:bg-[#F5F5F5] transition-all",
    };

    return (
        <button
            className={cn(variants[variant], className)}
            {...props}
        />
    );
}
