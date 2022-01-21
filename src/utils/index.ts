/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { ResponseGetTagsPocketApi } from "services/useTagGet";

import type { Tag } from "react-tag-input";

export const pocketTagsToTags = (
  pocketTags: ResponseGetTagsPocketApi["tags"]
): Tag[] => pocketTags.map((tag) => ({ id: tag, text: tag }));
