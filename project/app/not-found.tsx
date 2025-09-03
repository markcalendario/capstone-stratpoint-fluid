import ErrorPage from "@/components/layouts/error-page";

export default function NotFound() {
  return (
    <ErrorPage
      code={404}
      title="Nice! You found... a Not Found page."
      description="Sorry, the page you are looking for is not found."
    />
  );
}
