import { getCollection } from 'astro:content';

const collectionNames = [
  'civilizations', 'spirituality', 'theology', 'cultures',
  'scriptures', 'philosophy', 'figures', 'books', 'glossary',
] as const;

export async function GET() {
  const allArticles: any[] = [];

  for (const name of collectionNames) {
    try {
      const articles = await getCollection(name);
      for (const article of articles) {
        allArticles.push({
          title: article.data.title,
          slug: article.data.slug || article.id,
          category: article.data.category,
          summary: article.data.summary,
          tags: article.data.tags,
        });
      }
    } catch {
      // Collection might be empty
    }
  }

  return new Response(JSON.stringify(allArticles), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
