const PROFILE = 'https://buymeacoffee.com/abhijithpsubash';

/**
 * The Buy Me a Coffee button.
 *
 * Rendered directly rather than loaded from cdnjs.buymeacoffee.com, because the
 * official widget emits its markup with `document.writeln()`. That only works
 * while the HTML parser is still running: injecting the script after load — the
 * only option on a prerendered React page — makes the write a silent no-op, so
 * the button never appears.
 *
 * This is the widget's own output for the configured data-* attributes (slug
 * abhijithpsubash, #FFDD00 on #000000, Cookie, ☕), with its styles in
 * index.css. Same button, no third-party request, and it ships in the
 * prerendered HTML instead of waiting on JavaScript.
 */
const BuyMeACoffeeButton = () => (
  <div className="flex justify-center">
    <a className="bmc-btn" target="_blank" rel="noopener noreferrer" href={PROFILE}>
      <span aria-hidden="true">☕</span>
      <span className="bmc-btn-text">Buy me a coffee</span>
    </a>
  </div>
);

export default BuyMeACoffeeButton;
