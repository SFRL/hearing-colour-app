import { useState, useEffect } from "react";
import { Loop } from "@material-ui/icons";
import ColourCanvas from "./components/ColourCanvas";

import "./css/App.css";
import "./css/loading.css";

function App() {
  const [dim, setDim] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  useEffect(() => {
    const resize = () => {
      setDim({
        x: window.innerWidth,
        y: window.innerHeight,
      });
    };
    // Add event listener to resize canvas when window size changes
    window.addEventListener("resize", resize);
    // Remove event listener on dismount
    return () => window.removeEventListener("resize", resize);
  }, []);
  return (
    <div className="App" style={{ width: `${dim.x}px`, height: `${dim.y}px` }}>
      <div className="loading-screen">
        <h1>Loading</h1>
        <Loop className={"loading-loop"} style={{ fontSize: "3em" }} />
      </div>
      <ColourCanvas width={dim.x} height={dim.y} key={`${dim.x},${dim.y}`} />
    </div>
  );
}

export default App;
