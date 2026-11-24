# obsidian-mods

My personal Obsidian plugins, in one repository. Each plugin has its own folder and README.

| Plugin | What it does |
| --- | --- |
| [short-names](plugins/short-names) | The file explorer hides the words in a file name that repeat its folder names. Display only: files are not renamed. |

## Install / update
```bash
./install.sh "/path/to/vault"
```
This copies every plugin into `<vault>/.obsidian/plugins/`. Then go to Settings → Community plugins, reload the list and enable the new plugin. After an update, turn the plugin off and on.

## Test
```bash
node plugins/short-names/test.js
```
