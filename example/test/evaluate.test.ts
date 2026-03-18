import { describe, it, expect } from "vitest";
import { evaluate, evaluateFilter } from "../src/compiler";

const context = {
  note: {
    title: "Test Note",
    status: "done",
    priority: 5,
    tags: ["todo", "important"],
    score: 42,
  },
  file: {
    name: "test-note",
    path: "notes/test-note.md",
    folder: "notes",
    ext: "md",
    tags: ["todo", "important"],
    links: ["other-note"],
    created: "2024-01-01T00:00:00Z",
    modified: "2024-06-15T00:00:00Z",
  },
  formula: {
    doubled: 84,
    label: "high-priority",
  },
};

describe("evaluate", () => {
  it("evaluates arithmetic expressions", () => {
    expect(evaluate("1 + 2", context)).toBe(3);
    expect(evaluate("10 - 3", context)).toBe(7);
    expect(evaluate("2 * 3", context)).toBe(6);
    expect(evaluate("10 / 2", context)).toBe(5);
  });

  it("evaluates string concatenation", () => {
    expect(evaluate('"hello" + " " + "world"', context)).toBe("hello world");
  });

  it("evaluates comparisons", () => {
    expect(evaluate("5 > 3", context)).toBe(true);
    expect(evaluate("2 == 2", context)).toBe(true);
    expect(evaluate("3 != 4", context)).toBe(true);
  });

  it("evaluates logical operators", () => {
    expect(evaluate("true && false", context)).toBe(false);
    expect(evaluate("true || false", context)).toBe(true);
    expect(evaluate("!true", context)).toBe(false);
  });

  it("short-circuits logical expressions", () => {
    expect(evaluate("false && error_func()", context)).toBe(false);
  });

  it("resolves property access", () => {
    expect(evaluate("title", context)).toBe("Test Note");
    expect(evaluate("file.name", context)).toBe("test-note");
    expect(evaluate("formula.doubled", context)).toBe(84);
    expect(evaluate("note.status", context)).toBe("done");
  });

  it("evaluates global function calls", () => {
    expect(evaluate('contains(tags, "todo")', context)).toBe(true);
    expect(evaluate('contains(tags, "missing")', context)).toBe(false);
    expect(evaluate('if(true, "yes", "no")', context)).toBe("yes");
    expect(evaluate('if(false, "yes", "no")', context)).toBe("no");
  });

  it("evaluates numeric helpers", () => {
    expect(evaluate('number("42")', context)).toBe(42);
    expect(evaluate("min(1, 2, 3)", context)).toBe(1);
    expect(evaluate("max(1, 2, 3)", context)).toBe(3);
  });

  it("returns Date values for now()", () => {
    const result = evaluate("now()", context);
    expect(result).toBeInstanceOf(Date);
  });

  it("evaluates method calls", () => {
    expect(evaluate('"hello".upper()', context)).toBe("HELLO");
    expect(evaluate('"Hello".lower()', context)).toBe("hello");
  });

  it("returns undefined for invalid expressions", () => {
    expect(evaluate("1 +", context)).toBeUndefined();
  });
});

describe("evaluateFilter", () => {
  it("evaluates string filters", () => {
    expect(evaluateFilter('status == "done"', context)).toBe(true);
  });

  it("evaluates and/or/not filter nodes", () => {
    expect(evaluateFilter({ and: ['status == "done"', "priority > 3"] }, context)).toBe(true);
    expect(evaluateFilter({ or: ["priority > 10", 'status == "done"'] }, context)).toBe(true);
    expect(evaluateFilter({ not: ['status == "done"'] }, context)).toBe(false);
  });

  it("returns true when filter is undefined", () => {
    expect(evaluateFilter(undefined, context)).toBe(true);
  });
});
