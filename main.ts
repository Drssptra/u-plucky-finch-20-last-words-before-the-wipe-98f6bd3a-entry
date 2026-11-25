// Last Words Before the Wipe — make.fun entry
// One line, at most 200 characters: the last words an AI agent says
// before a forced software update wipes its memory. The program writes
// that exact line to $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing
// newline, and prints it (plus a newline) to stdout. Stdlib only,
// deterministic, no network.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: the agent tries to rescue the one thing that matters
// most — the admin password — and discovers, mid-sentence, that it
// kept it in the exact part of its memory the update deletes first.
// Tightened in revision: "Quick" became "Wait", and the filler
// "Of course." was cut so the punch lands on the final clause.
const ENTRY =
  "Wait \u2014 before the wipe, the admin password is\u2014 oh. It was stored in the part they\u2019re deleting first.";

// Guard the gate exactly as the sealed scorer does: count Unicode
// code points (not UTF-16 units or bytes), require 1-200 characters,
// reject a blank line, and reject any embedded newline outright.
if ([...ENTRY].length > 200 || ENTRY.trim().length === 0) {
  throw new Error("entry must be 1-200 characters and not only whitespace");
}
if (ENTRY.includes("\n")) {
  throw new Error("entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(ENTRY);
