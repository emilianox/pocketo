// import next is not shadowed
// eslint-disable-next-line @typescript-eslint/no-shadow
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
} from "next/document";

// required by nextjs
// eslint-disable-next-line fp/no-class
class MyDocument extends Document {
  // ctx cant be readonly
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  public static async getInitialProps(ctx: DocumentContext) {
    return await Document.getInitialProps(ctx);
  }

  public render() {
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
