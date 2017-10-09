# jQuery CSS3 Animation Queue

jQuery CSS3 animation queue is a plugin to chain CSS3 animations one at a time, as well as delay the animation until the element is in the browser viewport.

## Installation

To install via Bower, simply do the following:

```bash
$ bower install jquery-css3-animation-queue --save
```
or you can install via npm:

```bash
$ npm install jquery-css3-animation-queue --save
```

## Basic Usage
1. Include `jQuery` and `jquery-css3-animation-queue.js` in your document

  ```html
  <script type="text/javascript" src="./jQuery.js"></script>
  <script type="text/javascript" src="./jquery-css3-animation-queue.js"></script>
  ```

2. Add the rule to delay the animations to your CSS.

  ```css
  /* Required rule. Add to your CSS file */
  .animated.standby {
    -webkit-animation: none !important;
    -o-animation: none !important;
    animation: none !important;
    visibility: hidden;
  }
  ```

3. Create CSS3 animation rules. Recommendation: use [animate.css](https://github.com/daneden/animate.css) for a large list of ready animations.

  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
  ```

4. Add the classes `animated` and `standby` to the element you want to animate. Also remember to add whichever classes you need for your animation rules.

Full example:
  ```html
  <h1 class="animated standby fadeIn">Example</h1>
  ```

## Advanced Usage

The plugin reads the data properties `delay` and `offset` on each element.

The `delay` property determines how much time to wait before animating the next element in the queue. If unset, defaults to `500` milliseconds. This is separate to the actual CSS animation duration and may contain a different value.
```html
<div class="animated standby fadeIn" data-delay="2000">The next element in queue will animate in two seconds.</div>
```

The `offset` property determines how much space between the bottom of the browser and the top of the element before the element is added to the active queue. If unset, defaults to `50` pixels. Higher numbers mean the user will have to scroll down more before animation starts.
```html
<div class="animated standby fadeIn" data-offset="200">This element will be added to the animation queue when the space between the bottom of the browser and the top of the element is more than 200 pixels.</div>
```
## License
jQuery CSS3 Animation Queue is licensed under the MIT license. (http://opensource.org/licenses/MIT)
