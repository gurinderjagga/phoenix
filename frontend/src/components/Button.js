import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    onClick,
    type = 'button',
    className = '',
    disabled = false
}) => {
    const baseStyles = "relative uppercase tracking-widest font-bold text-xs md:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-none";

    const variants = {
        primary: "bg-primary-400 text-secondary-500 border border-primary", // Strong Contrast
        secondary: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-secondary",
        text: "text-primary hover:text-accent p-0 border-none",
        white: "bg-secondary text-primary"
    };

    if (variant === 'text') {
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`${baseStyles} ${variants[variant]} ${className}`}
            >
                {children}
            </button>
        );
    }

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant] || variants.primary} px-8 py-4 ${className}`}
        >
            {children}
        </motion.button>
    );
};

export default Button;
