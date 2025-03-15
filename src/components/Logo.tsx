
import { Cpu } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo = ({ size = 'md', withText = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`bg-gradient-to-br from-purple-500 to-green-400 p-1.5 rounded-lg ${sizeClasses[size]}`}>
        <Cpu className="text-white h-full w-full" />
      </div>
      {withText && (
        <h1 className={`font-bold ${textSizeClasses[size]}`}>
          <span className="text-purple-600">Makers</span>
          <span className="text-green-500">Tech</span>
        </h1>
      )}
    </div>
  );
};

export default Logo;
