import { useListEditData, useUpdateList } from "@/hooks/use-lists";
import { ProjectSchema } from "@/types/projects";
import { CircleDashed, CircleDot } from "lucide-react";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Button from "../buttons/button";
import Input from "../input-fields/input";
import Radio from "../input-fields/radio";
import SectionLoader from "../section-loader";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface UpdateListModalProps {
  toggle: () => void;
  id: ProjectSchema["id"];
}

export function UpdateListModal({ id, toggle }: UpdateListModalProps) {
  const [formData, setFormData] = useState({ name: "", listType: "" });
  const { isListUpdating, updateList } = useUpdateList(id);
  const { isListLoading, listData } = useListEditData(id);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateList = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    const payload = {
      id,
      name: formData.name,
      isFinal: formData.listType === "final"
    };

    const { success, message } = await updateList(payload);
    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
  };

  useEffect(() => {
    if (!listData?.list) return;

    setFormData({
      name: listData.list.name,
      listType: listData.list.isFinal ? "final" : "progress"
    });
  }, [listData]);

  return (
    <Modal
      toggle={toggle}
      title="Update Board List">
      {isListLoading && <SectionLoader text="Loading List Data" />}

      {!isListLoading && (
        <form className="space-y-4">
          <Input
            id="name"
            name="name"
            label="List Name"
            placeholder="Enter list name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <div className="flex gap-3">
            <Radio
              id="progress"
              name="listType"
              value="progress"
              title="Progress"
              description="Mark tasks in progress."
              icon={CircleDashed}
              checked={formData.listType === "progress"}
              onChange={handleChange}
            />

            <Radio
              id="final"
              name="listType"
              value="final"
              title="Final"
              description="Mark tasks as final."
              icon={CircleDot}
              checked={formData.listType === "final"}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={toggle}
              className="text-neutral-800 dark:text-neutral-100">
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleUpdateList}
              isProcessing={isListUpdating}
              className="bg-primary text-neutral-100">
              Update List
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
