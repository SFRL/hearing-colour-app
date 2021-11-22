import { useState } from "react";
import { Loop } from "@material-ui/icons";
import "../css/introduction.css";
import "../css/loading.css";
import "../css/button.css";

const Introduction = ({ loaded }) => {
  const [display, setDisplay] = useState(true);

  const hideDisplay = () => setDisplay(false);
  const content = display ? (
    <div className="introduction">
      <div>
        <h1>Welcome to the Colour-App</h1>
        <ol>
          <li>
            You can <b>click anywhere on the screen</b> to select a colour.
          </li>
          <li>
            After clicking on the screen, a{" "}
            <b>circle with your selected colour</b> will appear
          </li>
          <li>
            Wait for the circle to fully load and disappear, it will be{" "}
            <b>submitted to the big screen above the stage</b>
          </li>
        </ol>
        {loaded ? (
          <button onClick={hideDisplay}>START</button>
        ) : (
          <span>
            <h2>Loading</h2>
            <Loop className={"loading-loop"} style={{ fontSize: "3em" }} />
          </span>
        )}
      </div>
    </div>
  ) : (
    ""
  );

  return content;
};

export default Introduction;
