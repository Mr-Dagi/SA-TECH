import React from 'react';

interface BlogCategoryFilterProps {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
}

export const BlogCategoryFilter: React.FC<BlogCategoryFilterProps> = ({
  categories,
  selected,
  onChange
}) => {
  const allCategories = ['All', ...categories];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
      {allCategories.map((category) => {
        const isSelected = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-accent-orange text-white border-accent-orange shadow-md'
                : 'bg-secondary text-primary border-color hover:border-accent-orange hover:text-accent-orange'
            }`}
            aria-pressed={isSelected}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};
