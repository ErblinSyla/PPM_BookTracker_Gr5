import React from "react";
import { render } from "@testing-library/react-native";
import PrimaryButton from "../../app/components/PrimaryButton";

describe("PrimaryButton", () => {
  it("renders correctly", () => {
    const tree = render(<PrimaryButton title="Save Changes" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows disabled state", () => {
    const tree = render(<PrimaryButton title="Disabled" disabled />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
