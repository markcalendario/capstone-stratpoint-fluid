import Button from "@/components/ui/buttons/button";
import { Filter, Search } from "lucide-react";

export default function SearchFilter() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute top-1/2 left-3 -translate-y-1/2 transform text-neutral-900 dark:text-neutral-200"
        />
        <input
          type="text"
          placeholder="Search projects..."
          className="border-primary/20 w-full rounded-sm border-2 bg-white py-2 pr-4 pl-10 text-neutral-800 placeholder-neutral-500 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200"
        />
      </div>
      <Button className="border-primary/20 border-2 bg-white text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
        <Filter size={16} />
        Filter
      </Button>
    </div>
  );
}
