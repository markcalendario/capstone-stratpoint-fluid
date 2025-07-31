import { cn } from "@/lib/utils";
import { Bell, Palette, Shield, User } from "lucide-react";
import Button from "./button";

type SettingsItem = {
  name: string;
  icon: React.ElementType;
  value: string;
};

type SettingsNavigationProps = {
  active: string;
  className?: string;
  onChange: (value: string) => void;
};

const items: SettingsItem[] = [
  { name: "Profile", icon: User, value: "profile" },
  { name: "Notifications", icon: Bell, value: "notifications" },
  { name: "Security", icon: Shield, value: "security" },
  { name: "Appearance", icon: Palette, value: "appearance" }
];

export default function SettingsNavigation({
  active,
  onChange,
  className
}: SettingsNavigationProps) {
  return (
    <div
      className={cn(
        className,
        "outline-primary/20 space-y-3 rounded-sm p-7 outline-2"
      )}>
      <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
        Settings
      </h3>
      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = active === item.value;
          const Icon = item.icon;

          return (
            <Button
              key={item.value}
              onClick={() => onChange(item.value)}
              className={`bg-primary/10 w-full justify-start text-neutral-700 dark:text-neutral-300 ${
                isActive && "bg-primary text-neutral-100"
              }`}>
              <Icon size={16} />
              {item.name}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
