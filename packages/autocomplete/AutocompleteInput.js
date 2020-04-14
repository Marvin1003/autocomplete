import { LitElement, css, html } from 'lit-element'
import customEvent from './util/customEvent.js'
import uniqueId from './util/uniqueId.js'
import store, { input } from './store.js'

class AutocompleteInput extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      input {
        font-size: inherit;
        appearance: none;
        border: none;
        background: transparent;
        padding: 0;
        margin: 0;
        outline: none;
      }
    `
  }

  static get properties() {
    return {
      id: { type: String, reflect: true },
      list: { type: String, reflect: true },
      value: { type: String, reflect: true },
      role: { type: String, reflect: true },
      autocomplete: { type: String, reflect: true },
      autocapitalize: { type: String, reflect: true },
      autocorrect: { type: String, reflect: true },
      spellcheck: { type: String, reflect: true },
      ariaAutocomplete: {
        type: String,
        attribute: 'aria-autocomplete',
        reflect: true,
      },
      ariaHasPopup: { type: String, attribute: 'aria-haspopup', reflect: true },
      ariaOwns: { type: String, attribute: 'aria-owns', reflect: true },
      ariaExpanded: { type: String, attribute: 'aria-expanded', reflect: true },
      ariaActiveDescendant: {
        type: String,
        attribute: 'aria-activedescendant',
        reflect: true,
      },
    }
  }

  constructor() {
    super()
    this.id = uniqueId('autocomplete-input-')
    this.value = ''
    this.role = 'combobox'
    this.autocomplete = 'off'
    this.autocapitalize = 'off'
    this.autocorrect = 'off'
    this.spellcheck = 'false'
    this.ariaAutocomplete = 'list'
    this.ariaHasPopup = 'listbox'
    this.ariaExpanded = 'false'
  }

  connectedCallback() {
    super.connectedCallback()
    this.dispatchEvent(
      new Event('input', { bubbles: true, cancelable: true, composed: true })
    )
  }

  handleInput(event) {
    this.value = event.target.value
  }

  render() {
    return html`
      <input
        value=${this.value}
        autocomplete=${this.autocomplete}
        autocapitalize=${this.autocapitalize}
        autocorrect=${this.autocorrect}
        spellcheck=${this.spellcheck}
        @input=${this.handleInput}
      />
    `
  }
}

class ConnectedAutocompleteInput extends AutocompleteInput {
  #unsubscribe = () => {}

  connectedCallback() {
    super.connectedCallback()
    this.#unsubscribe = store.subscribe(() =>
      this.stateChanged(store.getState())
    )
    this.dispatchEvent(customEvent('register', { id: this.id, type: 'input' }))
  }

  disconnectedCallback() {
    this.#unsubscribe()
    super.disconnectedCallback()
  }

  stateChanged(state) {}

  handleInput(event) {
    super.handleInput(event)
    input({ id: this.id, value: this.value })
  }
}

export default ConnectedAutocompleteInput
export { AutocompleteInput }