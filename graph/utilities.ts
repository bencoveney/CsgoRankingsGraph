// Function to clear an element.
export function emptyElement(element: Element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
