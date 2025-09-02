import ErrorPage from "@/components/layouts/error-page";

export default function Unauthorized() {
  return (
    <ErrorPage
      code={401}
      title="You found a door, not the key."
      description="Sorry, you are not authorized to access this page."
    />
  );
}
