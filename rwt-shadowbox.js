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

	// The elementInstance is used to distinguish between multiple instances of this custom element
	static elementInstance = 0;

	constructor() {
		super();
				
		// child elements
		this.dialog = null;
		this.caption = null
		this.closeButton = null;
		this.outerMargin = null;
		
		// properties
		this.shortcutKey = null;
		this.collapseSender = `RwtShadowbox ${RwtShadowbox.elementInstance}`;

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

		var documentFragment = await this.fetchInnerHTML();
		if (documentFragment != null) {
			var elOuterMargin = htmlFragment.getElementById('outer-margin');
			elOuterMargin.appendChild(documentFragment);
		}
		
		 // append the HTML and CSS to the custom element's shadow root
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(htmlFragment); 
		this.shadowRoot.appendChild(styleElement); 
		
		this.identifyChildren();
		this.registerEventListeners();
		this.initializeCaption();
		this.initializeShortcutKey();
	}

	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	//^ Fetch the user-provided text from the file specified in
	//  the custom element's sourceref attribute, which is a URL.
	//  That file should contain valid HTML.
	//
	//< returns a document-fragment suitable for appending to the outer-margin element
	//< returns null if the user has not specified a sourceref attribute or
	//  if the server does not respond with 200 or 304
	async fetchInnerHTML() {
		if (this.hasAttribute('sourceref') == false)
			return null;
		
		var sourceref = this.getAttribute('sourceref');

		var response = await fetch(sourceref, {cache: "no-cache", referrerPolicy: 'no-referrer'});		// send conditional request to server with ETag and If-None-Match
		if (response.status != 200 && response.status != 304)
			return null;
		var templateText = await response.text();
		
		// create a template and turn its content into a document fragment
		var template = document.createElement('template');
		template.innerHTML = templateText;
		return template.content;
	}

	//^ Fetch the HTML template
	//< returns a document-fragment suitable for appending to shadowRoot
	//< returns null if server does not respond with 200 or 304
	async fetchTemplate() {
		var response = await fetch('/node_modules/rwt-shadowbox/rwt-shadowbox.blue', {cache: "no-cache", referrerPolicy: 'no-referrer'});
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
		var response = await fetch('/node_modules/rwt-shadowbox/rwt-shadowbox.css', {cache: "no-cache", referrerPolicy: 'no-referrer'});
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
		this.outerMargin = this.shadowRoot.getElementById('outer-margin');
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
	
	//^ Get the user-specified shortcut key. This will be used to open the dialog.
	//  Valid values are "F1", "F2", etc., specified with the *shortcut attribute on the custom element
	//  Default value is "F1"
	initializeShortcutKey() {
		if (this.hasAttribute('shortcut'))
			this.shortcutKey = this.getAttribute('shortcut');
		else
			this.shortcutKey = 'F1';
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
	// toggle the dialog when user presses the assigned shortcutKey
	onKeydownDocument(event) {		
		if (event.key == "Escape") {
			this.hideDialog();
			event.stopPropagation();
		}
		// like 'F1', 'F2', etc
		if (event.key == this.shortcutKey) {
			this.toggleDialog();
			event.stopPropagation();
			event.preventDefault();
		}
	}

	//^ Send an event to close/hide all other registered popups
	collapseOtherPopups() {
		var collapseSender = this.collapseSender;
		var collapseEvent = new CustomEvent('collapse-popup', {detail: { collapseSender }});
		document.dispatchEvent(collapseEvent);
	}
	
	//^ Listen for an event on the document instructing this dialog to close/hide
	//  But don't collapse this dialog, if it was the one that generated it
	onCollapsePopup(event) {
		if (event.detail.sender == this.collapseSender)
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
