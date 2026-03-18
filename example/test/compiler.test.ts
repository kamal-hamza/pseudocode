import { describe, it, expect } from "vitest";
import { compile } from "../src/compiler";

describe("compiler", () => {
  it("compiles simple expressions into expected instruction types", () => {
    const compiled = compile("1 + 2");
    const types = compiled.instructions.map((instruction) => instruction.type);
    expect(types).toEqual(["Const", "Const", "Binary"]);
  });

  it("emits short-circuit jumps for && and ||", () => {
    const andInstructions = compile("a && b").instructions;
    const andTypes = andInstructions.map((instruction) => instruction.type);
    expect(andTypes).toContain("JumpIfFalse");
    expect(andTypes).toContain("Jump");

    const orInstructions = compile("a || b").instructions;
    const orTypes = orInstructions.map((instruction) => instruction.type);
    expect(orTypes).toContain("JumpIfTrue");
    expect(orTypes).toContain("Jump");
  });

  it("compiles if() with conditional jumps", () => {
    const types = compile("if(a, 1, 2)").instructions.map((instruction) => instruction.type);
    expect(types).toContain("JumpIfFalse");
    expect(types).toContain("Jump");
  });

  it("compiles formula member access into LoadFormula", () => {
    const instructions = compile("formula.score").instructions;
    expect(instructions).toHaveLength(1);
    expect(instructions[0]).toEqual({ type: "LoadFormula", name: "score" });
  });

  it("compiles function calls into CallGlobal", () => {
    const instructions = compile('contains(tags, "foo")').instructions;
    const last = instructions[instructions.length - 1];
    expect(last).toEqual({ type: "CallGlobal", name: "contains", argc: 2 });
  });

  it("compiles method calls into CallMethod", () => {
    const instructions = compile("name.lower()").instructions;
    const last = instructions[instructions.length - 1];
    expect(last).toEqual({ type: "CallMethod", name: "lower", argc: 0 });
  });
});
