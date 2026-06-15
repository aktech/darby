+++
title = "Code Blocks"
weight = 3
description = "A showcase of code rendering in the Acme Docs theme: substantial, idiomatic samples in eight languages with filenames, copy buttons, language labels, and line highlighting."
+++

Code is the heart of most technical documentation, so this page exists to prove that the theme's code blocks look good when they carry real, substantial content. Every block below is idiomatic and complete enough to read on its own. As you scroll, notice the three features that make these blocks pleasant to use: the filename header, the language label, and the copy button in the top-right corner.

## Block features

Each fenced code block can carry an optional filename via the `{filename="..."}` attribute. When present, the theme renders a small header bar above the code showing that name, which is invaluable when a sample is meant to live at a specific path.

The theme also reads the language from the fence (the word after the opening triple backticks) and uses it both for syntax highlighting and for a small language label. Finally, a copy button is added to every block so readers can grab the whole sample in one click, without selecting text by hand.

## JavaScript

A small event emitter, the kind of utility that shows up in many codebases.

```javascript {filename="emitter.js"}
export class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const handlers = this.listeners.get(event) ?? [];
    this.listeners.set(
      event,
      handlers.filter((h) => h !== handler),
    );
  }

  emit(event, ...args) {
    for (const handler of this.listeners.get(event) ?? []) {
      handler(...args);
    }
  }
}
```

## TypeScript

The same idea, but typed. This version uses generics so each event name maps to a known payload shape.

```typescript {filename="emitter.ts"}
type Handler<T> = (payload: T) => void;

export class Emitter<Events extends Record<string, unknown>> {
  private listeners: { [K in keyof Events]?: Handler<Events[K]>[] } = {};

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    (this.listeners[event] ??= []).push(handler);
    return () => this.off(event, handler);
  }

  off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void {
    this.listeners[event] = (this.listeners[event] ?? []).filter(
      (h) => h !== handler,
    );
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    for (const handler of this.listeners[event] ?? []) {
      handler(payload);
    }
  }
}
```

## Python

A small command-line tool that reads a config file and prints a summary. This block uses a filename header.

```python {filename="summarize.py"}
import json
import sys
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Config:
    name: str
    workers: int
    debug: bool = False

    @classmethod
    def from_file(cls, path: Path) -> "Config":
        data = json.loads(path.read_text())
        return cls(
            name=data["name"],
            workers=int(data.get("workers", 1)),
            debug=bool(data.get("debug", False)),
        )


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: summarize.py CONFIG", file=sys.stderr)
        return 2
    config = Config.from_file(Path(argv[1]))
    print(f"{config.name}: {config.workers} worker(s), debug={config.debug}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
```

## Go

A worker pool that fans work out to a fixed number of goroutines and collects the results.

```go {filename="pool.go"}
package pool

import "sync"

// Run processes every item with fn across n workers and returns the results
// in arbitrary order.
func Run[T any, R any](items []T, n int, fn func(T) R) []R {
	jobs := make(chan T)
	results := make(chan R)

	var wg sync.WaitGroup
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for item := range jobs {
				results <- fn(item)
			}
		}()
	}

	go func() {
		for _, item := range items {
			jobs <- item
		}
		close(jobs)
	}()

	go func() {
		wg.Wait()
		close(results)
	}()

	out := make([]R, 0, len(items))
	for r := range results {
		out = append(out, r)
	}
	return out
}
```

## Rust

A small iterator-based word frequency counter, showing idiomatic ownership and the standard library's `HashMap`.

```rust {filename="wordcount.rs"}
use std::collections::HashMap;

/// Count how often each whitespace-delimited word appears in the input.
pub fn word_count(text: &str) -> HashMap<String, usize> {
    let mut counts: HashMap<String, usize> = HashMap::new();
    for word in text.split_whitespace() {
        let key = word.to_lowercase();
        *counts.entry(key).or_insert(0) += 1;
    }
    counts
}

fn main() {
    let text = "the quick brown fox the lazy dog the end";
    let counts = word_count(text);

    let mut pairs: Vec<(&String, &usize)> = counts.iter().collect();
    pairs.sort_by(|a, b| b.1.cmp(a.1).then(a.0.cmp(b.0)));

    for (word, count) in pairs {
        println!("{count:>3}  {word}");
    }
}
```

## Bash

A backup script with strict error handling and a timestamped archive name.

```bash {filename="backup.sh"}
#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${1:?usage: backup.sh SOURCE_DIR DEST_DIR}"
DEST_DIR="${2:?usage: backup.sh SOURCE_DIR DEST_DIR}"

timestamp="$(date +%Y%m%d-%H%M%S)"
archive="${DEST_DIR}/backup-${timestamp}.tar.gz"

mkdir -p "${DEST_DIR}"

echo "Archiving ${SOURCE_DIR} -> ${archive}"
tar -czf "${archive}" -C "${SOURCE_DIR}" .

echo "Pruning archives older than 30 days..."
find "${DEST_DIR}" -name 'backup-*.tar.gz' -mtime +30 -delete

echo "Done."
```

## YAML

A CI workflow definition, the kind of file most projects keep under version control.

```yaml {filename=".github/workflows/build.yml"}
name: build
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repository
        uses: actions/checkout@v4
      - name: Set up Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: "0.140.0"
          extended: true
      - name: Build the site
        run: hugo --minify --gc
      - name: Upload the artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public
```

## JSON

A configuration document, formatted the way the theme would highlight it.

```json {filename="config.json"}
{
  "name": "acme-docs",
  "version": "1.4.0",
  "theme": {
    "accentColor": "#3b82f6",
    "defaultTheme": "system",
    "fonts": {
      "body": "Inter",
      "code": "Fira Code"
    }
  },
  "search": {
    "enabled": true,
    "placeholder": "Search the docs..."
  },
  "menu": [
    { "title": "Docs", "url": "/docs/" },
    { "title": "Reference", "url": "/reference/" }
  ]
}
```

## Line highlighting

The `{hl_lines=["2-4"]}` attribute tells the theme to emphasize a range of lines, which is perfect for drawing attention to the part of a sample that matters most. Here the highlighted lines are the ones that perform the retry.

```python {filename="retry.py",hl_lines=["2-4"]}
def fetch_with_retry(url, attempts=3, backoff=0.5):
    for attempt in range(1, attempts + 1):
        try:
            return requests.get(url, timeout=5).json()
        except requests.RequestException:
            if attempt == attempts:
                raise
            time.sleep(backoff * attempt)
```

## Side-by-side comparisons

When you want to show the same task in more than one language, a code group keeps the alternatives in a single tabbed container instead of stacking them. Here is "read a file and count its lines" three ways.

{{< code-group >}}
{{< tab title="Python" >}}
```python
with open("notes.txt", encoding="utf-8") as f:
    line_count = sum(1 for _ in f)
print(line_count)
```
{{< /tab >}}
{{< tab title="Go" >}}
```go
file, _ := os.Open("notes.txt")
defer file.Close()
count := 0
scanner := bufio.NewScanner(file)
for scanner.Scan() {
	count++
}
fmt.Println(count)
```
{{< /tab >}}
{{< tab title="Rust" >}}
```rust
use std::io::BufRead;
let file = std::fs::File::open("notes.txt")?;
let count = std::io::BufReader::new(file).lines().count();
println!("{count}");
```
{{< /tab >}}
{{< /code-group >}}

## Inline code

Not everything needs a block. For a single command or identifier, inline code keeps the prose flowing: run `hugo server` to start the dev server, set `enableSearch = true` to turn on search, or call `Page.RenderString` from a shortcode to process Markdown. Mixing inline and block code is the natural way to write technical documentation, and the theme styles both consistently.
