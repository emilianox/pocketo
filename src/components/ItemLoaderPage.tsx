import React from "react";

import ItemLoader from "./ItemLoader";

function ItemLoaderPage() {
  return (
    <>
      <ItemLoader />
      <ItemLoader />
      <ItemLoader />
      <ItemLoader />
    </>
  );
}

export default React.memo(ItemLoaderPage);
