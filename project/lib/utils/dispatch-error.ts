import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect, RedirectType } from "next/navigation";
import { ZodError } from "zod";

export function dispatchError(code: number) {
  const url = `/errors/${code}`;
  redirect(url, RedirectType.replace);
}

export function handleDispatchError(error: unknown) {
  if (isRedirectError(error)) throw error;

  if (error instanceof ZodError) {
    return { success: false, message: error.issues[0].message };
  }

  dispatchError(500);
}
