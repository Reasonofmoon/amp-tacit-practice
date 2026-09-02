import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(path, 'utf8');

describe('offline AI policy', () => {
  it('does not ship an LLM proxy or provider runtime', () => {
    expect(existsSync('api/llm.js')).toBe(false);

    const runtimeSource = [
      'src/App.jsx',
      'src/components/ReportAIWorkbench.jsx',
      'src/components/ResultReport.jsx',
    ].map(read).join('\n');

    expect(runtimeSource).not.toMatch(/llmClient|VITE_LLM|\/api\/llm|API 키 입력|AI에게 프롬프트 보내기/);
  });

  it('pins the tutorial Apps Script to the approved Gemini model', () => {
    const tutorialSource = read('src/activities/AutoCodeActivity.jsx');

    expect(tutorialSource).toContain('gemini-3.6-flash');
  });

  it('does not document provider keys or LLM proxy environment variables', () => {
    const envSource = read('.env.example');

    expect(envSource).not.toMatch(/VITE_LLM|GEMINI_API_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY/);
  });
});
