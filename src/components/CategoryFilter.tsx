import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className="cursor-pointer whitespace-nowrap"
          onClick={() =>
            onSelectCategory(selectedCategory === category ? "" : category)
          }
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}