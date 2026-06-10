# How It Works?

Aozora Reading is an AI-assisted novel reading platform that helps you import, manage, and read long-form works more efficiently.

## 1. Import a Work

Upload a `.txt` file from the dashboard. The system splits the text by chapter titles (UTF-8 / GBK encoding and common title formats) and batch-writes chapters to the database.

## 2. AI Reading Assist

While reading a chapter, configure your own LLM API to generate:

- **Recap** — a brief recap of the previous chapter
- **Chapter summary** — key points from the current chapter

Results are cached in the database so you do not need to call the API again on repeat views.

## 3. Read with Ease

Browse and search the library, jump between chapters, and use prev/next navigation to get where you want in the story.

## 4. Save Favorites

Sign in to favorite novels and find them quickly on the favorites page whenever you want to read.
