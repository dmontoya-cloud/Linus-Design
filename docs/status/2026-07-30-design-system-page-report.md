# Work Report — Design System Reference Page

**Date:** July 30, 2026
**What this covers:** the design-system reference page you asked for, from request to merge.
**Work item:** [WI-0002](../work-items/WI-0002-design-system-reference-page.md)
**Pull request:** https://github.com/dmontoya-cloud/Linus-Design/pull/1 (merged)

## What you asked for

A single, browsable page documenting the Linus design system — colors, type, spacing, and
buttons — styled and structured like [mews.design](https://www.mews.design/latest/welcome-eumfLxWD),
pulling real content from the "Linus Mobile - Design System" Figma file.

## What we found in Figma

The Figma file turned out to be much thinner than expected — it really only has a cover slide and
a page of buttons. The full color palette lives in a _different_ Figma file ("Linus - Universal
Design System"), and even there, most of the ~52 core color swatches couldn't be read by the
tools available in this session (their values sit inside the design file in a way the automated
tools can't extract, and the live "click to select in Figma" method didn't work either, in two
different files). Rather than guess at colors, the page shows those as an honest "not available
yet" placeholder.

What _did_ come through as real, verified data:

- The primary brand blue, `#087DAE`, confirmed from a designer's note in the file.
- A full set of chart/graph colors with real values.
- Nine color _names_ used for text (like "Text/Success", "Text/Warning") — names only, not the
  actual colors yet.
- A complete, real button system: 4 styles (Primary, Secondary, Specialty, Text), 3 states
  (Default, Pressed, Disabled), 2 sizes, and 5 icon-placement options — sourced from the Figma
  page plus a PDF export you provided.

## What was built

A new page in the prototype at `/design-system`, linked from the home screen. Every piece of
information on it is labeled **Confirmed**, **Placeholder**, or **Blocked**, so it's always clear
what's real versus a stand-in. Nothing is presented as final/approved that hasn't actually been
verified against a source.

## Problems found and fixed along the way

A few real bugs turned up while getting this into your hands — not just the design content:

1. **Blank page bug.** When you looked at the page, it was empty. The cause: the app is always
   loaded from a `/web/` address, but the navigation system inside it didn't know that, so it
   never matched any page — including the home screen. This likely would have affected the whole
   prototype, not just this new page. Fixed, and added a test so it can't silently break again.
2. **The automated checks (CI) were failing.** This was a pre-existing, previously-flagged issue
   (a mismatched dependency file) that had nothing to do with the new page itself. Fixed and
   verified.
3. **A formatting check was failing repo-wide.** Once the above was fixed, a code-style check ran
   for the first time and found formatting issues in several files (2 new, 5 pre-existing that had
   never actually been checked before). Fixed everywhere, no logic changes — purely tidy-up.

## Important — please read before doing anything else

**The pull request was merged before the last two fixes above landed.** Here's what that means
concretely: `main` (your project's official version) currently has the design-system page, but
**still has the blank-page bug** and the two CI/formatting fixes are sitting on a separate branch
that was never merged in.

To close this out cleanly, one of these needs to happen:

- I open a second small pull request with just those two follow-up fixes, and you merge that one
  too (recommended — keeps everything in the same reviewable, small-PR process this project uses).
- Or, if you'd rather, I can explain exactly what's different so you can decide another way.

I haven't touched `main` further without checking with you first.

## Still open (not done in this slice, by design)

- Real hex values for the ~52 core app colors — blocked on Figma access, needs a decision on how
  to unblock (see WI-0002 for options).
- A real, Figma-sourced type scale — not yet found.
- The actual `Button` component in the app only implements one basic style; the documented button
  system (4 styles, states, sizes, icons) is ahead of what's actually built. Flagged as future
  work, not done here.

## Where to look

- Live page (once you run it locally): `/web/design-system`
- Full technical write-up: `docs/work-items/WI-0002-design-system-reference-page.md`
- Pull request: https://github.com/dmontoya-cloud/Linus-Design/pull/1
