





<a href='https://hub.readwritetools.com/components.blue'><img src='/img/rwt-component.png' width=80 align=right /></a>



<figure>
	<img src='/img/components/shadowbox/shadowbox-unsplash-martino-pietropoli.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

# Shadowbox

## A classy dialog box


<address>
<img src='/img/rwtools.png' width='1.8rem' /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2019-12-10>Dec 10, 2019</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>rwt-shadowbox</span> web component is a popup dialog box with titlebar caption, close button, shortcut key access, event interface, and either slotted or templated content.</td></tr>
</table>

### Motivation

Dialog boxes are such a common design pattern that they need no explanation.
HTML5 has a special `dialog` tag for that very purpose. Unfortunately, the HTML
dialog tag does not provide any "standard" behavior for how it should appear.
Nor does it provide a convenient way for the user to dismiss it.

The <span>rwt-shadowbox</span> web component has several features which
overcome those limitations, and make for a more pleasant user experience.

   * The dialog box has a titlebar with caption and close button.
   * The contents may be slotted or provided with a template file.
   * The dialog has an event interface for showing and hiding itself.
   * The dialog emits a custom event to close sibling dialog boxes.
   * A keyboard listener is provided to allow a shortcut key to open/close the
      dialog.

#### Prerequisites

The <span>rwt-shadowbox</span> web component works in any browser that
supports modern W3C standards. It has no other prerequisites. Distribution and
installation are done with either NPM or via Github.

#### Installation using NPM

If you are familiar with Node.js and the `package.json` file, you'll be
comfortable installing the component just using this command:

<pre>
npm install rwt-shadowbox
</pre>

If you are a front-end Web developer with no prior experience with NPM, follow
these general steps:

   1. Install <a href='https://nodejs.org'>Node.js/NPM</a>
on your development computer.
   2. Create a `package.json` file in the root of your web project using the command:
<pre>
npm init
</pre>

   3. Download and install the web component using the command:
<pre>
npm install rwt-shadowbox
</pre>


<small>
Important note: This web component uses Node.js and NPM and `package.json` as a
convenient *distribution and installation* mechanism. The web component itself
does not need them.</small>

#### Installation using Github

If you are more comfortable using Github for installation, follow these steps:

   1. Create a directory `node_modules` in the root of your web project.
   2. Clone the <span>rwt-shadowbox</span> web component into it using the
      command:
<pre>
git clone https://github.com/readwritetools/rwt-shadowbox.git
</pre>


### Using the web component

After installation, you need to add four things to your HTML page to make use of
it.

   1. Add a `script` tag to load the component's `rwt-shadowbox.js` file:
<pre>
<script src='/node_modules/rwt-shadowbox/rwt-shadowbox.js' type=module></script>             
</pre>

   2. <span>Add the component tag
      somewhere on the page.</span>
<pre>
<rwt-shadowbox id=info titlebar=Info shortcut=F1 sourceref='/info.blue'  role=contentinfo ></rwt-shadowbox>
</pre>


      * For scripting purposes, apply an `id` attribute.
      * Apply a `titlebar` attribute with the text you want to appear as a caption.
      * Optionally, apply a `shortcut` attribute with something like `F1`, `F2`, etc. for
         hotkey access.
      * Optionally, apply a `sourceref` attribute with a reference to an HTML file
         containing the dialog's text and any CSS it needs.
      * And for WAI-ARIA accessibility apply a `role=contentinfo` attribute.
      <span>
For simple dialog boxes, the `sourceref` may be omitted and the text of the dialog
      box may be slotted into the web component. Simply place the text directly
      between the `<rwt-shadowbox>` and `</rwt-shadowbox>` tags.</span>
   3. Add a way for the visitor to show the dialog:
<pre>
<a id='info-button' title="Info (F1)">ℹ</a>
</pre>

   4. Add a listener to respond to the click event:
<pre>
<script type=module>
    document.getElementById('info-button').addEventListener('click', (e) => {
        document.getElementById('info').toggleDialog(e);
    });
</script>
</pre>


### Customization

#### Dialog size and position

The dialog is absolutely positioned towards the bottom left of the viewport. Its
size may be overridden using CSS by defining new values for the size and
position variables.

<pre>
rwt-shadowbox#info {
    --bottom: 4rem;
    --left: 2rem;
    --width: 80vw;
    --height: 85vh;
}
</pre>

#### Dialog color scheme

The default color palette for the dialog uses a dark mode theme. You can use CSS
to override the variables' defaults:

<pre>
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
</pre>

### Event interface

The dialog box can be controlled with its event interface.

The component listens on DOM `document` for `toggle-shadowbox` messages. Upon
receipt it will show or hide the dialog box.

The component listens on DOM `document` for `keydown` messages. If the user presses
the configured shortcut key (<kbd>F1</kbd>, <kbd>F2</kbd>, etc) it will show/hide
the dialog box. The <kbd>Esc</kbd> key closes the dialog box.

The component listens on DOM `document` for `collapse-popup` messages, which are
sent by sibling dialog boxes. Upon receipt it will close itself.

The component listens on DOM `document` for `click` messages. When the user clicks
anywhere outside the dialog box, it closes itself.

### License

The <span>rwt-shadowbox</span> web component is licensed under the MIT
License.

<img src='/img/blue-seal-mit.png' />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

<p align=center><a href='https://readwritetools.com'><img src='/img/rwtools.png' width=80 /></a></p>
