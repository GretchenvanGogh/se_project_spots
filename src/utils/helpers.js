export function setButtonText(
  btn,
  isLoading,
  //defaultText = "Save",
  loadingText = "Saving..."
) {
  const defaultText = btn.textContent;
  if (isLoading) {
    //set loading text
    btn.textContent = loadingText;
  } else {
    //set not loading text
    btn.textContent = defaultText;
  }
}
