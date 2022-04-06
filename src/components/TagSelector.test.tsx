import { render, screen } from "@testing-library/react";
import TagSelector from "./TagSelector";

import Tags from "services/__mocks__/getTags.json";
import { pocketTagsToTags } from "utils";
const allTags = pocketTagsToTags(Tags.tags);

const setTagsSpy = jest.fn();
const result = render(
  <TagSelector suggestions={allTags} tags={[]} setTags={setTagsSpy} />
);

describe("Tag Selector", () => {
  it("should exist", () => {
    const anInput = screen.getByTestId("input");
    expect(anInput).toBeInTheDocument();
    // screen.debug(anInput);
    screen.debug(result.container);
  });
});
