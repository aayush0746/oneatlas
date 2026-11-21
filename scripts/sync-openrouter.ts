import { fetchAndNormalizeOpenRouterModels } from '../src/lib/sync-engine';

async function main() {
  console.log('🌐 Connecting to OpenRouter public API (https://openrouter.ai/api/v1/models)...');
  const models = await fetchAndNormalizeOpenRouterModels(10);
  console.log(`✨ Successfully normalized ${models.length} models.`);
  console.log('Sample normalized models:');
  console.dir(models.slice(0, 3), { depth: null });
}

main().catch(console.error);
