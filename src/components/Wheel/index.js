import React from "react";
import "./index.css";
import PropTypes from "prop-types";
import spinSound from "../../sounds/spinSound.mp3";

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      audio: new Audio(spinSound)
    };
    this.selectItem = this.selectItem.bind(this);
  }

  selectItem() {
    if (this.props.items.length === 0 || this.props.spinning === true) {
      console.log("Can't spin empty wheel");
      return;
    }
    if (this.state.selectedItem === null) {
      // Play the sound first
      this.state.audio.play() // Delay to simulate spinning   
        setTimeout(() => {
          this.state.audio.pause()
      }, 8000);  

      const selectedItem = Math.floor(Math.random() * this.props.items.length);
      this.props.onChange(selectedItem);
      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem);
      }
      this.setState({ selectedItem });
    } else {
      this.setState({ selectedItem: null }, () => {
        setTimeout(this.selectItem, 500); // Delay to simulate spinning
      });
    }
  }

  render() {
    const { selectedItem } = this.state;
    const { items, colors, fontColor } = this.props;
const magicNumber = items.length>6?1:items.length===6?1.1:items.length===5?1.1:items.length===4?1.2:items.length===3?1.55:items.length===2?300:1000;


    const wheelVars = {
      "--nb-item": items.length,
      "--selected-item": selectedItem,
    };
    const spinning = selectedItem !== null ? "spinning" : "";

    let spinDuration = localStorage.getItem("duration");

    let cssProperties = {};
    
    cssProperties["--spinning-duration"] = `${spinDuration}s`;
    cssProperties["--neutral-color"] = `${this.props.fontColor}`;

    if (cssProperties["--neutral-color"] === "null")
      cssProperties["--neutral-color"] = "#000000";

    return (
      <div style={cssProperties}>
        <h1
          className="text-center p-5 underline font-bold text-xl tracking-widest"
          style={{ textAlign: "center" }}
        >
          Click Center to spin
        </h1>
        <div className="wheel-container">
          <div
            lg={true}
            className={`wheel ${spinning}`}
            style={wheelVars}
            onClick={this.selectItem}
          >
            {items.map((item, index) => (
              <div
                className="wheel-item"
                key={index}
                style={{
                  "--item-nb": index,
                  "color": fontColor,
                 "font-weight": "bold", 
                  backgroundColor: colors[index] || "#d38c12", // Use the color from the colors array or a default color
                  "--nb-value": 30* magicNumber /items.length,
                  "--neutral-color": "black"
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

// Define prop types
Wheel.propTypes = {
  items: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
};

// Define default prop values
Wheel.defaultProps = {
  items: [
    "30% SITEWIDE OFF",
    "BUY 1 GET 1 FREE",
    "PURCHASE WORTH 1000+",
    "BUY 2 EFFERVESCENT",
    "50G TEA OF RS. 500",
    "HOT CHOCOLATE TEA",
  ],
  colors: ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00"], // Default colors
};
