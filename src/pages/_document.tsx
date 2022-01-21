/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable fp/no-class */

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html data-theme="dark">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
