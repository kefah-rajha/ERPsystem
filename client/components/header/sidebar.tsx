import React from "react";
import SidebarItems from "@/components/header/sidebarItems";
function Sidebar() {
  return (
    <div className="bg-[#242424] heighWithOutBar w-full">
      <div className="h-[66%]">
        <div>
          <SidebarItems />
        </div>
      </div>
      <div className="h-[34%] bg-[#313131]"></div>

      <div></div>
    </div>
  );
}

export default Sidebar;
