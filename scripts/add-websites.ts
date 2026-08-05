import { getDriver } from '../lib/db/neo4j';

const DOMAIN_MAP: Record<string, string> = {
  'OpenAI': 'https://openai.com',
  'Anthropic': 'https://anthropic.com',
  'Cursor': 'https://cursor.com',
  'LangChain': 'https://langchain.com',
  'GPT-4o': 'https://openai.com',
  'Claude 3.5 Sonnet': 'https://anthropic.com',
  'Gemini API': 'https://google.com',
  'Stripe API': 'https://stripe.com',
  'Stripe Webhooks': 'https://stripe.com',
  'GitHub': 'https://github.com',
  'GitHub Copilot': 'https://github.com',
  'Perplexity': 'https://perplexity.ai',
  'Hugging Face': 'https://huggingface.co',
  'Vercel': 'https://vercel.com',
  'Next.js': 'https://vercel.com',
  'FastAPI': 'https://fastapi.tiangolo.com',
  'GraphQL': 'https://graphql.org',
  'Pinecone': 'https://pinecone.io',
  'Qdrant': 'https://qdrant.tech',
  'Weaviate': 'https://weaviate.io',
  'PostgreSQL': 'https://postgresql.org',
  'Supabase': 'https://supabase.com',
  'Mistral': 'https://mistral.ai',
  'Mistral 8x7B': 'https://mistral.ai',
  'Llama 3 8B': 'https://meta.com',
  'Groq': 'https://groq.com',
  'Fireworks AI': 'https://fireworks.ai',
  'Midjourney': 'https://midjourney.com',
  'Linear': 'https://linear.app',
  'Linear Asks': 'https://linear.app',
  'Notion': 'https://notion.so',
  'Notion AI': 'https://notion.so',
  'Atlassian': 'https://atlassian.com',
  'AWS': 'https://aws.amazon.com',
  'Cloudflare': 'https://cloudflare.com',
  'Cloudflare AI': 'https://cloudflare.com',
  'Google Cloud': 'https://cloud.google.com',
  'Azure AI': 'https://azure.microsoft.com',
  'Replicate': 'https://replicate.com',
  'Together AI': 'https://together.ai',
  'Phind 34B': 'https://phind.com',
  'StackBlitz': 'https://stackblitz.com',
  'Warp': 'https://warp.dev',
};

async function main() {
  const session = getDriver().session();
  console.log('Connecting to Neo4j...');
  try {
    for (const [name, url] of Object.entries(DOMAIN_MAP)) {
      await session.run(`
        MATCH (n)
        WHERE n.name = $name
        SET n.websiteUrl = $url
      `, { name, url });
      console.log(`Updated ${name} with URL ${url}`);
    }
    console.log('Successfully updated website URLs!');
  } catch (err) {
    console.error('Error updating URLs:', err);
  } finally {
    await session.close();
    process.exit(0);
  }
}

main();
