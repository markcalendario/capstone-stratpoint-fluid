import toast from "react-hot-toast";

export function showSuccessToast(text: string) {
  return toast.success(text);
}

export function showErrorToast(text: string) {
  return toast.error(text);
}

export function showActionToast(
  text: string,
  buttonText: string,
  onClick: () => void
) {
  return toast((t) => (
    <div className="flex items-center justify-between gap-4 text-sm text-gray-900">
      <span>{text}</span>
      <button
        onClick={() => {
          onClick();
          toast.dismiss(t.id);
        }}
        className="text-primary cursor-pointer font-medium transition hover:underline">
        {buttonText}
      </button>
    </div>
  ));
}
