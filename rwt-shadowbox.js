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

	static elementInstance = 1;
	static htmlURL  = '/node_modules/rwt-shadowbox/rwt-shadowbox.blue';
	static cssURL   = '/node_modules/rwt-shadowbox/rwt-shadowbox.css';
	static htmlText = null;
	static cssText  = null;

	constructor() {
		super();
				
		// child elements
		this.dialog = null;
		this.caption = null
		this.closeButton = null;
		this.outerMargin = null;
		
		// properties
		this.instance = RwtShadowbox.elementInstance++;
		this.shortcutKey = null;
		this.collapseSender = `RwtShadowbox ${RwtShadowbox.elementInstance}`;

		Object.seal(this);
	}

	//-------------------------------------------------------------------------
	// customElement life cycle callback
	//-------------------------------------------------------------------------
	async connectedCallback() {		
		if (!this.isConnected)
			return;

		try {
			var htmlFragment = await this.getHtmlFragment();
			var styleElement = await this.getCssStyleElement();

			var documentFragment = await this.fetchInnerHTML();
			if (documentFragment != null) {
				var elOuterMargin = htmlFragment.getElementById('outer-margin');
				elOuterMargin.appendChild(documentFragment);
			}
			
			this.attachShadow({mode: 'open'});
			this.shadowRoot.appendChild(htmlFragment); 
			this.shadowRoot.appendChild(styleElement); 
			
			this.identifyChildren();
			this.registerEventListeners();
			this.initializeCaption();
			this.initializeShortcutKey();
		}
		catch (err) {
			console.log(err.message);
		}
	}

	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	// Only the first instance of this component fetches the HTML text from the server.
	// All other instances wait for it to issue an 'html-template-ready' event.
	// If this function is called when the first instance is still pending,
	// it must wait upon receipt of the 'html-template-ready' event.
	// If this function is called after the first instance has already fetched the HTML text,
	// it will immediately issue its own 'html-template-ready' event.
	// When the event is received, create an HTMLTemplateElement from the fetched HTML text,
	// and resolve the promise with a DocumentFragment.
	getHtmlFragment() {
		return new Promise(async (resolve, reject) => {
			
			document.addEventListener('html-template-ready', () => {
				var template = document.createElement('template');
				template.innerHTML = RwtShadowbox.htmlText;
				resolve(template.content);
			});
			
			if (this.instance == 1) {
				var response = await fetch(RwtShadowbox.htmlURL, {cache: "no-cache", referrerPolicy: 'no-referrer'});
				if (response.status != 200 && response.status != 304) {
					reject(new Error(`Request for ${RwtShadowbox.htmlURL} returned with ${response.status}`));
					return;
				}
				RwtShadowbox.htmlText = await response.text();
				document.dispatchEvent(new Event('html-template-ready'));
			}
			else if (RwtShadowbox.htmlText != null) {
				document.dispatchEvent(new Event('html-template-ready'));
			}
		});
	}
	
	// Use the same pattern to fetch the CSS text from the server
	// When the 'css-text-ready' event is received, create an HTMLStyleElement from the fetched CSS text,
	// and resolve the promise with that element.
	getCssStyleElement() {
		return new Promise(async (resolve, reject) => {

			document.addEventListener('css-text-ready', () => {
				var styleElement = document.createElement('style');
				styleElement.innerHTML = RwtShadowbox.cssText;
				resolve(styleElement);
			});
			
			if (this.instance == 1) {
				var response = await fetch(RwtShadowbox.cssURL, {cache: "no-cache", referrerPolicy: 'no-referrer'});
				if (response.status != 200 && response.status != 304) {
					reject(new Error(`Request for ${RwtShadowbox.cssURL} returned with ${response.status}`));
					return;
				}
				RwtShadowbox.cssText = await response.text();
				document.dispatchEvent(new Event('css-text-ready'));
			}
			else if (RwtShadowbox.cssText != null) {
				document.dispatchEvent(new Event('css-text-ready'));
			}
		});
	}
	
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
	initializeShortcutKey() {
		if (this.hasAttribute('shortcut'))
			this.shortcutKey = this.getAttribute('shortcut');
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
		if (event.key == this.shortcutKey && this.shortcutKey != null) {
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
