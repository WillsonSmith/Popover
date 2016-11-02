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
	var popoverHoler = document.querySelector('.popover-holder');
	var deactivateCover = document.getElementById('popover-deactivate-cover');
	var popoverIds = Array.from(document.getElementsByClassName('popover-activator')).map(function (activator) {
	  return activator.getAttribute('data-popover-activator-for');
	});

	function nextTabElement(index, items) {
	  return items[index + 1 <= items.length - 1 ? index + 1 : 0];
	}

	function prevTabElement(index, items) {
	  return items[index - 1 >= 0 ? index - 1 : items.length - 1];
	}

	var Popover = function () {
	  function Popover(node, focusableFunction) {
	    var _this = this;

	    _classCallCheck(this, Popover);

	    this.node = node;
	    this.contents = node.querySelector('.popover-contents');
	    this.activated = false;

	    this.shiftDown = false;

	    this.focusableElements = function (container) {
	      var containerElement = container || document.body;
	      return focusableFunction(containerElement).filter(function (element) {
	        return !popoverIds.includes(element.id);
	      });
	    };

	    this.constrainedWidth = this.node.hasAttribute('data-constrain-width');
	    this.activator = document.querySelector('[data-popover-activator-for="' + node.id + '"]');

	    document.addEventListener('keydown', function (evt) {
	      if (evt.keyCode === 16) {
	        _this.shiftDown = true;
	      }
	    });

	    document.addEventListener('keyup', function (evt) {
	      if (evt.keyCode === 16) {
	        _this.shiftDown = false;
	      }
	    });

	    this.node.addEventListener('keydown', this._popoverTabHandler.bind(this));
	    this.node.addEventListener('blur', this._blurEventHandler.bind(this));

	    // this.activator.addEventListener('focus', this.activatePopover.bind(this));
	    this.activator.addEventListener('click', function () {
	      window.location.href = '#' + _this.activator.getAttribute('data-popover-activator-for');
	    });
	    this.node.addEventListener('focus', this.activatePopover.bind(this));
	    this.activator.addEventListener('keydown', this._activatorTabHandler.bind(this));

	    deactivateCover.addEventListener('click', this.deactivatePopover.bind(this));
	    window.addEventListener('resize', this._resizePopover.bind(this));
	    // clean up listeners
	  }

	  _createClass(Popover, [{
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
	      if (this.activated) {
	        return;
	      }
	      this._positionPopover();
	      deactivateCover.setAttribute('data-popover-active', 'true');
	      this.node.removeAttribute('data-hidden');
	      this.activated = true;
	    }
	  }, {
	    key: '_blurEventHandler',
	    value: function _blurEventHandler(evt) {
	      if (this.node.contains(evt.relatedTarget) || evt.relatedTarget === this.activator) {
	        return;
	      }
	      this.deactivatePopover();
	    }
	  }, {
	    key: '_popoverTabHandler',
	    value: function _popoverTabHandler(evt) {
	      evt.preventDefault();
	      var popoverFocusable = this.focusableElements(this.node);
	      var focusableElements = this.focusableElements().filter(function (element) {
	        return !popoverHoler.contains(element);
	      });
	      var focusedIndex = popoverFocusable.indexOf(document.activeElement);

	      if (evt.keyCode === 9 && !this.shiftDown) {
	        if (focusedIndex < popoverFocusable.length - 1) {
	          popoverFocusable[focusedIndex + 1].focus();
	        }

	        if (focusedIndex === popoverFocusable.length - 1) {
	          this.deactivatePopover();
	          nextTabElement(focusableElements.indexOf(this.activator), focusableElements).focus();
	        }
	      }

	      if (evt.keyCode === 9 && this.shiftDown) {
	        if (focusedIndex > 0) {
	          popoverFocusable[focusedIndex - 1].focus();
	        }
	        if (focusedIndex === 0) {
	          this.node.focus();
	        }
	        if (focusedIndex < 0) {
	          this.activator.focus();
	        }
	      }
	    }
	  }, {
	    key: '_activatorTabHandler',
	    value: function _activatorTabHandler(evt) {
	      if (!this.activated) {
	        return;
	      }
	      evt.preventDefault();
	      var popoverFocusable = this.focusableElements(this.node);
	      var focusableElements = this.focusableElements().filter(function (element) {
	        return !popoverFocusable.includes(element);
	      });

	      if (evt.keyCode === 9 && !this.shiftDown) {
	        this.node.focus();
	      }
	      if (evt.keyCode === 9 && this.shiftDown) {
	        var activatorIndex = focusableElements.indexOf(this.activator);
	        prevTabElement(activatorIndex, focusableElements).focus();
	        this.deactivatePopover();
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
	      var _this2 = this;

	      if (this.activated) {
	        window.requestAnimationFrame(function () {
	          _this2._positionPopover();
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
	      var popoverOnBottom = this._popoverOnBottom();

	      this._calculateLeftRight(activatorPosition, activatorCenter, popoverCenter);
	      this._setClasses(popoverOnBottom);
	      this.node.style.height = this._calculateHeight(activatorPosition, popoverOnBottom);
	      this.node.style.top = this._calculateTopPosition(activatorPosition);
	    }
	  }, {
	    key: '_popoverOnBottom',
	    value: function _popoverOnBottom() {
	      var windowHeight = window.innerHeight;

	      var _elementPosition2 = this._elementPosition(this.activator);

	      var top = _elementPosition2.top;
	      var bottom = _elementPosition2.bottom;

	      return windowHeight - bottom > top;
	    }
	  }, {
	    key: '_setClasses',
	    value: function _setClasses(popoverOnBottom) {
	      this.node.classList.remove('popover--bottom-shadow', 'popover--top-shadow');
	      if (popoverOnBottom) {
	        this.node.classList.add('popover--bottom-shadow');
	        return;
	      }
	      this.node.classList.add('popover--top-shadow');
	    }
	  }, {
	    key: '_calculateTopPosition',
	    value: function _calculateTopPosition(activatorPosition) {
	      var popoverOnBottom = this._popoverOnBottom();
	      if (popoverOnBottom) {
	        return activatorPosition.top + activatorPosition.height + SPACING + 'px';
	      }
	      return SPACING + 'px';
	    }
	  }, {
	    key: '_calculateHeight',
	    value: function _calculateHeight(activatorPosition, popoverOnBottom) {
	      var contentsHeight = this._elementPosition(this.contents).height;

	      if (popoverOnBottom) {
	        var windowHeight = window.innerHeight;
	        var availableHeight = windowHeight - activatorPosition.bottom - SPACING * 2;
	        if (availableHeight - contentsHeight < 0) {
	          return availableHeight + 'px';
	        }
	      }

	      if (!popoverOnBottom) {
	        var _availableHeight = activatorPosition.top - SPACING * 2;
	        if (contentsHeight > _availableHeight) {
	          return _availableHeight + 'px';
	        }
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