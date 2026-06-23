import React from 'react';
import { motion } from 'framer-motion';
interface SkillBarProps {
  name: string;
  level: number;
  colorClass?: string;
  delay?: number;
}
export const SkillBar: React.FC<SkillBarProps> = ({
  name,
  level,
  colorClass = 'bg-accent-blue',
  delay = 0
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-primary">{name}</span>
        <span className="text-sm text-secondary font-medium">{level}%</span>
      </div>
      <div className="h-3 w-full bg-tertiary rounded-full overflow-hidden">
        <motion.div
          initial={{
            width: 0
          }}
          whileInView={{
            width: `${level}%`
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 1,
            delay,
            ease: 'easeOut'
          }}
          className={`h-full rounded-full ${colorClass}`} />
        
      </div>
    </div>);

};