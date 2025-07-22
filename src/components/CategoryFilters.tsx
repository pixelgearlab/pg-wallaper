import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilters = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFiltersProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className={cn(
            "rounded-full",
            selectedCategory === category &&
              "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilters;