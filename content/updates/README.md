# Timeline Updates

This directory contains MDX files that define the timeline updates shown on the website.

## Adding a New Update

### Option 1: Use the Helper Script (Recommended)

Run the following command and follow the prompts:

```bash
npm run create-update
```

This script will:
1. Ask you for the update details
2. Create the MDX file with the correct frontmatter
3. Open the file in your editor

### Option 2: Create a File Manually

Create a new `.mdx` file in this directory with a kebab-case filename (e.g., `feature-announcement.mdx`).

Each file should include frontmatter at the top:

```md
---
title: Your Update Title
started_date: DD/MM/YYYY    # Format must be DD/MM/YYYY (e.g., 01/05/2025 for 1st May 2025)
status: done                # 'done', 'current', 'default', or 'error'
---

Your update content goes here. This is standard Markdown with MDX support.

You can use:
- Lists
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- And other Markdown features

## Including Headers

You can include any level of header and other formatting as needed.
```

## Frontmatter Fields

- `title`: The main heading for the update
- `started_date`: When the update was started or is planned, in DD/MM/YYYY format
- `status`: Controls the appearance of the item
  - `done`: Completed item with checkmark (green)
  - `current`: Current/in-progress item
  - `default`: Planned/future item
  - `error`: Item with issues