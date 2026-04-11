import { Check, Bike, Ellipsis, MapPin } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { OrderStep } from '../model/types';

interface StatusStepProps {
  step: OrderStep;
  isLast?: boolean;
}

export function StatusStep({ step, isLast }: StatusStepProps) {
  const Icon = step.status === 'on_the_way' ? Bike : 
               step.status === 'delivered' ? MapPin :
               step.status === 'preparing' ? Ellipsis : Check;

  return (
    <div className="flex gap-md relative">
      {!isLast && (
        <div className="absolute left-[11px] top-[24px] bottom-[-24px] w-[2px] bg-surface-muted" />
      )}
      
      <div className={cn(
        "size-6 rounded-full flex items-center justify-center relative z-10 transition-colors",
        step.isActive ? "bg-brand-primary" : step.isCompleted ? "bg-text-secondary" : "bg-surface-muted"
      )}>
        <Icon className={cn(
          "size-4",
          step.isActive || step.isCompleted ? "text-text-inverse" : "text-text-muted"
        )} />
      </div>

      <div className="flex flex-col gap-1 pb-lg">
        <h4 className="text-h5-bold text-text-primary leading-none">
          {step.label}
        </h4>
        {step.time && (
          <span className="text-caption-inter text-text-secondary">
            {step.time}
          </span>
        )}
      </div>
    </div>
  );
}
