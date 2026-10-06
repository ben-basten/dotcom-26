---
title: "Automating a styling library migration with AI"
date: 2026-10-06T15:43:48Z
excerpt: "How I migrated a Next.js application from using the Stitches CSS-in-JS styling library to TailwindCSS, using AI automation to help."
---

Our team was maintaining a Next.js code base with about 60 active production page routes and more new pages planned on the project roadmap. The project heavily relied on the [Stitches](https://github.com/stitchesjs/stitches) CSS-in-JS React library, which was no longer actively maintained as of June 2023.

This posed some potential risks for our team:

- There are documented issues with Stitches in newer versions of Next.js, which we need to keep on the latest version for security compliance
- Our team preferred using TailwindCSS for newer projects, so using a completely different design system and styling pattern slowed down velocity
- There's no guarantee that Stitches will support newer CSS features like container queries

We decided that it would be a worthwhile effort to migrate from Stitches to TailwindCSS to future proof the project, using AI automation to help.

## Migration constraints

To make this migration possible in a reasonable amount of time, I needed to lean heavily on AI to do the rote mapping of JavaScript-based CSS styles to Tailwind class-based styles.

As I was planning out this work, I had a couple of constraints to keep in mind:

- PRs must be split into chunks of reasonable size to make them reviewable by teammates and AI code review
- I wanted work to be split into logical commits to make it easier to use Git bisect to find the problem if I ran into a styling issue mid-migration
- I was working at a small agency with a limited AI token budget, so I needed to balance quality output with token cost
- Output CSS should be *exactly* the same - my job was not to fix the mistakes of developers past
- Pages needed to be nearly pixel perfect matches to prevent any disruptions for stakeholders
- There are no pre-existing tests in the project

## Planning stage

Before I could get started with the migration, I wanted to have a plan for how I would test content. Because there are no existing tests, it was entirely on me to verify that the site matched prior behavior. I asked the agent to give me an audit of all of the different page routes and possible sections on the page, and I manually created some test CMS entries with samples of this content. With this content prepared, I could easily do a side-by-side comparison of production vs. migrated content to identify potential bugs in the migration.

I then put OpenCode into "Plan" mode and asked the agent to split the work into chunks of about 2-3 React components at a time to keep pull requests reviewable. I wanted to start from the "leaf" components, such as text, headings, and images, and gradually work my way up the tree to the page level. Good to go, right?

In the initial round of output, the agent created lots of new React components and adjusted the semantic HTML structure. I realized that I needed to provide much stronger input on how I expected this migration to look. I updated the migration plan to include strong wording about not changing HTML structure and maintaining the exact same CSS output as before. I also provided direct guidance to use the [Tailwind Variants](https://www.tailwind-variants.org/) library to handle components with lots of styling variants, because its API is similar to Stitches and makes the large diffs easier to understand.

After providing the more opinionated instructions, I immediately noticed an improvement in the quality of the migration output. I caught a lot of initial bugs by posting pull requests with a batch of work, then running a different code review model to catch any bugs.

## Feedback loops

After ironing out the issues with the code output, I noticed that I was the largest source of inefficiency in the coding feedback loop. After each component migration, I asked the agent to stop to give me a chance to review the changes. This was helpful at first; I was able to adjust some coding patterns that I didn't really like. However, manually doing a side-by-side comparison of production with dev was very time consuming and frankly not very accurate.

My first thought here was to hook up the [Google Chrome MCP](https://developer.chrome.com/blog/chrome-devtools-mcp) and have the agent compare screenshots of production and development to identify styling issues. The higher token usage required to process images, the lack of determinism, and my inability to run this test myself made me quickly throw out this option.

What I settled on instead was Playwright snapshot testing. For each unique route that I wanted test coverage for, I wrote a simple test that would load the route with reduced motion on, scroll all the way down the page to trigger any scroll-driven animations, then do a full page snapshot comparison. I generated the initial snapshots from the existing production code as a gold standard baseline.

```ts
import { expect, test } from '@playwright/test';
import { prepareForSnapshot } from './helpers/prepare-for-snapshot';

test.describe('My Page', () => {
  test('should match expected screenshot', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/path/to/page');
    // scroll down the page to trigger any animations
    await prepareForSnapshot(page);
    expect(
      await page.screenshot({ fullPage: true, scale: 'css' })
    ).toMatchSnapshot('my-page.png');
  });
});
```

This was awesome because I was able to deterministically run these tests myself if I wanted to do any manual verification, and agents could also independently run the tests too. Agents were able to read the Playwright test outputs and independently address the issues, effectively creating a feedback loop for them that no longer required me to prompt another revision.

These tests weren't a long term solution for the code base because the full page snapshots had relatively large file sizes, were very fragile to changes in the CMS, and a styling issue at the top of the page would cause cascading mismatches all the way down the snapshot for content below it. But this was the perfect solution for the sake of quickly validating that the styling didn't change after AI migrated a given React component.

The other tool I provided the agents was an example build output from the legacy Stitches-based production site. I created a new Git worktree, ran a build, and included the path to the build output directory as part of the migration plan for the agents. This served as an additional check for the migrated code, verifying that the Tailwind CSS output matched the previous built CSS with Stitches. Every time the agent finished migrating a component, it could run TypeScript type checking, ESLint, Playwright tests, and a comparison to the previous production code to verify the quality of its work.

## Learnings

This migration took about a week, and I left with several takeaways.

1. **Providing a feedback loop** greatly improves the code output and allows the agent to operate more independently without time consuming intervention. Playwright snapshot tests immediately reduced the amount of work I needed to do to finish the migration.
2. **Splitting the work into reviewable commits** made it very easy to go back and identify where an issue stemmed from. I had several GSAP animations change slightly because of the migration, and this allowed me to quickly figure out which code change caused it.
3. **I was tired.** The constant flow of decisions, fine CSS troubleshooting, and questions I needed to answer as I conversed back and forth with the agent was emotionally and mentally exhausting.
4. **AI didn't replace manual quality assurance.** I was still responsible for taking an audit of the existing production content in the CMS and making sure that all of this content was tested as part of the QA process.
