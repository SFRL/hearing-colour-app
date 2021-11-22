import { useState, useRef, useEffect, useCallback } from "react";
import Introduction from "./Introduction";
import Picker from "./Picker.js";
import getColour from "../util/getColour.js";

const ColourCanvas = ({ width, height }) => {
  const canvas = useRef(null);
  const [pressed, setPressed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const dismountPicker = useCallback(() => setPressed(false), [setPressed]);

  // Add event listeners for mouse events
  useEffect(() => {
    const setMouseDown = (e) => {
      const X = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
      const Y = e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
      setPressed({ x: X, y: Y });
    };
    const setMouseUp = () => setPressed(false);
    window.addEventListener("mousedown", setMouseDown);
    window.addEventListener("touchstart", setMouseDown);
    window.addEventListener("mouseup", setMouseUp);
    window.addEventListener("touchend", setMouseUp);
    return () => {
      window.removeEventListener("mousedown", setMouseDown);
      window.removeEventListener("touchstart", setMouseDown);
      window.removeEventListener("mouseup", setMouseUp);
      window.removeEventListener("touchend", setMouseUp);
    };
  }, []);

  // Fill Canvas with colours when component is rerendered
  useEffect(() => {
    const fillCanvas = () => {
      // Get canvas context
      const ctx = canvas.current.getContext("2d");

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          ctx.fillStyle = getColour(x / width, y / height);
          ctx.fillRect(x, y, 1, 1);
        }
      }
      return true;
    };

    fillCanvas();
    setLoaded(true);
  }, [width, height, setLoaded]);

  const pickerElement = pressed ? (
    <Picker
      canvasDim={{ x: width, y: height }}
      pos={pressed}
      callback={dismountPicker}
    />
  ) : (
    ""
  );
  return (
    <>
      <Introduction loaded={loaded} />
      {pickerElement}
      <canvas width={width} height={height} ref={canvas}></canvas>
    </>
  );
};

export default ColourCanvas;
