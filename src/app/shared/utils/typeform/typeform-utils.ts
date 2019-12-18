/**
 * This is a fix for being able to scroll after closing the Typeform modal in iPad and iPhone. The navigation
 * flow for entering the Typeform in this devices is set in a way that the child form close button is not visible,
 * so whenever we want to close the Typeform we have to close the main modal and not the child element, which makes a
 * css class that blocks the scroll to stick around. With this hack we aim to manually delete it on the modal close
 * event.
 */
export function enableScrollAfterTypeformClose(): void {
  const isAppleMobileDevice =
    window.navigator.userAgent.match(/iPad/i) ||
    window.navigator.userAgent.match(/iPhone/i);

  if ( isAppleMobileDevice ) {
    const el = document.querySelector( '.__typeform-embed-mobile-modal-open' );
    if (el) { el.className = ''; }
  }
}
