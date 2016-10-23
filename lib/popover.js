(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("popover", [], factory);
	else if(typeof exports === 'object')
		exports["popover"] = factory();
	else
		root["popover"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SPACING = 16;
	var SCALE_POPOVER_BY = 1.05; // 5% because transform: scale(0.95);
	var deactivateCover = document.getElementById('popover-deactivate-cover');

	var Popover = function () {
	  function Popover(node) {
	    _classCallCheck(this, Popover);

	    this.node = node;
	    this.contents = node.querySelector('.popover-contents');
	    this.activated = false;
	    this.handleActivation = this.handleActivation.bind(this);
	    this.activatePopover = this.activatePopover.bind(this);
	    this.deactivatePopover = this.deactivatePopover.bind(this);
	    this._resizePopover = this._resizePopover.bind(this);
	    this.constrainedWidth = this.node.hasAttribute('data-constrain-width');
	    this.activator = document.querySelector('[data-popover-activator-for="' + node.id + '"]');

	    this.node.setAttribute('tabindex', '0');

	    // this.activator.addEventListener('keydown', (evt) => this._tabEventHandler(evt, this.node));
	    // this.node.addEventListener('keydown', (evt) => this._tabEventHandler(evt, this.activator.parentNode.nextElementSibling));
	    // this.activator.addEventListener('focus', this.activatePopover);
	    // this.activator.addEventListener('click', () => { this.activator.focus(); });

	    this.activator.addEventListener('click', this.handleActivation);
	    deactivateCover.addEventListener('click', this.deactivatePopover);
	    window.addEventListener('resize', this._resizePopover);
	    // clean up listeners
	  }

	  _createClass(Popover, [{
	    key: 'handleActivation',
	    value: function handleActivation() {
	      if (this.activated) {
	        this.deactivatePopover();
	      } else {
	        this.activatePopover();
	      }
	    }
	  }, {
	    key: 'deactivatePopover',
	    value: function deactivatePopover() {
	      deactivateCover.removeAttribute('data-popover-active');
	      this.node.setAttribute('data-hidden', 'true');
	      this.node.removeAttribute('style');
	      this.activated = false;
	    }
	  }, {
	    key: 'activatePopover',
	    value: function activatePopover() {
	      this._positionPopover();
	      deactivateCover.setAttribute('data-popover-active', 'true');
	      this.node.removeAttribute('data-hidden');
	      this.activated = true;
	    }
	  }, {
	    key: '_tabEventHandler',
	    value: function _tabEventHandler(evt, focusNode) {
	      if (!this.activated) {
	        return;
	      }
	      evt.preventDefault();

	      if (evt.keyCode === 9) {
	        focusNode.focus();
	      }
	    }
	  }, {
	    key: '_elementPosition',
	    value: function _elementPosition(node) {
	      var clientRect = node.getBoundingClientRect();
	      var top = clientRect.top;
	      var bottom = clientRect.bottom;
	      var right = clientRect.right;
	      var left = clientRect.left;

	      var scrollPosition = window.pageYOffset;
	      top += scrollPosition;
	      bottom += scrollPosition;
	      return {
	        top: top,
	        right: right,
	        bottom: bottom,
	        left: left,
	        width: right - left,
	        height: bottom - top
	      };
	    }
	  }, {
	    key: '_resizePopover',
	    value: function _resizePopover() {
	      var _this = this;

	      if (this.activated) {
	        window.requestAnimationFrame(function () {
	          _this._positionPopover();
	        });
	      }
	    }
	  }, {
	    key: '_positionPopover',
	    value: function _positionPopover() {
	      var activatorPosition = this._elementPosition(this.activator);
	      var activatorCenter = activatorPosition.left + activatorPosition.width / 2;
	      if (this.constrainedWidth) {
	        this.node.style['max-width'] = activatorPosition.width + 'px';
	      }
	      this.node.style.left = null; // this calculates proper width on device rotation
	      this.node.style.right = null;
	      this.node.style.height = null;
	      var popoverPosition = this._elementPosition(this.node);
	      var popoverScale = this.activated ? 1 : SCALE_POPOVER_BY;
	      var popoverCenter = popoverPosition.width * popoverScale / 2;

	      // can probably avoid this calc if constrained width
	      this._calculateLeftRight(activatorPosition, activatorCenter, popoverCenter);
	      this._calculateHeight(activatorPosition.bottom, popoverPosition.height);

	      this.node.style.top = activatorPosition.top + activatorPosition.height + SPACING + 'px';
	      this.node.classList.add('popover--bottom-shadow'); // should be set based on position, use another method
	    }
	  }, {
	    key: '_calculateHeight',
	    value: function _calculateHeight(activatorBottom) {
	      var windowHeight = window.innerHeight;
	      var contentsHeight = this._elementPosition(this.contents).height;
	      // spacing * 2 because of top spacing
	      var availableHeight = windowHeight - activatorBottom - SPACING * 2;
	      if (availableHeight - contentsHeight < 0) {
	        this.node.style.height = availableHeight + 'px';
	      }
	    }
	  }, {
	    key: '_calculateLeftRight',
	    value: function _calculateLeftRight(activator, activatorCenter, popoverCenter) {
	      var windowWidth = window.innerWidth;
	      var activatorCentered = activatorCenter - popoverCenter;
	      var tooFarLeft = activatorCentered > 0;
	      var tooFarRight = activatorCenter + popoverCenter > windowWidth;

	      if (tooFarLeft) {
	        this.node.style.left = activatorCentered + 'px';
	      }
	      if (tooFarRight) {
	        this.node.style.right = windowWidth - activator.right + 'px';
	      }
	      if (activatorCentered < 0) {
	        this.node.style.left = activator.left + 'px';
	      }
	    }
	  }]);

	  return Popover;
	}();

	exports.default = Popover;

/***/ }
/******/ ])
});
;