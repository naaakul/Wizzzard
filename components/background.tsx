import React from "react";

const Bg = () => {
  return (
    <div className="absolute w-full h-full top-0 left-0 z-0">
      <div className="relative w-full h-full overflow-hidden">
        <div className="w-[120%] h-full absolute -translate-x-1/2 left-1/2  top-0 bg-[radial-gradient(ellipse_at_bottom,_#000000_0%,_#6526A8_48%,_#894FBF_85%,_#A68BB5_100%)]"></div>
        <div className="w-full h-full absolute top-0 left-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,0,0,1)_0%,_rgba(0,0,0,0.98)_45%,_rgba(0,0,0,0)_134%)]"></div>
      </div>
    </div>
  );
};

export default Bg;
