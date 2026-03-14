import { Sparkles } from 'lucide-react';

interface AiBadgeProps {
  label?: string;
  className?: string;
}

const AiBadge = ({ label = 'Généré par IA', className = '' }: AiBadgeProps) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-satoshi-medium ${className}`}>
      <Sparkles size={10} />
      {label}
    </span>
  );
};

export default AiBadge;
