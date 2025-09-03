export interface TabItem {
  label: string;
  value: string;
}

interface SliderTabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (tab: TabItem["value"]) => void;
}

export default function SliderTabs({
  tabs,
  active,
  onChange
}: SliderTabsProps) {
  const activeStyle = "bg-primary text-white";
  const baseStyle =
    "text-xs cursor-pointer font-medium py-2 px-4 transition-colors duration-100";
  const inactiveStyle =
    "bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 hover:bg-primary hover:text-white";

  return (
    <div className="inline-flex flex-wrap overflow-hidden rounded-xs">
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        const style = `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`;

        return (
          <button
            key={tab.value}
            className={style}
            onClick={() => onChange(tab.value)}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
