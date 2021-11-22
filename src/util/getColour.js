// Expects values between 0 and 1
const getColour = function (interX, interY) {
  // Check that values are within range
  if (interX <= 1 && interY <= 1 && interX >= 0 && interY >= 0) {
    let x = interX - 0.5;
    let y = interY - 0.5;
    // Hue will be described angle between interX and interY
    let angle = (Math.atan2(y, x) / Math.PI + 1) * 180;
    let length = Math.max(Math.abs(x), Math.abs(y));
    let hue = angle;
    let sat = 100;
    let light = (1 - 1.2 * length) * 100;

    return `hsl(${hue},${sat}%,${light}%)`;
  } else {
    return `hsl(0,0%,0%)`;
  }
};

export default getColour;
