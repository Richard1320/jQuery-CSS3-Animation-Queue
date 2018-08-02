/*!
 * jQuery CSS3 Animation Queue
 * https://github.com/Richard1320/jQuery-CSS3-Animation-Queue
 *
 * Author
 * Richard Hung
 * http://www.magicmediamuse.com/
 *
 * Version
 * 1.0.7
 *
 * Copyright (c) 2018 Richard Hung.
 *
 * License
 * jQuery CSS3 Animation Queue by Richard Hung is licensed under a MIT License.
 * http://opensource.org/licenses/MIT
 */

(function($) {
	'use strict';


	// Global Variables
	if (!window.jqueryCss3AnimationQueue) window.jqueryCss3AnimationQueue = {};
	if (!window.jqueryCss3AnimationQueue.settings) window.jqueryCss3AnimationQueue.settings = {};
	// Time to wait before triggering the next element in queue
	if (!window.jqueryCss3AnimationQueue.settings.delay) window.jqueryCss3AnimationQueue.settings.delay = 500;
	// Space between the top of the element and bottom of browser before element is added to active animation queue
	if (!window.jqueryCss3AnimationQueue.settings.offset) window.jqueryCss3AnimationQueue.settings.offset = 150;
	// Attempt to sort queue by position top of each element rather than position in DOM
	if (typeof window.jqueryCss3AnimationQueue.settings.applySort === 'undefined') window.jqueryCss3AnimationQueue.settings.applySort = true;
	var queue             = []; // Queue of elements that have reached animation break point
	var transitionObjects = $('.animated.standby'); // All elements to be animated
	var queueActive       = false; // Check if queue is in process, to not run multiple queues concurrently
	var methods           = {}; // Plugin methods

	// Sort array by element top including offset
	methods.sortByOffsetTop = function(a,b) {
		var a_offset = window.jqueryCss3AnimationQueue.settings.offset;
		var b_offset = window.jqueryCss3AnimationQueue.settings.offset;
    var a_top    = a.offset().top;
    var a_left   = a.offset().left;
		var b_top    = b.offset().top;
		var b_left   = b.offset().left;

		// Check if elements have custom offset
		if (a.data('offset')) {
			a_offset = parseInt(a.data('offset'));
		}
		if (b.data('offset')) {
			b_offset = parseInt(b.data('offset'));
		}

    // Artificially push few pixels down for the next item to prevent same line items from having random order
    if (a_left < b_left) { // If "a" is to the "left" of "b"
      b_offset = b_offset - 5;
    } else if (b_left < a_left) { // If "b" is to the "left" of "a"
      a_offset = a_offset - 5;
    }

		// Compare the two animation tops
		return (a_top - a_offset) - (b_top - b_offset);

	};
	// Recusive loop to process queue
	methods.processQueue = function() {
		// If queue is not in process and has elements, run one element through animation queue
		if (!queueActive && queue.length) {
			queueActive = true;

			// Set default delay
			var delay = window.jqueryCss3AnimationQueue.settings.delay;

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
				methods.processQueue();
			},delay);

		}
	};
	methods.addToQueue = function() {
		var scroll_top    = $(window).scrollTop();
		var window_height = $(window).height();
		var queue_updated = false;

		// Loop through list of elements waiting for animation
		transitionObjects.each(function() {
			var element       = $(this);
			var element_top   = element.offset().top;
			var offset        = window.jqueryCss3AnimationQueue.settings.offset;
			var window_bottom = scroll_top + window_height;

			// Check if element has custom offset
			if (element.data('offset')) {
				offset = parseInt(element.data('offset'));
			}

			// Check if browser scroll is at break point
			if (window_bottom > element_top + offset) {
				// Add element to animation queue
				queue.push(element);

				// Remove this element from list of waiting animation elements
				transitionObjects = transitionObjects.not(this);

				queue_updated = true;
			}
		});
		if (queue_updated && window.jqueryCss3AnimationQueue.settings.applySort) {
			queue.sort(methods.sortByOffsetTop);
		}
	};

	// Animate all elements above fold immediately without adding to queue
	methods.immediateAnimation = function(scroll_top) {
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

	// Update queue with new animatable elements
	methods.update = function() {
		transitionObjects = $('.animated.standby');
		queue = [];
		methods.addToQueue();
		methods.processQueue();

	}; // End update

	$.fn.jqueryCss3AnimationQueue = function(method) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.jqueryCss3AnimationQueue' );
		}

	}; // End plugin

	$(document).ready(function() {
		// Cache all animated elements
		transitionObjects = $('.animated.standby');

		// Run once for elements above fold
		methods.immediateAnimation();

		methods.addToQueue();
		methods.processQueue();
	}); // end document ready

	$(window).scroll(function() {
		methods.addToQueue();
		methods.processQueue();
	});

})(jQuery);
