import { AlertTriangle } from 'lucide-react';

interface MissingDataBannerProps {
  message: string;
  className?: string;
}

const MissingDataBanner = ({ message, className = '' }: MissingDataBannerProps) => {
  return (
    <div className={`flex items-center gap-2.5 p-3 rounded-xl border border-accent-low/30 bg-accent-low/5 ${className}`}>
      <AlertTriangle size={16} className="text-accent-low shrink-0" />
      <p className="text-xs text-muted-foreground font-satoshi-medium leading-snug">{message}</p>
    </div>
  );
};

export default MissingDataBanner;
