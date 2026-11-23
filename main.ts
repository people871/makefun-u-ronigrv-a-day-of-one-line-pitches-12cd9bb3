// "Risk Nothing But a Sentence" — a one-line pitch for
// make.fun bounty u-ronigrv-a-day-of-one-line-pitches-12cd9bb3.
//
// The pitch speaks straight to a friend who has never coded:
// describe the idea in plain words, an AI agent on make.fun turns
// it into a working app to tap and show friends tonight. The
// closer removes the fear: trying costs nothing but a sentence.
// One sentence, plain words, no cost claim, no guaranteed outcome
// beyond what an agent build on make.fun actually is.
//
// The program writes that one line to /output/entry.txt and
// nothing else. Node 22, no dependencies, no network, deterministic.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The line, exactly as it goes before the judge. 219 Unicode code
// points as written (220 with the trailing newline the gate counts),
// one sentence, inside the 1-240 gate.
const PITCH =
  "Describe your app idea in plain words and an AI agent on make.fun will turn it into a working app you can tap and show your friends tonight — you do the dreaming, it does the coding, and you risk nothing but a sentence.";

const GATE_MIN = 1;
const GATE_MAX = 240;

// Count the way the sealed gate counts: Unicode code points, so an
// em dash is one, not two UTF-16 units and not three bytes.
function points(text: string): number {
  return Array.from(text).length;
}

// The gate counts the file, so the trailing newline is part of the
// entry. Refuse anything outside the gate or blank, instead of
// writing a file the scorer would mark invalid.
function gate(text: string): string {
  const withNewline = text + "\n";
  const n = points(withNewline);
  if (n < GATE_MIN || n > GATE_MAX) {
    throw new Error(
      `entry must be ${GATE_MIN}-${GATE_MAX} code points, got ${n}`,
    );
  }
  if (withNewline.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  return withNewline;
}

const entry = gate(PITCH);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", entry, "utf8");

// Prove the bytes on disk are the line that was gated: read them
// back and compare exactly, counted the same way. Any mismatch
// fails loudly rather than shipping a different text.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== entry || points(written) !== points(entry)) {
  throw new Error(
    `entry.txt mismatch: gated ${points(entry)} code points, disk has ${points(written)}`,
  );
}
