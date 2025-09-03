import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect, RedirectType } from "next/navigation";

export function dispatchError(code: number): never {
  const url = `/errors/${code}`;
  redirect(url, RedirectType.replace);
}

export function handleDispatchError(error: unknown): never {
  if (isRedirectError(error)) throw error;
  dispatchError(500);
}
