import { deleteList } from "@/lib/actions/lists";
import { ListSchema } from "@/types/lists";
import { useUser } from "@clerk/nextjs";
import { ChangeEvent, useState } from "react";
import Button from "../button";
import Input from "../input";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface DeleteListModalProps {
  toggle: () => void;
  listId: ListSchema["id"];
  refetchLists: () => void;
}

export function DeleteListModal({
  toggle,
  listId,
  refetchLists
}: DeleteListModalProps) {
  const TARGET_CONFIRM_TEXT = "DELETE LIST";

  const { user } = useUser();
  const [confirmText, setConfirmText] = useState("");

  const handleConfirmChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setConfirmText(evt.target.value);
  };

  const handleDeleteList = async () => {
    if (!user?.id) return null;

    if (confirmText !== TARGET_CONFIRM_TEXT) {
      return showErrorToast("Wrong delete confirmation value.");
    }

    const { success, message } = await deleteList({
      id: listId,
      userClerkId: user.id
    });

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
    refetchLists();
  };

  return (
    <Modal
      toggle={toggle}
      title="Delete List">
      <div className="space-y-3">
        <Input
          id="confirm-delete"
          value={confirmText}
          placeholder="DELETE LIST"
          onChange={handleConfirmChange}
          label={`Type ${TARGET_CONFIRM_TEXT} to delete this list.`}
        />
        <div className="flex justify-end gap-2">
          <Button
            onClick={toggle}
            className="bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteList}
            className="bg-red-700 text-neutral-100">
            Delete List
          </Button>
        </div>
      </div>
    </Modal>
  );
}
