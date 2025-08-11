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
        return (
          <ProfileSettingsForm className="col-span-2 bg-white dark:bg-neutral-800" />
        );
      case "notifications":
        return (
          <NotificationsSettingsForm className="col-span-2 bg-white dark:bg-neutral-800" />
        );
      case "security":
        return (
          <SecuritySettingsForm className="col-span-2 bg-white dark:bg-neutral-800" />
        );
      case "appearance":
        return (
          <AppearanceSettingsForm className="col-span-2 bg-white dark:bg-neutral-800" />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardContent
      title="Settings"
      description="Manage your account and application preferences">
      <div className="space-y-6">
        {/* Implementation Tasks Banner */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
            ⚙️ Settings Implementation Tasks
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            <li>• Task 2.4: Implement user session management</li>
            <li>
              • Task 6.4: Implement project member management and permissions
            </li>
          </ul>
        </div>

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
          {renderActiveForm()}
        </div>
      </div>
    </DashboardContent>
  );
}
