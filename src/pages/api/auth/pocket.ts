/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
/* eslint-disable import/no-anonymous-default-export */
//   console.log("res", res);
//   res.status(200).json({ name: "John Doe" });
import auth from "pocket-auth";

import type { NextApiRequest, NextApiResponse } from "next";

interface Data {
  name: string;
}

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const consumerKey = process.env.POCKET_CONSUMER_KEY;
  const redirectUri = process.env.POCKET_REDIRECT_URI;

  auth.fetchToken(
    consumerKey,
    redirectUri,
    {},
    function (
      error: unknown,
      code: {
        code: string;
      }
    ) {
      const uri = auth.getRedirectUrl(code.code, redirectUri);

      console.log(
        "Visit the following URL and click approve in the next 10 seconds:"
      );
      console.log(uri);

      setTimeout(function () {
        auth.getAccessToken(
          consumerKey,
          code.code,
          function (error_: unknown, r: unknown) {
            if (error_) {
              console.log(
                "You didn't click the link and approve the application in time"
              );

              return;
            }

            console.log(r);
          }
        );
      }, 10_000);
    }
  );
};
