#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

// Assembled from fragments so the scanner itself does not trigger when checking scripts
const FORBIDDEN = [
  ["Poke", "mon"].join(""),
  ["Pok\u00e9", "mon"].join(""),
  ["Pok", "e"].join(""),
  ["Pok\u00e9"].join(""),
  ["Poc", "ket"].join(""),
  ["TC", "GP"].join(""),
  ["Pika", "chu"].join(""),
  ["Mew", "two"].join(""),
  ["Chari", "zard"].join(""),
  ["Ee", "vee"].join(""),
  ["Nin", "tendo"].join(""),
  ["Game ", "Freak"].join(""),
  ["Crea", "tures"].join(""),
  ["De", "NA"].join(""),
  ["Wonder ", "Pick"].join(""),
  ["Genetic ", "Apex"].join(""),
  ["Pack ", "Points"].join(""),
  ["Poke ", "Gold"].join(""),
  ["Pok\u00e9 ", "Gold"].join(""),
  ["Shine", "dust"].join(""),
  ["Hour", "glass"].join(""),
  ["ex ", "rule"].join(""),
];

const SCAN_DIRS = ["src", "public"];
const SCAN_FILES = ["index.html"];

let violations = 0;

function scanText(filePath, text) {
  for (const term of FORBIDDEN) {
    const re = new RegExp(`\\b${term}\\b`, "i");
    if (re.test(text)) {
      console.error(`[IP-GUARD VIOLATION] Found forbidden term "${term}" in ${filePath}`);
      violations++;
    }
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full);
    } else if (entry.isFile() && /\.(tsx?|jsx?|html|css|json|md)$/i.test(entry.name)) {
      const content = fs.readFileSync(full, "utf-8");
      scanText(full, content);
    }
  }
}

for (const dir of SCAN_DIRS) {
  walkDir(path.join(root, dir));
}

for (const file of SCAN_FILES) {
  const full = path.join(root, file);
  if (fs.existsSync(full)) {
    scanText(full, fs.readFileSync(full, "utf-8"));
  }
}

if (violations > 0) {
  console.error(`\n[IP-GUARD FAIL] Found ${violations} forbidden term occurrences.`);
  process.exit(1);
} else {
  console.log("[IP-GUARD PASS] Zero forbidden terms detected in scanned sources.");
  process.exit(0);
}
