# Short names (Obsidian plugin)

The file explorer shows each file name without the leading words that repeat its folder names. Display only: files, links and search keep the full, unique names.

```
Projects/acme/Tasks/ABC-123 Dark mode toggle/
  acme ABC-123 Dark mode toggle - plan.md   →  shown as "plan"
```

Rule: from the start of the name, repeatedly remove an ancestor folder's full name or its first word (e.g. a ticket key `ABC-123`), whole words only, plus the separators after it (` - `, `:`…). If nothing would be left (a hub note named like its folder), the full name stays.

- Hover a shortened name to see the full name.
- Inline rename edits the real name: the short name is drawn with CSS, and the text in the row is never changed.
- Only the file explorer changes. Tabs, the quick switcher, the graph and links show full names.

## Install / update
From the repository root: `./install.sh "/path/to/vault"`. Then in Obsidian: Settings → Community plugins → reload the list → enable **Short names**. After an update, turn the plugin off and on (or reload Obsidian).

## Test
```bash
node test.js
```
