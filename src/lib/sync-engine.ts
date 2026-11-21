/**
 * OneAtlas ETL Data Ingestion Pipeline Engine
 * Fetches live models from OpenRouter API, normalizes context length,
 * pricing per 1M tokens, modalities, and architecture specs.
 */

export interface OpenRouterRawModel {
  id: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture?: {
    modality?: string;
    tokenizer?: string;
    instruct_type?: string | null;
  };
  pricing?: {
    prompt: string;
    completion: string;
  };
  top_provider?: {
    context_length?: number;
    max_completion_tokens?: number;
  };
}

export async function fetchAndNormalizeOpenRouterModels(limit = 20) {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'HTTP-Referer': 'https://oneatlas.dev',
        'X-Title': 'OneAtlas Model Intelligence',
      },
    });

    if (!res.ok) {
      throw new Error(`OpenRouter API responded with HTTP ${res.status}`);
    }

    const json = await res.json();
    const rawModels: OpenRouterRawModel[] = json.data || [];

    const normalized = rawModels.slice(0, limit).map((m) => {
      const inputPricePerToken = parseFloat(m.pricing?.prompt || '0');
      const outputPricePerToken = parseFloat(m.pricing?.completion || '0');

      const inputPricePerM = Number((inputPricePerToken * 1_000_000).toFixed(4));
      const outputPricePerM = Number((outputPricePerToken * 1_000_000).toFixed(4));

      const [labPrefix, ...nameParts] = m.id.split('/');
      const slug = nameParts.length > 0 ? nameParts.join('-') : m.id.replace('/', '-');

      return {
        externalId: m.id,
        slug: slug.toLowerCase(),
        name: m.name,
        labSlug: labPrefix?.toLowerCase() || 'other',
        description: m.description?.slice(0, 300) || 'High-performance AI foundation model.',
        contextLength: m.context_length || m.top_provider?.context_length || 128000,
        maxOutputTokens: m.top_provider?.max_completion_tokens || 4096,
        inputPricePerMillion: inputPricePerM,
        outputPricePerMillion: outputPricePerM,
        releaseDate: new Date(m.created * 1000).toISOString(),
        modality: m.architecture?.modality || 'text->text',
      };
    });

    return normalized;
  } catch (error) {
    console.error('Ingestion error:', error);
    return [];
  }
}
