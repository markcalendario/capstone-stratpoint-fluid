"use client";

import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import AppearanceSettingsForm from "@/components/sections/settings/appearance-settings-form";
import NotificationsSettingsForm from "@/components/sections/settings/notifications-settings-form";
import ProfileSettingsForm from "@/components/sections/settings/profile-settings-form";
import SecuritySettingsForm from "@/components/sections/settings/security-settings-form";
import SettingsNavigation from "@/components/sections/settings/settings-navigation";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderActiveForm = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettingsForm />;
      case "notifications":
        return <NotificationsSettingsForm />;
      case "security":
        return <SecuritySettingsForm />;
      case "appearance":
        return <AppearanceSettingsForm />;
      default:
        return null;
    }
  };

  return (
    <DashboardContent
      title="Settings"
      description="Manage your account and application preferences">
      <div className="space-y-6">
        {/* Settings Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <SettingsNavigation
              active={activeTab}
              onChange={setActiveTab}
              className="col-span-2 bg-white dark:bg-neutral-800"
            />
          </div>

          {/* Settings Content */}
          <div className="outline-primary/20 space-y-3 rounded-xs bg-white p-7 outline-1 lg:col-span-2 dark:bg-neutral-800">
            {renderActiveForm()}
          </div>
        </div>
      </div>
    </DashboardContent>
  );
}
