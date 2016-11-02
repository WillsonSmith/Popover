const SPACING = 16;
const SCALE_POPOVER_BY = 1.05; // 5% because transform: scale(0.95);
const popoverHoler = document.querySelector('.popover-holder');
const deactivateCover = document.getElementById('popover-deactivate-cover');
const popoverIds = Array.from(document.getElementsByClassName('popover-activator'))
  .map((activator) => activator.getAttribute('data-popover-activator-for'));

function nextTabElement(index, items) {
  return items[index + 1 <= items.length - 1 ? index + 1 : 0];
}

function prevTabElement(index, items) {
  return items[index - 1 >= 0 ? index - 1 : items.length - 1];
}

export default class Popover {
  constructor(node, focusableFunction) {
    this.node = node;
    this.contents = node.querySelector('.popover-contents');
    this.activated = false;

    this.shiftDown = false;

    this.focusableElements = function(container) {
      const containerElement = container || document.body;
      return focusableFunction(containerElement)
        .filter((element) => !popoverIds.includes(element.id));
    };

    this.constrainedWidth = this.node.hasAttribute('data-constrain-width');
    this.activator = document.querySelector(`[data-popover-activator-for="${node.id}"]`);

    document.addEventListener('keydown', (evt) => {
      if (evt.keyCode === 16) {
        this.shiftDown = true;
      }
    });

    document.addEventListener('keyup', (evt) => {
      if (evt.keyCode === 16) {
        this.shiftDown = false;
      }
    });

    this.node.addEventListener('keydown', this._popoverTabHandler.bind(this));
    this.node.addEventListener('blur', this._blurEventHandler.bind(this));

    // this.activator.addEventListener('focus', this.activatePopover.bind(this));
    this.activator.addEventListener('click', () => { window.location.href = `#${this.activator.getAttribute('data-popover-activator-for')}` });
    this.node.addEventListener('focus', this.activatePopover.bind(this));
    this.activator.addEventListener('keydown', this._activatorTabHandler.bind(this));

    deactivateCover.addEventListener('click', this.deactivatePopover.bind(this));
    window.addEventListener('resize', this._resizePopover.bind(this));
    // clean up listeners
  }

  deactivatePopover() {
    deactivateCover.removeAttribute('data-popover-active');
    this.node.setAttribute('data-hidden', 'true');
    this.node.removeAttribute('style');
    this.activated = false;
  }

  activatePopover() {
    if (this.activated) { return; }
    this._positionPopover();
    deactivateCover.setAttribute('data-popover-active', 'true');
    this.node.removeAttribute('data-hidden');
    this.activated = true;
  }

  _blurEventHandler(evt) {
    if (this.node.contains(evt.relatedTarget) || evt.relatedTarget === this.activator) {
      return;
    }
    this.deactivatePopover();
  }

  _popoverTabHandler(evt) {
    evt.preventDefault();
    const popoverFocusable = this.focusableElements(this.node);
    const focusableElements = this.focusableElements()
      .filter((element) => !popoverHoler.contains(element));
    const focusedIndex = popoverFocusable.indexOf(document.activeElement);

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

  _activatorTabHandler(evt) {
    if (!this.activated) { return; }
    evt.preventDefault();
    const popoverFocusable = this.focusableElements(this.node);
    const focusableElements = this.focusableElements().filter((element) => !popoverFocusable.includes(element));

    if (evt.keyCode === 9 && !this.shiftDown) {
      this.node.focus();
    }
    if (evt.keyCode === 9 && this.shiftDown) {
      const activatorIndex = focusableElements.indexOf(this.activator);
      prevTabElement(activatorIndex, focusableElements).focus();
      this.deactivatePopover();
    }
  }

  _elementPosition(node) {
    const clientRect = node.getBoundingClientRect();
    let {top, bottom} = clientRect;
    const {right, left} = clientRect;
    const scrollPosition = window.pageYOffset;
    top += scrollPosition;
    bottom += scrollPosition;
    return {
      top,
      right,
      bottom,
      left,
      width: right - left,
      height: bottom - top,
    };
  }

  _resizePopover() {
    if (this.activated) {
      window.requestAnimationFrame(() => {
        this._positionPopover();
      });
    }
  }

  _positionPopover() {
    const activatorPosition = this._elementPosition(this.activator);
    const activatorCenter = (activatorPosition.left + (activatorPosition.width / 2));
    if (this.constrainedWidth) {
      this.node.style['max-width'] = `${activatorPosition.width}px`;
    }
    this.node.style.left = null; // this calculates proper width on device rotation
    this.node.style.right = null;
    this.node.style.height = null;
    const popoverPosition = this._elementPosition(this.node);
    const popoverScale = this.activated ? 1 : SCALE_POPOVER_BY;
    const popoverCenter = ((popoverPosition.width * popoverScale) / 2);
    const popoverOnBottom = this._popoverOnBottom();

    this._calculateLeftRight(activatorPosition, activatorCenter, popoverCenter);
    this._setClasses(popoverOnBottom);
    this.node.style.height = this._calculateHeight(activatorPosition, popoverOnBottom);
    this.node.style.top = this._calculateTopPosition(activatorPosition);
  }

  _popoverOnBottom() {
    const windowHeight = window.innerHeight;
    const {top, bottom} = this._elementPosition(this.activator);
    return windowHeight - bottom > top;
  }

  _setClasses(popoverOnBottom) {
    this.node.classList.remove('popover--bottom-shadow', 'popover--top-shadow');
    if (popoverOnBottom) {
      this.node.classList.add('popover--bottom-shadow');
      return;
    }
    this.node.classList.add('popover--top-shadow');
  }

  _calculateTopPosition(activatorPosition) {
    const popoverOnBottom = this._popoverOnBottom();
    if (popoverOnBottom) {
      return `${activatorPosition.top + activatorPosition.height + SPACING}px`;
    }
    return `${SPACING}px`;
  }

  _calculateHeight(activatorPosition, popoverOnBottom) {
    const contentsHeight = this._elementPosition(this.contents).height;

    if (popoverOnBottom) {
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - activatorPosition.bottom - (SPACING * 2);
      if (availableHeight - contentsHeight < 0) {
        return `${availableHeight}px`;
      }
    }

    if (!popoverOnBottom) {
      const availableHeight = activatorPosition.top - (SPACING * 2); 
      if (contentsHeight > availableHeight) {
        return `${availableHeight}px`;
      }
    }
  }

  _calculateLeftRight(activator, activatorCenter, popoverCenter) {
    const windowWidth = window.innerWidth;
    const activatorCentered = activatorCenter - popoverCenter;
    const tooFarLeft = (activatorCentered > 0);
    const tooFarRight = (activatorCenter + popoverCenter > windowWidth);

    if (tooFarLeft) {
      this.node.style.left = `${activatorCentered}px`;
    }
    if (tooFarRight) {
      this.node.style.right = `${windowWidth - activator.right}px`;
    }
    if (activatorCentered < 0) {
      this.node.style.left = `${activator.left}px`;
    }
  }
}
