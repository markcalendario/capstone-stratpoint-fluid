import ErrorPage from "@/components/layouts/error-page";

export default function Error() {
  return (
    <ErrorPage
      code={500}
      title="Oh dear, the magic hiccupped just now!"
      description="An unexpected error occured. It's not your fault."
    />
  );
}
