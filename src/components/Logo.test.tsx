import { render, screen } from "@testing-library/react";
import Logo from "./Logo";

describe("is a svg", () => {
  it("should exist", () => {
    render(<Logo />);
    expect(screen.findByTestId("svg-logo")).toBeDefined();
  });
});
