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
    const baseStyles = "relative uppercase tracking-widest font-bold text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-none";

    const variants = {
        primary: "bg-primary text-secondary border border-primary",
        secondary: "bg-transparent text-primary border border-primary",
        text: "text-primary p-0 border-none",
        white: "bg-secondary text-primary border border-secondary"
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
