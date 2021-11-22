import { useState, useEffect } from "react";
import getColour from "../util/getColour";
import submitData from "../firebase/submit";
import "../css/picker.css";

// Time it takes for data to submit in seconds
const TIME = 1.5;

const getRadius = (canvasDim) => {
  const [x, y] = [canvasDim.x, canvasDim.y];
  // Handle mobile phone case
  if (x < 1000) return Math.min(x * 0.3, y * 0.3);
  return Math.min(x * 0.2, y * 0.2);
};

const Picker = ({ canvasDim, pos, callback }) => {
  const radius = getRadius(canvasDim);
  const bg = getColour(pos.x / canvasDim.x, pos.y / canvasDim.y);
  const [style, setStyle] = useState({
    top: `${pos.y - 1.1 * radius}px`,
    left: `${pos.x - 0.5 * radius}px`,
    width: `${radius}px`,
    height: `${radius}px`,
    "--bg": bg,
    "--time": `${TIME}s`,
  });

  const [timeover, setTimeover] = useState(false);

  useEffect(() => {
    //   Create timer upon mount
    const timer = setTimeout(() => setTimeover(true), TIME * 1000);
    // Clear interval when component dismounts
    return () => clearTimeout(timer);
  }, [setTimeover]);

  useEffect(() => {
    const setMousePos = (e) => {
      const X = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
      const Y = e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
      const bg = getColour(X / canvasDim.x, Y / canvasDim.y);
      setStyle({
        ...style,
        top: `${Y - 1.1 * radius}px`,
        left: `${X - 0.5 * radius}px`,
        "--bg": bg,
      });
    };
    window.addEventListener("mousemove", setMousePos);
    window.addEventListener("touchmove", setMousePos);

    const submitColour = () => {
      const c = style["--bg"];
      const time = new Date().getTime();
      submitData({ timestamp: time, colour: c });
      // Let parent know that data has been submitted and component should dismount
      callback();
    };

    if (timeover) {
      submitColour();
    }

    return () => {
      window.removeEventListener("mousemove", setMousePos);
      window.removeEventListener("touchmove", setMousePos);
    };
  }, [setStyle, style, timeover, callback, canvasDim.x, canvasDim.y, radius]);
  return (
    <div className="picker" style={style}>
      <div></div>
    </div>
  );
};

export default Picker;
