import type { NextApiRequest, NextApiResponse } from "next";
import type { DeepReadonly } from "ts-essentials/dist/types";

export default async function assaas(
  req: DeepReadonly<NextApiRequest>,
  res: DeepReadonly<NextApiResponse>
) {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const accessToken = process.env.POCKET_ACCESS_TOKEN!;
  const consumerKey = process.env.POCKET_CONSUMER_KEY!;
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  const response = await fetch(
    `https://getpocket.com/v3/get?access_token=${accessToken}&consumer_key=${consumerKey}&taglist=1&forcetaglist=1&since=${Date.now()}`
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const jsonData = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  res.status(200).json(jsonData);
}
