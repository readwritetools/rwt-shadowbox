











<figure>
	<img src='/img/components/shadowbox/shadowbox-unsplash-martino-pietropoli.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

##### Open Source DOM Component

# Shadowbox

## A classy dialog box


<address>
<img src='/img/rwtools.png' width=80 /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2019-12-10>Dec 10, 2019</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>rwt-shadowbox</span> DOM component is a popup dialog box with titlebar caption, close button, shortcut key access, event interface, and either slotted or templated content.</td></tr>
</table>

### Motivation

Dialog boxes are such a common design pattern that they need no explanation.
HTML5 has a special `dialog` tag for that very purpose. Unfortunately, the HTML
dialog tag does not provide any "standard" behavior for how it should appear.
Nor does it provide a convenient way for the user to dismiss it.

The <span>rwt-shadowbox</span> DOM component has several features which
overcome those limitations, and make for a more pleasant user experience.

   * The dialog box has a titlebar with caption and close button.
   * The contents may be slotted or provided with a template file.
   * The dialog has an event interface for showing and hiding itself.
   * The dialog emits a custom event to close sibling dialog boxes.
   * A keyboard listener is provided to allow a shortcut key to open/close the
      dialog.

#### In the wild

To see an example of this component in use, visit the <a href='https://readwritetools.com/'>READ WRITE TOOLS</a>
website and press <kbd>F2</kbd> "Info" or <kbd>F3</kbd> "Rights". To understand
what's going on under the hood, use the browser's inspector to view the HTML
source code and network activity, and follow along as you read this
documentation.

#### Prerequisites

The <span>rwt-shadowbox</span> DOM component works in any browser that
supports modern W3C standards. Templates are written using <span>BLUE</span><span>
PHRASE</span> notation, which can be compiled into HTML using the free <a href='https://hub.readwritetools.com/desktop/rwview.blue'>Read Write View</a>
desktop app. It has no other prerequisites. Distribution and installation are
done with either NPM or via Github.

#### Installation using NPM

If you are familiar with Node.js and the `package.json` file, you'll be
comfortable installing the component just using this command:

```bash
npm install rwt-shadowbox
```

If you are a front-end Web developer with no prior experience with NPM, follow
these general steps:

   * Install <a href='https://nodejs.org'>Node.js/NPM</a>
on your development computer.
   * Create a `package.json` file in the root of your web project using the command:
```bash
npm init
```

   * Download and install the DOM component using the command:
```bash
npm install rwt-shadowbox
```


Important note: This DOM component uses Node.js and NPM and `package.json` as a
convenient *distribution and installation* mechanism. The DOM component itself
does not need them.

#### Installation using Github

If you are more comfortable using Github for installation, follow these steps:

   * Create a directory `node_modules` in the root of your web project.
   * Clone the <span>rwt-shadowbox</span> DOM component into it using the
      command:
```bash
git clone https://github.com/readwritetools/rwt-shadowbox.git
```


### Using the DOM component

After installation, you need to add four things to your HTML page to make use of
it.

   * Add a `script` tag to load the component's `rwt-shadowbox.js` file:
```html
<script src='/node_modules/rwt-shadowbox/rwt-shadowbox.js' type=module></script>             
```

   * Add the component tag somewhere on the page.

      * For scripting purposes, apply an `id` attribute.
      * Apply a `titlebar` attribute with the text you want to appear as a caption.
      * Optionally, apply a `shortcut` attribute with something like `F1`, `F2`, etc. for
         hotkey access.
      * Optionally, apply a `sourceref` attribute with a reference to an HTML file
         containing the dialog's text and any CSS it needs.
      * And for WAI-ARIA accessibility apply a `role=contentinfo` attribute.
      * For simple dialog boxes, the `sourceref` may be omitted and the text of the dialog
         box may be slotted into the DOM component. Simply place the text directly
         between the `<rwt-shadowbox>` and `</rwt-shadowbox>` tags.
```html
<rwt-shadowbox id=info titlebar=Info shortcut=F1 sourceref='/info.blue' role=contentinfo ></rwt-shadowbox>
```

   * Add a way for the visitor to show the dialog:
```html
<a id='info-button' title="Info (F1)">ℹ</a>
```

   * Add a listener to respond to the click event:
```html
<script type=module>
    document.getElementById('info-button').addEventListener('click', (e) => {
        document.getElementById('info').toggleDialog(e);
    });
</script>
```


### Customization

#### Dialog size and position

The dialog is absolutely positioned towards the bottom left of the viewport. Its
size may be overridden using CSS by defining new values for the size and
position variables.

```css
rwt-shadowbox#info {
    --min-width: 10rem;
    --optimal-width: 70vw;
    --max-width: 40rem;
    
    --min-height: 10rem;
    --optimal-height: 50vh;
    --max-height: 40rem;

    --bottom: 1rem;
    --left: 1rem;
    --z-index: 1;
}
```

#### Dialog color scheme

The default color palette for the dialog uses a dark mode theme. You can use CSS
to override the variables' defaults:

```css
rwt-shadowbox#info {
    --color: var(--white);
    --accent-color1: var(--yellow);
    --accent-color2: var(--js-blue);
    --background: var(--black);
    --accent-background1: var(--medium-black);
    --accent-background2: var(--pure-black);
    --accent-background3: var(--nav-black);
    --accent-background4: var(--black);
}
```

### Life-cycle events

The component issues life-cycle events.


<dl>
	<dt><code>component-loaded</code></dt>
	<dd>Sent when the component is fully loaded and ready to be used. As a convenience you can use the <code>waitOnLoading()</code> method which returns a promise that resolves when the <code>component-loaded</code> event is received. Call this asynchronously with <code>await</code>.</dd>
</dl>

### Event controllers

The dialog box can be controlled with its event interface.


<dl>
	<dt><code>toggle-shadowbox</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>toggle-shadowbox</code> messages. Upon receipt it will show or hide the dialog box.</dd>
	<dt><code>keydown</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>keydown</code> messages. If the user presses the configured shortcut key (<kbd>F1</kbd>, <kbd>F2</kbd>, etc) it will show/hide the dialog box. The <kbd>Esc</kbd> key closes the dialog box.</dd>
	<dt><code>collapse-popup</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>collapse-popup</code> messages, which are sent by sibling dialog boxes. Upon receipt it will close itself.</dd>
	<dt><code>click</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>click</code> messages. When the user clicks anywhere outside the dialog box, it closes itself.</dd>
</dl>

---

### Reference


<table>
	<tr><td><img src='/img/read-write-hub.png' alt='DOM components logo' width=40 /></td>	<td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/shadowbox.blue'>READ WRITE HUB</a></td></tr>
	<tr><td><img src='/img/git.png' alt='git logo' width=40 /></td>	<td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-shadowbox'>github</a></td></tr>
	<tr><td><img src='/img/dom-components.png' alt='DOM components logo' width=40 /></td>	<td>Component catalog</td> 	<td><a href='https://domcomponents.com/shadowbox.blue'>DOM COMPONENTS</a></td></tr>
	<tr><td><img src='/img/npm.png' alt='npm logo' width=40 /></td>	<td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-shadowbox'>npm</a></td></tr>
	<tr><td><img src='/img/read-write-stack.png' alt='Read Write Stack logo' width=40 /></td>	<td>Publication venue</td>	<td><a href='https://readwritestack.com/components/shadowbox.blue'>READ WRITE STACK</a></td></tr>
</table>

### License

The <span>rwt-shadowbox</span> DOM component is licensed under the MIT
License.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

