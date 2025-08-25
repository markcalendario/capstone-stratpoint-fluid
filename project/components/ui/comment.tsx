import Image from "next/image";

interface CommentProps {
  content: string;
  isEdited: boolean;
  authorName: string;
  authorImage: string;
  lastModified: string;
  isUserDiscussion: boolean;
}

export default function Comment({
  content,
  isEdited,
  authorName,
  authorImage,
  lastModified,
  isUserDiscussion
}: CommentProps) {
  return (
    <div className="flex items-start gap-5">
      <Image
        width={30}
        height={30}
        alt={authorName}
        src={authorImage}
        className="rounded-full"
      />
      <div className="ring-primary/20 w-full space-y-2 rounded-sm bg-white p-4 ring-1 dark:bg-neutral-800">
        <p className="text-sm leading-none font-medium text-neutral-700 dark:text-neutral-300">
          {isUserDiscussion ? "You" : authorName}
        </p>

        <p className="text-xs leading-none text-neutral-500">
          {isEdited ? "Edited" : "Posted"} {lastModified}
        </p>
        <p className="rounded-sm bg-neutral-100 p-3 text-sm leading-5 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
          {content}
        </p>
      </div>
    </div>
  );
}
