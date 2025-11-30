import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  className?: string;
}

const ProgressBar = ({ value, className }: ProgressBarProps) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">Progresso</span>
        <span className="text-sm font-bold text-primary">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
};

export default ProgressBar;
