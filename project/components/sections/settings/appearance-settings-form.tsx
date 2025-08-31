import Select from "@/components/ui/input-fields/select/select";
import { Theme, useTheme } from "@/components/ui/theme-provider";
import { Fragment } from "react";

export default function AppearanceSettingsForm() {
  const { theme, setTheme } = useTheme();

  const handleSelectTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as Theme);
  };

  return (
    <Fragment>
      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
        Select Theme
      </h3>

      <Select
        id="theme"
        label="Select Theme"
        value={theme}
        onChange={handleSelectTheme}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </Select>
    </Fragment>
  );
}
