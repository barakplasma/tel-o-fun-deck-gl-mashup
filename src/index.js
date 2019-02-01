import React from "react";
import ReactDOM from "react-dom";
import DeckGL, { ScreenGridLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";

import "./styles.css";

// Viewport settings
const viewState = {
  longitude: 34.77577120775825,
  latitude: 32.07406836952441,
  zoom: 12,
  pitch: 0,
  bearing: 0,
  width: "100%",
  height: "100%",
  controller: true
};

fetch("https://api.tel-aviv.gov.il/telofan/Stations")
  .then(res => {
    return res.json();
  })
  .then(data => {
    const formatted = feature => {
      return {
        COORDINATES: [feature.geometry.x, feature.geometry.y],
        SPACES: feature.attributes.free_bikes
      };
    };

    const formattedData = data.features.map(formatted);
    ReactDOM.render(
      <App data={formattedData} viewport={viewState} />,
      rootElement
    );
  });

const App = ({ data, viewport }) => {
  /**
   * Data format:
   * [
   *   {SPACES: 4, COORDINATES: [-122.42177834, 37.78346622]},
   *   ...
   * ]
   */
  const layer = new ScreenGridLayer({
    id: "screen-grid-layer",
    data,
    opacity: 0.8,
    cellSizePixels: 50,
    minColor: [0, 0, 0, 0],
    maxColor: [0, 180, 0, 255],
    getPosition: d => d.COORDINATES,
    getWeight: d => d.SPACES,
    onHover: info => {
      console.log(info);
    }
  });

  return (
    <DeckGL initialViewState={viewport} controller={true} layers={[layer]}>
      <StaticMap
        mapboxApiAccessToken={
          "pk.eyJ1IjoibWljaGFlbHNheG9uaXplIiwiYSI6ImNqcXF2ZjBneDBmYTg0Mm4ybGx6eG93MzAifQ.sHeu2iiT1MXzT1DghOThbg"
        }
      />
    </DeckGL>
  );
};

const rootElement = document.getElementById("root");
