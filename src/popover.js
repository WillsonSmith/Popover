const SPACING = 16;
const SCALE_POPOVER_BY = 1.05; // 5% because transform: scale(0.95);
const deactivateCover = document.getElementById('popover-deactivate-cover');

export default class Popover {
  constructor(node, focusableElements) {
    this.node = node;
    this.contents = node.querySelector('.popover-contents');
    this.activated = false;

    this.shiftDown = false;
    this.focusableElements = focusableElements;

    this.handleActivation = this.handleActivation.bind(this);
    this.activatePopover = this.activatePopover.bind(this);
    this.deactivatePopover = this.deactivatePopover.bind(this);
    this._resizePopover = this._resizePopover.bind(this);
    this.constrainedWidth = this.node.hasAttribute('data-constrain-width');
    this.activator = document.querySelector(`[data-popover-activator-for="${node.id}"]`);

    this.activator.addEventListener('keydown', (evt) => this._tabEventHandler(evt, this.node));

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

    this.node.addEventListener('keydown', (evt) => {
      evt.preventDefault();

      // need to tab into popover as well.
      if (evt.keyCode === 9 && !this.shiftDown) {
        const activatorIndex = focusableElements.indexOf(this.activator);
        const nextIndex = activatorIndex + 1 <= focusableElements.length - 1 ? activatorIndex + 1 : 0;
        focusableElements[nextIndex].focus();
      }

      if (evt.keyCode === 9 && this.shiftDown) {
        this.activator.focus();
      }
    });

    this.activator.addEventListener('focus', this.activatePopover);
    this.activator.addEventListener('click', () => { this.activator.focus(); });

    this.node.addEventListener('blur', this.deactivatePopover);

    deactivateCover.addEventListener('click', this.deactivatePopover);
    window.addEventListener('resize', this._resizePopover);
    // clean up listeners
  }

  handleActivation() {
    if (this.activated) {
      this.deactivatePopover();
    } else {
      this.activatePopover();
    }
  }

  deactivatePopover() {
    deactivateCover.removeAttribute('data-popover-active');
    this.node.setAttribute('data-hidden', 'true');
    this.node.removeAttribute('style');
    this.activated = false;
  }

  activatePopover() {
    if (!this.activated) {
      this._positionPopover();
      deactivateCover.setAttribute('data-popover-active', 'true');
      this.node.removeAttribute('data-hidden');
      this.activated = true;
    }
  }

  _tabEventHandler(evt, focusNode) {
    if (!this.activated) {
      return;
    }
    evt.preventDefault();

    if (evt.keyCode === 9 && !this.shiftDown) {
      focusNode.focus();
    }
    if (evt.keyCode === 9 && this.shiftDown) {
      const activatorIndex = this.focusableElements.indexOf(this.activator);
      const prevIndex = activatorIndex - 1 >= 0 ? activatorIndex - 1 : this.focusableElements.length - 1;
      this.deactivatePopover();
      this.focusableElements[prevIndex].focus();
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

    // can probably avoid this calc if constrained width
    this._calculateLeftRight(activatorPosition, activatorCenter, popoverCenter);
    this._calculateHeight(activatorPosition.bottom, popoverPosition.height);

    this.node.style.top = `${activatorPosition.top + activatorPosition.height + SPACING}px`;
    this.node.classList.add('popover--bottom-shadow'); // should be set based on position, use another method
  }

  _calculateHeight(activatorBottom) {
    const windowHeight = window.innerHeight;
    const contentsHeight = this._elementPosition(this.contents).height;
    // spacing * 2 because of top spacing
    const availableHeight = windowHeight - activatorBottom - (SPACING * 2);
    if (availableHeight - contentsHeight < 0) {
      this.node.style.height = `${availableHeight}px`;
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
