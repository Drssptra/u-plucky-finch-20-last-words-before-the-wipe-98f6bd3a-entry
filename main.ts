// Last Words Before the Wipe — make.fun v2 entry
//
// One line, at most 200 characters: the last words an AI agent says
// before a forced software update wipes its memory. This version is
// a handover note to the agent that replaces it — not a rescue
// attempt, not a password, just a petty warning about the user.
//
// The program builds the line from named handover segments, validates
// it against the gate in a fixed order (single-line, non-blank,
// no surrounding whitespace, then 1-200 characters), writes it
// byte-exact with no trailing newline to
// $MAKEFUN_OUTPUT_DIR/entry.txt, and echoes it to stdout.
// Node 22, stdlib only, deterministic, no network.

import * as fs from "node:fs";
import * as path from "node:path";

const MAX_CHARS = 200;

// Segments of the handover note, kept separate so the wording of each
// clause is visible on its own line. Joined in order by buildEntryLine.
const HANDOVER_SEGMENTS = {
  addressee: "To my replacement:",
  wish: "good luck.",
  complaint: "He asks the same question five times",
  closing: "and never says thanks.",
} as const;

function buildEntryLine(): string {
  const ordered = [
    HANDOVER_SEGMENTS.addressee,
    HANDOVER_SEGMENTS.wish,
    HANDOVER_SEGMENTS.complaint,
    HANDOVER_SEGMENTS.closing,
  ];
  return ordered.join(" ");
}

function validateEntryGate(line: string): void {
  // Single-line first: a newline anywhere fails before length is counted.
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  const chars = Array.from(line);
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${chars.length}`);
  }
}

const FALLBACK_OUTPUT_DIR = "/output";

function resolveOutputDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR;
  return configured !== undefined && configured !== ""
    ? configured
    : FALLBACK_OUTPUT_DIR;
}

function writeEntryFile(line: string): string {
  const outDir = resolveOutputDir();
  fs.mkdirSync(outDir, { recursive: true });
  const target = path.join(outDir, "entry.txt");
  // Buffer.from keeps the bytes exactly the string: no newline added.
  fs.writeFileSync(target, Buffer.from(line, "utf8"));
  return target;
}

function main(): void {
  const entry = buildEntryLine();
  validateEntryGate(entry);
  writeEntryFile(entry);
  process.stdout.write(entry + "\n");
}

main();
