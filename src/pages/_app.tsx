import "tailwindcss/tailwind.css";
import "styles/app.scss";

import "styles/TagSelector.scss";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/naming-convention
function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Pocketo</title>
      </Head>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

// // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
// export function reportWebVitals(metric: NextWebVitalsMetric) {
//   // eslint-disable-next-line no-console
//   console.log(metric);
// }

export default MyApp;
