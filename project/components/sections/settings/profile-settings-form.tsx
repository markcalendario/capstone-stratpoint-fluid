"use client";

import Button from "@/components/ui/buttons/button";
import ImageUpload from "@/components/ui/input-fields/image-upload";
import Input from "@/components/ui/input-fields/input";
import SectionLoader from "@/components/ui/section-loader";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { useEditProfile, useProfileEditData } from "@/hooks/use-user";
import { useClerk, useUser } from "@clerk/nextjs";
import { ChangeEvent, Fragment, useEffect, useState } from "react";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  newProfileFile: File | null;
}

export default function ProfileSettingsForm() {
  const { user } = useUser();
  const clerk = useClerk();

  const { isEditingProfile, editProfile } = useEditProfile(user?.id ?? "");

  const { isProfileEditDataLoading, profileEditData } = useProfileEditData(
    user?.id ?? ""
  );

  const [formData, setFormData] = useState<FormData>({
    email: "",
    imageUrl: "",
    lastName: "",
    firstName: "",
    newProfileFile: null
  });

  const handleSave = async () => {
    const { success, message } = await editProfile(formData);

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    clerk.user?.reload();
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, newProfileFile: file }));
  };

  useEffect(() => {
    if (!profileEditData?.data) return;

    const data = profileEditData.data;

    setFormData({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      imageUrl: data.imageUrl,
      newProfileFile: null
    });
  }, [profileEditData?.data]);

  if (isProfileEditDataLoading) return <SectionLoader text="Loading Profile" />;

  return (
    <Fragment>
      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
        Profile Settings
      </h3>

      <Input
        id="first-name"
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        placeholder="Enter your first name"
        required
      />

      <Input
        id="last-name"
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        placeholder="Enter your last name"
        required
      />

      <Input
        id="email-address"
        label="Email Address"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Enter your email"
        required
      />

      <ImageUpload
        id="imageUrl"
        label="Profile Picture"
        required
        onChange={handleProfileChange}
        placeholderImageUrl={formData.imageUrl}
      />

      <Button
        onClick={handleSave}
        isProcessing={isEditingProfile}
        className="bg-primary text-neutral-100">
        Save
      </Button>
    </Fragment>
  );
}
