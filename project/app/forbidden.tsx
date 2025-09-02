import ErrorPage from "@/components/layouts/error-page";

export default function Forbidden() {
  return (
    <ErrorPage
      code={403}
      title="No entry. Guard dogs say woof!"
      description="Sorry, you are not allowed to access this page."
    />
  );
}
