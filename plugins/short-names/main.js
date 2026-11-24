"use strict";
const { Plugin } = require("obsidian");

const LEADING_SEPARATORS = /^[\s\-–—_:.]+/;

// Strips leading words of `basename` that repeat an ancestor folder name (or its first word, e.g. a ticket key).
// Matches whole words only, so "2026-11-24" in folder "2026-11" stays intact.
function shortName(basename, folders) {
  const candidates = [...new Set(folders.flatMap((f) => [f, f.split(/\s+/)[0]]))]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  let name = basename;
  let changed = true;
  while (changed && name) {
    changed = false;
    for (const candidate of candidates) {
      const boundary = name.length === candidate.length || /\s/.test(name[candidate.length]);
      if (boundary && name.toLowerCase().startsWith(candidate.toLowerCase())) {
        name = name.slice(candidate.length).replace(LEADING_SEPARATORS, "");
        changed = true;
        break;
      }
    }
  }
  return name || basename; // a note named like its folder (hub/index note) keeps its name
}

class ShortNamesPlugin extends Plugin {
  onload() {
    this.watched = new WeakSet();
    this.frame = 0;
    this.app.workspace.onLayoutReady(() => this.watchExplorers());
    this.registerEvent(this.app.workspace.on("layout-change", () => this.watchExplorers()));
  }

  onunload() {
    cancelAnimationFrame(this.frame);
    document.querySelectorAll(".nav-file-title-content[data-short-name]").forEach((el) => {
      el.removeAttribute("data-short-name");
      el.removeAttribute("title");
    });
  }

  explorerEls() {
    return this.app.workspace.getLeavesOfType("file-explorer").map((leaf) => leaf.view.containerEl);
  }

  watchExplorers() {
    for (const el of this.explorerEls()) {
      if (this.watched.has(el)) continue;
      this.watched.add(el);
      // The explorer renders rows lazily and resets their text on rename: re-apply on every row change.
      const observer = new MutationObserver(() => this.schedule());
      observer.observe(el, { childList: true, subtree: true });
      this.register(() => observer.disconnect());
    }
    this.schedule();
  }

  schedule() {
    if (!this.frame) this.frame = requestAnimationFrame(() => this.apply());
  }

  apply() {
    this.frame = 0;
    for (const root of this.explorerEls()) {
      for (const row of root.querySelectorAll(".nav-file-title[data-path]")) {
        const content = row.querySelector(".nav-file-title-content");
        const file = this.app.vault.getAbstractFileByPath(row.getAttribute("data-path"));
        if (!content || !file || !file.parent) continue;
        const folders = file.parent.isRoot() ? [] : file.parent.path.split("/");
        const short = shortName(file.basename, folders);
        // Never change the text itself: inline rename edits that text, so it must stay the real name.
        if (short === file.basename) {
          content.removeAttribute("data-short-name");
          content.removeAttribute("title");
        } else if (content.getAttribute("data-short-name") !== short) {
          content.setAttribute("data-short-name", short);
          content.setAttribute("title", file.basename);
        }
      }
    }
  }
}

module.exports = ShortNamesPlugin;
module.exports.shortName = shortName;
