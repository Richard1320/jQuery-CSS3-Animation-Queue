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

## Options

The plugin reads the data properties `delay` and `offset` on each element.

### Delay

Default value: `500`

The `delay` property determines how much time to wait, in milliseconds, before animating the next element in the queue. This is separate to the actual CSS animation duration and may contain a different value.

To override the default value, you can set your own value to the global window variable in your JavaScript.
```javascript
window.jqueryCss3AnimationQueue.settings.delay = 5000;
```

Each animated element can also have a `data-delay` attribute which will override the default.
```html
<div class="animated standby fadeIn" data-delay="2000">The next element in queue will animate in two seconds.</div>
```

### Offset

Default value: `150`

The `offset` property determines how much space, in pixels, between the bottom of the browser and the top of the element before the element is added to the active queue. Higher numbers mean the user will have to scroll down more before animation starts.

To override the default value, you can set your own value to the global window variable in your JavaScript.
```javascript
window.jqueryCss3AnimationQueue.settings.offset = 500;
```

Each animated element can also have a `data-offset` attribute which will override the default.
```html
<div class="animated standby fadeIn" data-offset="200">This element will be added to the animation queue when the space between the bottom of the browser and the top of the element is more than 200 pixels.</div>
```

### Sort By Offset Top

Default value: `true`

The plugin will also attempt to sort the queue by the top position of each element. Elements lower in the DOM but higher in position due to negative margins or absolute / fixed positions would be in front of the queue. A side effect is that multiple elements on the same line may animate out of order, due to having the same top position.

You can disable the sort function in your JavaScript. Due to this setting affecting multiple elements, there is no per-element override. However, this setting can be toggled on and off as needed without breaking the plugin.
```javascript
window.jqueryCss3AnimationQueue.settings.applySort = false;
```

## Methods

### Load New Elements

The plugin comes with several methods that you can call manually from outside the plugin. The most common one is `update`.

The plugin caches all animated elements on document ready in order to improve performance. The `update` method will clear the animation queue and reacquire elements with the classes `animated` and `standby`.

```javascript
$('.newly_added_div').addClass('animated standby fadeIn');
$.fn.jqueryCss3AnimationQueue('update');
```

### Immediate Animation

Sometimes the animation might take too long to reach the user as they might be starting in the middle of a page. The `immediateAnimation` method will trigger the animation immediately for all elements above a certain point. 

```javascript
// Immediately trigger items above fold
var scrollTop = $(window).scrollTop();
$.fn.jqueryCss3AnimationQueue('immediateAnimation', scrollTop);
```

## License
jQuery CSS3 Animation Queue is licensed under the MIT license. (http://opensource.org/licenses/MIT)
