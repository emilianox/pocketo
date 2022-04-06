import * as index from "./index";
import Tags from "services/__mocks__/getTags.json";

// @ponicode
describe("index.pocketTagsToTags", () => {
  test("wrong values", () => {
    let result: any = index.pocketTagsToTags(Tags.tags);
    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    //@ts-expect-error
    expect(() => index.pocketTagsToTags("")).toThrow();
  });

  test("1", () => {
    let result: any = index.pocketTagsToTags(Tags.tags);
    expect(result).toStrictEqual([
      { id: "saas", text: "saas" },
      { id: "jquery", text: "jquery" },
      { id: "developer", text: "developer" },
      { id: "framework", text: "framework" },
      { id: "design", text: "design" },
    ]);
  });

  test("one element", () => {
    let result: any = index.pocketTagsToTags([Tags.tags[0]]);
    expect(result).toStrictEqual([{ id: "saas", text: "saas" }]);
  });

  test("empty", () => {
    let result: any = index.pocketTagsToTags([]);
    expect(result).toStrictEqual([]);
  });
});
