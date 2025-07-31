import toast from "react-hot-toast";

export function showSuccessToast(text: string) {
  return toast.success(text);
}

export function showErrorToast(text: string) {
  return toast.error(text);
}
