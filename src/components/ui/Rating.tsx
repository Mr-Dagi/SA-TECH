import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useData } from '../../context/DataContext';
interface RatingProps {
  projectId: string;
  initialRating: number;
  totalVotes: number;
}
export const Rating: React.FC<RatingProps> = ({
  projectId,
  initialRating,
  totalVotes
}) => {
  const { rateProject } = useData();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  useEffect(() => {
    const votedProjects = JSON.parse(
      localStorage.getItem('votedProjects') || '[]'
    );
    if (votedProjects.includes(projectId)) {
      setHasVoted(true);
    }
  }, [projectId]);
  const handleRate = (rating: number) => {
    if (hasVoted) return;
    rateProject(projectId, rating);
    setHasVoted(true);
    const votedProjects = JSON.parse(
      localStorage.getItem('votedProjects') || '[]'
    );
    localStorage.setItem(
      'votedProjects',
      JSON.stringify([...votedProjects, projectId])
    );
  };
  return (
    <div className="flex items-center gap-4 bg-tertiary p-4 rounded-2xl inline-flex">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) =>
        <button
          key={star}
          disabled={hasVoted}
          onMouseEnter={() => !hasVoted && setHoveredStar(star)}
          onMouseLeave={() => !hasVoted && setHoveredStar(0)}
          onClick={() => handleRate(star)}
          className={`transition-all ${hasVoted ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}>
          
            <Star
            size={24}
            className={`
                ${(hoveredStar || Math.round(initialRating)) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400 dark:text-gray-600'}
                ${hasVoted ? 'opacity-80' : ''}
              `} />
          
          </button>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-none">
          {initialRating.toFixed(1)}
        </span>
        <span className="text-xs text-secondary">{totalVotes} votes</span>
      </div>
      {hasVoted &&
      <span className="text-xs text-accent-green font-medium ml-2 bg-accent-green/10 px-2 py-1 rounded-full">
          Voted
        </span>
      }
    </div>);

};