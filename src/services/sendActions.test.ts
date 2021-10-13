/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable jest/prefer-strict-equal */
/* eslint-disable jest/prefer-expect-assertions */
/* eslint-disable import/no-namespace */
import * as sendActions from "./sendActions";

// @ponicode
describe("sendActions.createFavoriteAction", () => {
  it("0", () => {
    const result: any = sendActions.createFavoriteAction("0", "10");

    expect(result).toEqual({ action: "favorite", item_id: "10" });
  });

  it("1", () => {
    const result: any = sendActions.createFavoriteAction("1", "11");

    expect(result).toEqual({ action: "unfavorite", item_id: "11" });
  });

  it("2", () => {
    const result: any = sendActions.createFavoriteAction("1", "a1969970175");

    expect(result).toEqual({ action: "unfavorite", item_id: "a1969970175" });
  });

  it("3", () => {
    const result: any = sendActions.createFavoriteAction("1", "56_784");

    expect(result).toEqual({ action: "unfavorite", item_id: "56_784" });
  });
});

// @ponicode
describe("sendActions.createArchiveAction", () => {
  it("0", () => {
    const result: any = sendActions.createArchiveAction("sdadssad");

    expect(result).toEqual({ action: "archive", item_id: "sdadssad" });
  });

  it("1", () => {
    const result: any = sendActions.createArchiveAction("George");

    expect(result).toEqual({ action: "archive", item_id: "George" });
  });

  it("2", () => {
    const result: any = sendActions.createArchiveAction("sdadssad>");

    expect(result).toEqual({ action: "archive", item_id: "sdadssad>" });
  });
});
