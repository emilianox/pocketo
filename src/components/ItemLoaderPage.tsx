import React from "react";

import ItemLoader from "./ItemLoader";

const margin = { marginTop: 120 };

function ItemLoaderPage() {
  return (
    <div style={margin}>
      <ItemLoader />
      <ItemLoader />
      <ItemLoader />
      <ItemLoader />
    </div>
  );
}

export default React.memo(ItemLoaderPage);
