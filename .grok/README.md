# Gumi Cafe Map — Local Grok Harness

This `.grok/` is the self-contained agent harness for the project.

- Dedicated UX/UI design subagents live in `personas/` and `roles/`.
- The design skill is available locally (`/design` or manual spawn).
- Project precedence: these files override `~/.grok/bundled/` for sessions started inside this directory.

**To use the dedicated design subagents:**
- `ux-explorer` role for research
- `ux-designer`, `ui-designer`, `design-reviewer` personas for the full calm + simple UX/UI loop

See root `AGENTS.md` for the mandatory workflow before any UI coding.
