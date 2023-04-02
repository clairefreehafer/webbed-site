export default function handleErrors(error) {
  const searchParams = new URLSearchParams(window.location.search);
  const shouldRenderError = searchParams.get("renderError");

  console.error(error);

  if (shouldRenderError === "true") {
    const body = document.querySelector("body");
    const errorContainer = document.createElement("div");
    errorContainer.style.color = "red";
    errorContainer.textContent = error;
    body.append(errorContainer);
  }
}