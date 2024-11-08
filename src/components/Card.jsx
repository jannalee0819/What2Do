// components/Card/index.js
export const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl border shadow-sm ${className}`}>
        {children}
    </div>
);

export const CardHeader = ({ children, className = "" }) => (
    <div className={`p-4 border-b ${className}`}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-xl font-bold text-gray-800 ${className}`}>
        {children}
    </h3>
);

export const CardDescription = ({ children, className = "" }) => (
    <p className={`text-sm text-gray-500 mt-1 ${className}`}>
        {children}
    </p>
);

export const CardContent = ({ children, className = "" }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = "" }) => (
    <div className={`p-4 border-t ${className}`}>
        {children}
    </div>
);