/*!
 * jQuery CSS3 Animation Queue
 * https://github.com/Richard1320/jQuery-CSS3-Animation-Queue
 *
 * Author
 * Richard Hung
 * http://www.magicmediamuse.com/
 *
 * Version
 * 1.0.4
 *
 * Copyright (c) 2016 Richard Hung.
 *
 * License
 * jQuery CSS3 Animation Queue by Richard Hung is licensed under a MIT License.
 * http://opensource.org/licenses/MIT
 */

(function($) {
	'use strict';

	// Transitions
	var queue             = []; // Queue of elements that have reached animation break point
	var transitionObjects = $('.animated.standby'); // All elements to be animated
	var queueActive       = false; // Check if queue is in process, to not run multiple queues concurrently

	// Sort array by element top including offset
	var arraySort = function(a,b) {
		var a_offset = 50;
		var b_offset = 50;
		var a_top    = a.offset().top;
		var b_top    = b.offset().top;

		// Check if elements have custom offset
		if (a.data('offset')) {
			a_offset = parseInt(a.data('offset'));
		}
		if (b.data('offset')) {
			b_offset = parseInt(b.data('offset'));
		}

		// Artificially push one pixel down for the next item to prevent same line items from having random order
		b_offset--;

		// Compare the two animation tops
		return (a_top - a_offset) - (b_top - b_offset);

	};
	// Recusive loop to process queue
	var processQueue = function() {
		// If queue is not in process and has elements, run one element through animation queue
		if (!queueActive && queue.length) {
			queueActive = true;

			// Set default delay
			var delay = 500;

			// Shift the first element out of queue
			var first_element = queue.shift();

			// Animate element
			first_element.removeClass('standby');

			// Check if element has custom delay
			if (first_element.data('delay')) {
				delay = parseInt(first_element.data('delay'));
			}

			// Wait and run queue again
			setTimeout(function() {
				queueActive = false;
				processQueue();
			},delay);

		}
	};
	var addToQueue = function() {
		var scroll_top    = $(window).scrollTop();
		var window_height = $(window).height();

		// Loop through list of elements waiting for animation
		transitionObjects.each(function() {
			var element     = $(this);
			var element_top = element.offset().top;
			var offset      = 50; // Space between the top of the element and bottom of browser before element is added to active animation queue

			// Check if element has custom offset
			if (element.data('offset')) {
				offset = parseInt(element.data('offset'));
			}

			// Check if browser scroll is at break point
			if (scroll_top + window_height > element_top - offset) {
				// Add element to animation queue
				queue.push(element);
				queue.sort(arraySort);

				// Remove this element from list of waiting animation elements
				transitionObjects = transitionObjects.not(this);
			}
		});
	};

	// Animate all elements above fold immediately without adding to queue
	var immediateAnimation = function(scroll_top) {
		// Check if a position top is passed
		if (!scroll_top) {
			scroll_top = $(window).scrollTop();
		}

		// Loop through list of elements waiting for animation
		transitionObjects.each(function() {
			var element     = $(this);
			var element_top = element.offset().top;

			// Check if browser scroll is at break point
			if (scroll_top > element_top) {
				// Run animation
				element.removeClass('standby');

				// Remove this element from list of waiting animation elements
				transitionObjects = transitionObjects.not(this);
			}
		});
	};

	$(window).on('load',function() {
		// Cache all animated elements
		transitionObjects = $('.animated.standby');

		// Run once for elements above fold
		immediateAnimation();

		addToQueue();
		processQueue();

	}); // End window ready
	$(window).scroll(function() {
		addToQueue();
		processQueue();
	});

	$.fn.jqueryCss3AnimationQueue = function(method) {
		switch (method) {
			case 'update':
				transitionObjects = $('.animated.standby');
				queue = [];
				addToQueue();
				processQueue();
			break;
		}
	}

})(jQuery);
