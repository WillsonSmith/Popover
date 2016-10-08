const SPACING = 16;
const SCALE_POPOVER_BY = 1.05; // 5% because transform: scale(0.95);
const deactivateCover = document.getElementById('popover-deactivate-cover');

class Popover {
  constructor(node) {
    this.node = node;
    this.activated = false;
    this.handleActivation = this.handleActivation.bind(this);
    this._resizePopover = this._resizePopover.bind(this);

    this.constrainedWidth = this.node.hasAttribute('data-constrain-width');

    deactivateCover.addEventListener('click', this.handleActivation);

    this.activator = document.querySelector(`[data-popover-activator-for="${node.id}"]`);
    this.activator.addEventListener('click', this.handleActivation);

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
    this.activated = false;
  }

  activatePopover() {
    this._positionPopover();
    deactivateCover.setAttribute('data-popover-active', 'true');
    this.node.removeAttribute('data-hidden');
    this.activated = true;
  }

  _elementPosition(node) {
    const {top, right, bottom, left} = node.getBoundingClientRect();
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
    if (this.constrainedWidth) {
      this.node.style['max-width'] = `${activatorPosition.width}px`;
    }
    this.node.style.left = 0; // this calculates proper width on device rotation
    const popoverPosition = this._elementPosition(this.node);
    const popoverScale = this.activated ? 1 : SCALE_POPOVER_BY;
    const activatorCentered = ((activatorPosition.left + (activatorPosition.width / 2)) - ((popoverPosition.width * popoverScale) / 2));

    if (activatorCentered > 0) {
      this.node.style.left = `${activatorCentered}px`;
    } else {
      this.node.style.left = `${SPACING}px`;
    }
    this.node.style.top = `${activatorPosition.top + activatorPosition.height + SPACING}px`;
    this.node.classList.add('popover--bottom-shadow'); // should be set based on position, use another method
  }
}
