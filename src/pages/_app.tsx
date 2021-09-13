import "tailwindcss/tailwind.css";

import "styles/app.scss";
import "styles/react-mention.scss";
import "styles/TagSelector.scss";

import React from "react";

import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";

import type { AppProps } from "next/app";

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/naming-convention
function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SnackbarProvider maxSnack={3}>
      {/* this is for SnackbarProvider that no support react strict */}
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <Head>
            <title>Pocketo</title>
          </Head>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </QueryClientProvider>
      </React.StrictMode>
    </SnackbarProvider>
  );
}

// // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
// export function reportWebVitals(metric: NextWebVitalsMetric) {
//   // eslint-disable-next-line no-console
//   console.log(metric);
// }

export default MyApp;
