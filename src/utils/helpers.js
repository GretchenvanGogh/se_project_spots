export function setButtonText(btn, isLoading, loadingText = "Saving...") {
  const defaultText = btn.dataset.originalText;
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }
}
