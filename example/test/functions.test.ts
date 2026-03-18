import { describe, it, expect } from "vitest";
import { evaluate } from "../src/compiler";

const eventDate = new Date(2024, 0, 15, 12, 0, 0);

const context = {
  note: {
    title: "Test Note",
    status: "done",
    numbers: [1, 2, 3],
    eventDate,
  },
  file: {
    name: "test",
    path: "notes/test.md",
    folder: "notes",
    ext: "md",
    tags: ["todo", "important"],
    links: ["other-note"],
    created: "2024-01-01T00:00:00Z",
    modified: "2024-06-15T00:00:00Z",
  },
  formula: {},
};

describe("string methods", () => {
  it("handles string operations", () => {
    expect(evaluate('"hello".contains("ell")', context)).toBe(true);
    expect(evaluate('"hello".startsWith("he")', context)).toBe(true);
    expect(evaluate('"hello".endsWith("lo")', context)).toBe(true);
    expect(evaluate('"Hello".lower()', context)).toBe("hello");
    expect(evaluate('"hello".upper()', context)).toBe("HELLO");
    expect(evaluate('"  trim  ".trim()', context)).toBe("trim");
    expect(evaluate('"hello".replace("l", "x")', context)).toBe("hexxo");
    expect(evaluate('"hello".slice(1, 4)', context)).toBe("ell");
    expect(evaluate('"".isEmpty()', context)).toBe(true);
    expect(evaluate('"ha".repeat(3)', context)).toBe("hahaha");
    expect(evaluate('"abc".reverse()', context)).toBe("cba");
  });
});

describe("number methods", () => {
  it("handles numeric operations", () => {
    expect(evaluate("3.1415.toFixed(2)", context)).toBe("3.14");
    expect(evaluate("3.6.round()", context)).toBe(4);
    expect(evaluate("3.2.floor()", context)).toBe(3);
    expect(evaluate("3.2.ceil()", context)).toBe(4);
    expect(evaluate("(-3).abs()", context)).toBe(3);
  });
});

describe("date functions", () => {
  it("creates dates", () => {
    expect(evaluate('date("2024-01-15")', context)).toBeInstanceOf(Date);
    expect(evaluate("now()", context)).toBeInstanceOf(Date);
  });

  it("provides date methods", () => {
    expect(evaluate("eventDate.year()", context)).toBe(2024);
    expect(evaluate("eventDate.month()", context)).toBe(1);
    expect(evaluate("eventDate.day()", context)).toBe(15);
    expect(evaluate("eventDate.time()", context)).toBe(eventDate.getTime());
  });
});

describe("list functions and methods", () => {
  it("creates lists", () => {
    expect(evaluate("list(42)", context)).toEqual([42]);
    expect(evaluate("list([1, 2])", context)).toEqual([1, 2]);
  });

  it("supports list methods on context values", () => {
    expect(evaluate("numbers.sum()", context)).toBe(6);
    expect(evaluate("numbers.mean()", context)).toBe(2);
    expect(evaluate("numbers.count()", context)).toBe(3);
    expect(evaluate("numbers.min()", context)).toBe(1);
    expect(evaluate("numbers.max()", context)).toBe(3);
  });
});

describe("duration and file helpers", () => {
  it("parses durations", () => {
    expect(evaluate('duration("1h")', context)).toBe(3_600_000);
    expect(evaluate('duration("30m")', context)).toBe(1_800_000);
  });

  it("builds file objects", () => {
    expect(evaluate('file("notes/test.md")', context)).toEqual({
      name: "test",
      path: "notes/test.md",
      folder: "notes",
      ext: "md",
      tags: [],
      links: [],
    });
  });

  it("supports file methods", () => {
    expect(evaluate('file("notes/test.md").inFolder("notes")', context)).toBe(true);
    expect(evaluate('file.hasTag("todo")', context)).toBe(true);
    expect(evaluate('file.hasLink("other-note")', context)).toBe(true);
    expect(evaluate('file.inFolder("notes/archive")', context)).toBe(false);
    expect(evaluate('file.hasProperty("status")', context)).toBe(true);
  });
});

describe("link helpers", () => {
  it("formats links and media", () => {
    expect(evaluate('link("page")', context)).toBe("[[page]]");
    expect(evaluate('link("page", "display")', context)).toBe("[[page|display]]");
    expect(evaluate('image("photo.png")', context)).toBe("![[photo.png]]");
    expect(evaluate('icon("star")', context)).toBe(":star:");
  });
});
