import { describe, expect, it } from "vitest";
import { isAllowedClientOrigin } from "../src/index.js";

describe("app setup", () => {
  it("allows the deployed Render app to load its own assets", () => {
    // Arrange
    const renderOrigin = "https://cohort-compass.onrender.com";

    // Act
    const isAllowed = isAllowedClientOrigin(renderOrigin);

    // Assert
    expect(isAllowed).toBe(true);
  });

  it("allows requests without an origin header", () => {
    // Arrange
    const origin = undefined;

    // Act
    const isAllowed = isAllowedClientOrigin(origin);

    // Assert
    expect(isAllowed).toBe(true);
  });
});
