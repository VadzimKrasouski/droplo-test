import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function NavigationEmpty({ onAddItem }: { onAddItem: () => void }) {
  return (
    <div className="menu-container py-6 h-40 bg-secondary border-border-secondary">
      <div className="menu-item flex-col flex-1 justify-between">
        <div className="flex flex-col items-center gap-1">
          <h3 className="h5">Menu jest puste</h3>
          <span className="subtitle-1">
            W tym menu nie ma jeszcze żadnych linków.
          </span>
        </div>
        <div className="flex justify-center">
          <Button className="primary-btn" onClick={onAddItem}>
            <PlusCircle />
            <span className="px-0.5">Dodaj pozycję menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
