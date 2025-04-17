let highestZ = 1;
let interactedCount = 0;
const totalPapers = document.querySelectorAll('.paper').length;
const interactedPapers = new Set();

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  offsetX = 0;
  offsetY = 0;
  rotating = false;

  init(paper) {
    const isTouch = 'ontouchstart' in window;

    const getClientCoords = (e) => {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else {
        return { x: e.clientX, y: e.clientY };
      }
    };

    const moveHandler = (e) => {
      if (!this.holdingPaper) return;

      const { x: clientX, y: clientY } = getClientCoords(e);

      if (!this.rotating) {
        this.velX = clientX - this.prevX;
        this.velY = clientY - this.prevY;
        this.offsetX += this.velX;
        this.offsetY += this.velY;
      }

      const dirX = clientX - this.startX;
      const dirY = clientY - this.startY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
      const angle = Math.atan2(dirY / dirLength, dirX / dirLength);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      this.prevX = clientX;
      this.prevY = clientY;

      paper.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) rotateZ(${this.rotation}deg)`;
    };

    const startHandler = (e) => {
      e.preventDefault();

      const { x, y } = getClientCoords(e);
      this.startX = this.prevX = x;
      this.startY = this.prevY = y;

      this.holdingPaper = true;
      this.rotating = (!e.touches && e.button === 2); // right-click for rotate

      paper.style.zIndex = highestZ++;

      // Track interaction
      if (!interactedPapers.has(paper)) {
        interactedPapers.add(paper);
        interactedCount++;
        if (interactedCount === totalPapers) {
          document.getElementById('nextBtn').style.display = 'block';
        }
      }
    };

    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Mouse Events
    paper.addEventListener('mousedown', startHandler);
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', endHandler);

    // Touch Events
    paper.addEventListener('touchstart', startHandler, { passive: false });
    window.addEventListener('touchmove', moveHandler, { passive: false });
    window.addEventListener('touchend', endHandler);
  }
}

document.querySelectorAll('.paper').forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
