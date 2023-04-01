export default function handleErrors(error) {
  const searchParams = new URLSearchParams(window.location.search);
  const shouldRenderError = searchParams.get("renderError");

  console.error(error);

  if (shouldRenderError) {
    const body = document.querySelector("body");
    const errorContainer = document.createElement("div");
    errorContainer.textContent = error;
    body.append(errorContainer);
  }
}