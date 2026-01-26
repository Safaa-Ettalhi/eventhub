import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Chargement...' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className={`${sizeClasses[size]} spinner border-primary-600`}></div>
        <Loader2 className={`${sizeClasses[size]} absolute top-0 left-0 animate-spin text-primary-600`} />
      </div>
      {text && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
