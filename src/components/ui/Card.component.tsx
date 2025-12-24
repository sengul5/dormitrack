import React from 'react';

// --- Types ---
interface CardProps {
    children: React.ReactNode;
    className?: string;
}

interface CardHeaderProps extends CardProps {
    variant?: 'default' | 'blue' | 'red' | 'gray';
}

interface CardTitleProps {
    children: React.ReactNode;
    icon?: React.ElementType;
    className?: string;
}

// --- Components ---

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', variant = 'default' }) => {
    const variants: Record<string, string> = {
        default: 'bg-white border-b border-gray-100',
        blue: 'bg-blue-600 text-white',
        red: 'bg-red-50 border-b border-red-100 text-red-600',
        gray: 'bg-gray-50/30 border-b border-gray-100'
    };

    return (
        <div className={`p-4 flex items-center justify-between ${variants[variant] || variants.default} ${className}`}>
            {children}
        </div>
    );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
    return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, icon: Icon, className = '' }) => {
    return (
        <h3 className={`font-bold flex items-center gap-2 ${className}`}>
            {Icon && <Icon size={20} />}
            {children}
        </h3>
    );
};