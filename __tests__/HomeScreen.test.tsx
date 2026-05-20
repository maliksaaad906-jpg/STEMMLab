import { formatReactionTime } from "../src/utils/reaction";

describe("formatReactionTime", () => {
  it("formats reaction time correctly", () => {
    expect(formatReactionTime(250)).toBe("250 ms");
  });
});