import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const Sidebar = ({ categories, selectedCategory, onSelectCategory }: SidebarProps) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm sticky top-24">
      <h3 className="font-semibold text-lg mb-4 px-2">Categories</h3>
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category}>
            <Button
              variant={selectedCategory === category ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                selectedCategory === category && "font-bold"
              )}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;