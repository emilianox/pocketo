/* eslint-disable max-len */
import React from "react";

import ContentLoader from "react-content-loader";

import type { IContentLoaderProps } from "react-content-loader";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
function ItemLoader(parameters: IContentLoaderProps) {
  return (
    <ContentLoader
      backgroundColor="#2a2e37"
      // eslint-disable-next-line react/forbid-component-props
      className=" m-auto w-8/12"
      foregroundColor="#3d4451"
      height={265}
      speed={3}
      title="assa"
      uniqueKey="my-random-value"
      viewBox="3 50 1300 265"
      width={1300}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...parameters}
    >
      <path d="M 10.472 83.609 h 98.268 v 98.268 H 10.472 z M 122.153 87.21 h 1005.91 v 23.361 H 122.153 z M 122.066 117.949 h 882.672 v 17.673 H 122.066 z M 122.066 145.622 H 1277.88 v 48.593 H 122.066 z M 122.066 205.121 h 95.29 v 26.457 h -95.29 z M 226.181 205.121 h 95.29 v 26.457 h -95.29 z M 330.296 205.121 h 95.29 v 26.457 h -95.29 z" />
      <rect height="45" rx="16" ry="16" width="292" x="990" y="205" />
      <rect height="4" rx="0" ry="0" width="1266" x="12" y="260" />
    </ContentLoader>
  );
}

export default React.memo(ItemLoader);
