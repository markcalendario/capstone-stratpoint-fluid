import { useCreateTaskDiscussion } from "@/hooks/use-task-discussions";
import { TaskSchema } from "@/types/tasks";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import Button from "./buttons/button";
import RichTextEditor from "./input-fields/rich-text-editor";
import SectionLoader from "./section-loader";
import { showErrorToast, showSuccessToast } from "./toast";

interface CommentBoxProps {
  taskId: TaskSchema["id"];
}

export default function CommentBox({ taskId }: CommentBoxProps) {
  const user = useClerk();
  const [comment, setComment] = useState("");

  const { isCreatingTaskDiscussion, createTaskDiscussion } =
    useCreateTaskDiscussion(taskId);

  const handleChangeComment = (evt: ChangeEvent<HTMLInputElement>) => {
    setComment(evt.target.value);
  };

  const handlePostComment = async () => {
    const { success, message } = await createTaskDiscussion({
      taskId,
      content: comment
    });

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    setComment("");
  };

  if (!user.user) {
    return <SectionLoader text="Loading" />;
  }

  return (
    <div className="flex items-start gap-5">
      <Image
        width={30}
        height={30}
        alt="user"
        src={user.user.imageUrl}
        className="rounded-full"
      />
      <div className="ring-primary/20 w-full space-y-2 rounded-sm bg-white p-4 ring-1 dark:bg-neutral-800">
        <RichTextEditor
          id="comment"
          name="comment"
          value={comment}
          label="Comment"
          placeholder="Comment"
          onChange={handleChangeComment}
          required
        />

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handlePostComment}
            isProcessing={isCreatingTaskDiscussion}
            className="bg-primary px-3 py-2 text-xs text-neutral-100">
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
