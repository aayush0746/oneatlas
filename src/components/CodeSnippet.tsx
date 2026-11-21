'use client';

import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeSnippetProps {
  modelSlug: string;
  modelName: string;
}

export function CodeSnippet({ modelSlug, modelName }: CodeSnippetProps) {
  const [activeTab, setActiveTab] = useState<'ts' | 'python' | 'curl'>('ts');
  const [copied, setCopied] = useState(false);

  const snippets = {
    ts: `import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Universal router connection via OneAtlas / OpenRouter
const provider = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const { text } = await generateText({
  model: provider('${modelSlug}'),
  prompt: 'Explain quantum computing in three sentences.',
});

console.log(text);`,

    python: `from litellm import completion
import os

# Multi-provider routing via LiteLLM
response = completion(
    model="openrouter/${modelSlug}",
    messages=[{"role": "user", "content": "Explain quantum computing in three sentences."}],
    api_key=os.getenv("OPENROUTER_API_KEY")
)

print(response.choices[0].message.content)`,

    curl: `curl https://openrouter.ai/api/v1/chat/completions \\
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${modelSlug}",
    "messages": [
      {"role": "user", "content": "Explain quantum computing in three sentences."}
    ]
  }'`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#090d16] overflow-hidden">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('ts')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === 'ts'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TypeScript (AI SDK)
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === 'python'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python (LiteLLM)
          </button>
          <button
            onClick={() => setActiveTab('curl')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === 'curl'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            cURL
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy snippet</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
        <code>{snippets[activeTab]}</code>
      </pre>
    </div>
  );
}
