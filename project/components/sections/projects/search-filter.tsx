import { Search } from "lucide-react";
import { ChangeEvent } from "react";

interface SearchFilterProps {
  onSearchTextChange: (text: string) => void;
}

export default function SearchFilter({
  onSearchTextChange
}: SearchFilterProps) {
  const handleSearchTextChange = (evt: ChangeEvent<HTMLInputElement>) => {
    onSearchTextChange(evt.target.value);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute top-1/2 left-3 -translate-y-1/2 transform text-neutral-900 dark:text-neutral-200"
        />
        <input
          type="text"
          onChange={handleSearchTextChange}
          placeholder="Search projects by name"
          className="border-primary/20 w-full rounded-sm border-1 bg-white py-2 pr-4 pl-10 text-neutral-800 placeholder-neutral-500 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200"
        />
      </div>
    </div>
  );
}
