import React, { useState } from "react";

const SplitCell = ({ width, height }) => {
  const [hoverSide, setHoverSide] = useState(null);
  const [split, setSplit] = useState(null); // 'horizontal' or 'vertical'

  const handleMouseMove = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = target;

    if (split) return;

    // Decide which direction based on cursor position
    const isVertical = offsetX > offsetWidth / 4 && offsetX < (3 * offsetWidth) / 4;
    const isHorizontal = offsetY > offsetHeight / 4 && offsetY < (3 * offsetHeight) / 4;

    if (isVertical && offsetY < offsetHeight / 2) setHoverSide("horizontal");
    else if (isVertical && offsetY >= offsetHeight / 2) setHoverSide("horizontal");
    else if (isHorizontal && offsetX < offsetWidth / 2) setHoverSide("vertical");
    else if (isHorizontal && offsetX >= offsetWidth / 2) setHoverSide("vertical");
    else setHoverSide(null);
  };

  const handleClick = () => {
    if (hoverSide && !split) {
      setSplit(hoverSide);
    }
  };

  if (split === "horizontal") {
    return (
      <div className="flex flex-col w-full h-full">
        <SplitCell width="100%" height="50%" />
        <SplitCell width="100%" height="50%" />
      </div>
    );
  }

  if (split === "vertical") {
    return (
      <div className="flex flex-row w-full h-full">
        <SplitCell width="50%" height="100%" />
        <SplitCell width="50%" height="100%" />
      </div>
    );
  }

  return (
    <div
      className="relative border border-gray-300 bg-white transition-all duration-300"
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Hover line */}
      {hoverSide === "horizontal" && (
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-darkBlue opacity-70 -translate-y-1/2 pointer-events-none" />
      )}
      {hoverSide === "vertical" && (
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-darkBlue opacity-70 -translate-x-1/2 pointer-events-none" />
      )}
    </div>
  );
};

const GridSplitter = () => {
  return (
    <div className="w-full h-[400px] p-4 bg-lightGray flex items-center justify-center">
      <div className="w-[300px] h-[300px]">
        <SplitCell width="100%" height="100%" />
      </div>
    </div>
  );
};

export default GridSplitter;
