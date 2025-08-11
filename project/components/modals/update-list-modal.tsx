import { getListById, updateList } from "@/lib/actions/lists";
import { ProjectSchema } from "@/types/projects";
import { GitCommitHorizontal, GitGraph } from "lucide-react";
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from "react";
import Button from "../button";
import Input from "../input";
import Radio from "../radio";
import { showErrorToast, showSuccessToast } from "../ui/toast";
import Modal from "./modal";

interface UpdateListModalProps {
  toggle: () => void;
  id: ProjectSchema["id"];
}

export function UpdateListModal({ id, toggle }: UpdateListModalProps) {
  const [formData, setFormData] = useState({ name: "", listType: "progress" });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateList = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    const payload = {
      id,
      name: formData.name,
      isFinal: formData.listType === "terminal"
    };

    const { success, message } = await updateList(payload);
    if (!success) return showErrorToast(message);

    showSuccessToast(message);
    toggle();
  };

  const fetchListData = useCallback(async () => {
    const { success, message, list } = await getListById({ id });

    if (!success || !list) return showErrorToast(message);

    setFormData({
      name: list.name,
      listType: list.isFinal ? "terminal" : "progress"
    });
  }, [id]);

  useEffect(() => {
    fetchListData();
  }, [fetchListData]);

  return (
    <Modal
      toggle={toggle}
      title="Update Board List">
      <form className="space-y-4">
        <Input
          id="name"
          name="name"
          label="List Name"
          placeholder="Enter list name"
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
            icon={GitGraph}
            checked={formData.listType === "progress"}
            onChange={handleChange}
          />

          <Radio
            id="terminal"
            name="listType"
            value="terminal"
            title="Terminal"
            description="Mark tasks as final."
            icon={GitCommitHorizontal}
            checked={formData.listType === "terminal"}
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
            className="bg-primary text-neutral-100">
            Update List
          </Button>
        </div>
      </form>
    </Modal>
  );
}
