const SPACING = 16;
const SCALE_POPOVER_BY = 1.05; // 5% because transform: scale(0.95);
const deactivateCover = document.getElementById('popover-deactivate-cover');

class Popover {
  constructor(node) {
    this.node = node;
    this.activated = false;
    this.handleActivation = this.handleActivation.bind(this);
    this._resizePopover = this._resizePopover.bind(this);

    deactivateCover.addEventListener('click', this.handleActivation);

    this.activator = document.querySelector(`[data-popover-activator-for="${node.id}"]`);
    this.activator.addEventListener('click', this.handleActivation);

    window.addEventListener('resize', this._resizePopover); // needs throttle/requestAnimationFrame

    // make this less garbage
    const activatorStats = this._elementPosition(this.activator);
    const activatorWidth = activatorStats.right - activatorStats.left;
    if (this.node.hasAttribute('data-constrain-width')) {
      this.node.style['max-width'] = `${activatorWidth}px`;
    }

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
    this._positionPopover(this._elementPosition(this.activator), this._elementPosition(this.node));
    deactivateCover.setAttribute('data-popover-active', 'true');
    this.node.removeAttribute('data-hidden');
    this.activated = true;
  }

  _elementPosition(node) {
    const {top, right, bottom, left} = node.getBoundingClientRect();
    return {top, right, bottom, left};
  }

  _resizePopover() {
    window.requestAnimationFrame(() => {
      this._positionPopover(this._elementPosition(this.activator), this._elementPosition(this.node));
    });
  }

  _positionPopover(activatorPosition, popoverPosition) {
    const activatorWidth = activatorPosition.right - activatorPosition.left;
    const activatorHeight = activatorPosition.bottom - activatorPosition.top;
    const popoverWidth = popoverPosition.right - popoverPosition.left;
    const popoverHeight = popoverPosition.bottom - popoverPosition.top;

    const activatorCentered = ((activatorPosition.left + (activatorWidth / 2)) - ((popoverWidth * SCALE_POPOVER_BY) / 2));
    if (activatorCentered > 0) {
      this.node.style.left = `${activatorCentered}px`;
    } else {
      this.node.style.left = `${SPACING}px`;
    }

    this.node.style.top = `${activatorPosition.top + activatorHeight + SPACING}px`;
    this.node.classList.add('popover--bottom-shadow'); // should be set based on position, use another method
  }
}
