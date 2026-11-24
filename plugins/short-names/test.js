// Run: node test.js
const assert = require("node:assert");
const Module = require("node:module");

const load = Module._load;
Module._load = (request, ...rest) => (request === "obsidian" ? { Plugin: class {} } : load(request, ...rest));
const { shortName } = require("./main.js");

const tasks = ["Projects", "acme", "Tasks"];
const cases = [
  ["acme ABC-123 Dark mode toggle - plan", [...tasks, "ABC-123 Dark mode toggle"], "plan"],
  ["acme ABC-456 caveats", [...tasks, "ABC-456"], "caveats"],
  ["acme ABC-456 caveats", [...tasks, "ABC-456 Export to CSV"], "caveats"],
  ["acme conventions", ["Projects", "acme"], "conventions"],
  ["acme", ["Projects", "acme"], "acme"], // hub note keeps its name
  ["Weekly review", ["Jobs", "Weekly review"], "Weekly review"],
  ["2026-01-15.journal", ["Daily", "2026-01"], "2026-01-15.journal"], // no partial-word match
  ["Notes", [...tasks, "ABC-789"], "Notes"],
  ["Memory", ["04 Memory"], "Memory"],
  ["Inbox", [], "Inbox"],
];
for (const [name, folders, expected] of cases) assert.strictEqual(shortName(name, folders), expected, name);
console.log(`ok: ${cases.length} cases`);
