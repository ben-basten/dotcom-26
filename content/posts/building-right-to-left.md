---
title: "Building Frontend with Right-to-Left Support"
date: 2026-07-07T20:02:13-04:00
tags: ["frontend"]
---

Supporting right-to-left (RTL) languages such as Arabic requires intentional development to guarantee a consistent and equitable browsing experience regardless of the language a user speaks. Web standards and Tailwind tooling are here to help!<!--more-->

The goal is to provide an equitable browsing experience for RTL users that is equivalent to the experience of users browsing the site in English. By mirroring important content to the right side of the page, we guide RTL users through the same key pathways and draw their attention to the same focal points that English speakers would naturally encounter.

A notable exception to this is progress bars for media like audio or video. Historically these UI elements were built to mimic cassette players, which always progress from left to right.

## Project configuration

To get started, apply `dir="rtl"` to the root `<html>` element of the page for pages localized into a right-to-left language. Some of the layout will automatically adjust out of the box; CSS grid and flexbox get mirrored with no additional configuration.

Next, add a new "custom variant" in the TailwindCSS configuration to allow quick RTL styling shorthand in Tailwind classes.

```css
/* main.css */
@custom-variant rtl (&:dir(rtl));
```

With the new custom variant, styling such as `translateX` transforms can be quickly mirrored for RTL languages: `translate-x-5 rtl:-translate-x-5`

Finally, consider adding utility functions for determining if the page is in RTL direction and mirroring arrow key handlers. I've used this for handling keydown events in carousels that have left/right arrow key navigation to change slides, for example.

```ts
export const isRtl = (): boolean => {
  if (typeof document === "undefined") return false;
  return document.documentElement.dir === "rtl";
};

export const isForwardArrow = (key: string) => {
  const forwardKey = isRtl() ? "ArrowLeft" : "ArrowRight";
  return key === forwardKey;
};

export const isBackwardArrow = (key: string) => {
  const backwardKey = isRtl() ? "ArrowRight" : "ArrowLeft";
  return key === backwardKey;
};
```

## CSS logical properties

Logical properties define direction-relative layouts for elements, rather than physically specifying where an element should go. Instead of using physical properties like `left`, `right`, `margin-left`, or `margin-right`, there are relative equivalents like `inset-inline-start`, `inset-inline-end`, `margin-inline-start`, and `margin-inline-end`.

Using logical properties should be the default when building for RTL languages. This will solve the majority of RTL layout issues automatically. [Tailwind CSS v4.2 and later](https://tailwindcss.com/blog/tailwindcss-v4-3#more-logical-property-utilities) has wide support for these logical properties.

For further reading on logical properties, see the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values).

## Handling English text in RTL layouts

It's possible that a site may have a mix of RTL content and English content. The site may include English titles or names, or maybe the content is driven by a content management system and authors are still in the process of translating content. This creates scenarios where English text is right-justified and hard to read, or punctuation in the English text gets misplaced.

For example, for the following sample text:

> Hello world!

If `dir="rtl"` gets applied to a parent or ancestor of this element, it moves the punctuation:

> !Hello world

This happens because the Unicode Bidirectional Algorithm that determines how text should be laid out in the browser starts by looking at the rightmost character in a block of text to determine if it should be laid out LTR or RTL. The "!" is a non-directional character, so it gets repositioned. The next character it looks at is "o", which is a LTR character, so it stays in place.

In these situations where an element can have either LTR or RTL content, the `dir="auto"` attribute can help. [According to MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir), this uses a basic algorithm that "parses the characters inside the element until it finds a character with a strong directionality, then applies that directionality to the whole element." This resolves the punctuation issue, but it should usually be applied selectively.

With `dir` set to "auto", the text goes back to looking as expected:

> Hello world!

This approach is usually most effective when focusing use of the "auto" direction to specific pieces of text like headings. Applying this fix on larger chunks of text that include both English and RTL content could cause the opposite issue, where RTL languages get incorrectly formatted instead.

Thank you to Spotify for the [explainer about the punctuation issue](https://engineering.atspotify.com/2019/4/right-to-left-the-mirror-world).

## AI agent SKILL

I created a skill to instruct agents how to build RTL-ready frontend experiences or migrate an existing codebase. The skill includes a mapping of how to convert existing Tailwind styling to use the more responsive logical properties.

To give it a try, install the skill using the [skills.sh](https://www.skills.sh/) command line tool:

```bash
npx skills add https://github.com/ben-basten/skills --skill right-to-left
```

Or check out the source code: <https://github.com/ben-basten/skills/blob/main/skills/right-to-left/SKILL.md>
