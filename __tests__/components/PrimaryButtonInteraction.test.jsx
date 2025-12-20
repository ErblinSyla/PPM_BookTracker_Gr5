import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PrimaryButton from "../../app/components/PrimaryButton";

describe("PrimaryButton Interaction", () => {
  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();

    const { getByText } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} />
    );

    fireEvent.press(getByText("Click Me"));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("applies custom style when style prop is passed", () => {
    const customStyle = { backgroundColor: "blue", marginTop: 20 };

    const { getByTestId } = render(
      <PrimaryButton
        title="Styled Button"
        style={customStyle}
        testID="primary-button"
      />
    );

    const button = getByTestId("primary-button");

    const appliedStyle = button.props.style;

    expect(appliedStyle.backgroundColor).toBe("blue");
    expect(appliedStyle.marginTop).toBe(20);
  });
});
