//=============================================================================
//
// File:         /node_modules/rwt-shadowbox/rwt-shadowbox.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2019
// License:      MIT
// Initial date: Dec 4, 2019
// Purpose:      Popup box with titlebar and slotted contents
//
//=============================================================================

export default class RwtShadowbox extends HTMLElement {

	constructor() {
		super();
				
		// child elements
		this.dialog = null;
		this.caption = null
		this.closeButton = null;
		
		Object.seal(this);
	}

	//-------------------------------------------------------------------------
	// customElement life cycle callbacks
	//-------------------------------------------------------------------------
	async connectedCallback() {		
		// guard against possible call after this has been disconnected
		if (!this.isConnected)
			return;

		var htmlFragment = await this.fetchTemplate();
		if (htmlFragment == null)
			return;
		
		var styleElement = await this.fetchCSS();
		if (styleElement == null)
			return;

		 // append the HTML and CSS to the custom element's shadow root
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(htmlFragment); 
		this.shadowRoot.appendChild(styleElement); 
		
		this.identifyChildren();
		
		this.registerEventListeners();
		
		this.initializeCaption();
	}

	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	//^ Fetch the HTML template
	//< returns a document-fragment suitable for appending to shadowRoot
	//< returns null if server does not respond with 200 or 304
	async fetchTemplate() {
		var response = await fetch('/node_modules/rwt-shadowbox/rwt-shadowbox.blue');
		if (response.status != 200 && response.status != 304)
			return null;
		var templateText = await response.text();
		
		// create a template and turn its content into a document fragment
		var template = document.createElement('template');
		template.innerHTML = templateText;
		return template.content;
	}
	
	//^ Fetch the CSS styles and turn it into a style element
	//< returns an style element suitable for appending to shadowRoot
	//< returns null if server does not respond with 200 or 304
	async fetchCSS() {
		var response = await fetch('/node_modules/rwt-shadowbox/rwt-shadowbox.css');
		if (response.status != 200 && response.status != 304)
			return null;
		var css = await response.text();

		var styleElement = document.createElement('style');
		styleElement.innerHTML = css;
		return styleElement;
	}	
	
	//^ Identify this component's children
	identifyChildren() {
		this.dialog = this.shadowRoot.getElementById('shadowbox-dialog');
		this.caption = this.shadowRoot.getElementById('caption');
		this.closeButton = this.shadowRoot.getElementById('close-button');
	}
	
	registerEventListeners() {
		// document events
		document.addEventListener('click', this.onClickDocument.bind(this));
		document.addEventListener('keydown', this.onKeydownDocument.bind(this));
		document.addEventListener('collapse-popup', this.onCollapsePopup.bind(this));
		document.addEventListener('toggle-shadowbox', this.onToggleEvent.bind(this));
		
		// component events
		this.dialog.addEventListener('click', this.onClickDialog.bind(this));
		this.closeButton.addEventListener('click', this.onClickClose.bind(this));
	}
	
	initializeCaption() {
		if (this.hasAttribute('titlebar')) {
			var title = this.getAttribute('titlebar');
			this.caption.innerText = title;
		}
		else {
			this.caption.innerText = "Shadowbox";
		}
	}

	//-------------------------------------------------------------------------
	// document events
	//-------------------------------------------------------------------------
	
	// close the dialog when user clicks on the document
	onClickDocument(event) {
		this.hideDialog();
		event.stopPropagation();
	}
	
	// close the dialog when user presses the ESC key
	onKeydownDocument(event) {		
		if (event.key == "Escape") {
			this.hideDialog();
			event.stopPropagation();
		}
		if (event.key == "F2") {
			this.toggleDialog();
			event.stopPropagation();
		}
	}

	//^ Send an event to close/hide all other registered popups
	collapseOtherPopups() {
		var collapseEvent = new CustomEvent('collapse-popup', {detail: { sender: 'RwtShadowbox'}});
		document.dispatchEvent(collapseEvent);
	}
	
	//^ Listen for an event on the document instructing this dialog to close/hide
	//  But don't collapse this dialog, if it was the one that generated it
	onCollapsePopup(event) {
		if (event.detail.sender == 'RwtShadowbox')
			return;
		else
			this.hideDialog();
	}
	
	//^ Anybody can use: document.dispatchEvent(new Event('toggle-shadowbox'));
	// to open/close this component.
	onToggleEvent(event) {
		event.stopPropagation();
		this.toggleDialog();
	}
	
	//-------------------------------------------------------------------------
	// component events
	//-------------------------------------------------------------------------

	// Necessary because clicking anywhere on the dialog will bubble up
	// to onClickDocument which will close the dialog
	onClickDialog(event) {
		event.stopPropagation();
	}
	
	// User has clicked on the dialog box's Close button
	onClickClose(event) {
		this.hideDialog();
		event.stopPropagation();
	}

	//-------------------------------------------------------------------------
	// component methods
	//-------------------------------------------------------------------------

	toggleDialog() {
		if (this.dialog.style.display == 'none')
			this.showDialog();
		else
			this.hideDialog();
		event.stopPropagation();
	}
	
	// retrieve and show
	showDialog() {
		this.collapseOtherPopups();
		
		this.dialog.style.display = 'block';		
	}

	// hide and save
	hideDialog() {
		this.dialog.style.display = 'none';
	}
}

window.customElements.define('rwt-shadowbox', RwtShadowbox);
