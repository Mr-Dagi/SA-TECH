import React from 'react';

interface BlogCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const BlogCategoryFilter: React.FC<BlogCategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {categories.map((category) => (
      <button
        key={category}
        type="button"
        onClick={() => onSelectCategory(category)}
        className={`rounded-full border px-4 py-2 text-sm transition ${
          selectedCategory === category ? 'bg-accent-blue text-white' : 'bg-secondary text-primary border-color'
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);
