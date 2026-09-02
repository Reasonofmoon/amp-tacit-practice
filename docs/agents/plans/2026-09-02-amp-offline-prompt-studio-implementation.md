# AMP Offline Prompt Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AMP 본체에서 외부 LLM 호출과 API 키 저장을 제거하고, 사용자 답변으로 프롬프트를 로컬 생성·복사하는 오프라인 작업실로 복원한다.

**Architecture:** `ReportAIWorkbench`는 기존 `promptGenerator`의 결정론적 출력만 표시하고 클립보드 복사만 제공한다. 공급자 선택, 브라우저 키 저장, 서버 프록시와 응답 렌더러는 삭제한다. 오프라인 정책 테스트가 런타임 API 경로의 재도입을 차단한다.

**Tech Stack:** React 19, Vite 7, Vitest 4, Testing Library, JavaScript ESM, vanilla CSS

## Global Constraints

- Korean UI, English code identifiers and comments.
- Preserve all original activities and existing `localStorage` game state.
- No external LLM API calls, API keys, backend AI proxy, or TailwindCSS.
- Use deterministic local prompt generation only.
- Run related tests and `npx tsc --noEmit` after changes.
- Do not modify benchmark, backup, or gallery behavior in this slice.

---

### Task 1: Convert the AI workbench into a local prompt studio

**Files:**
- Create: `src/components/ReportAIWorkbench.test.jsx`
- Modify: `src/components/ReportAIWorkbench.jsx`
- Modify: `src/components/ResultReport.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `buildPromptPack(activityData, profile, isDev)` and `buildVibeCodingPrompts(activityData, profile, isDev, axisScores)` from `src/utils/promptGenerator.js`.
- Produces: `ReportAIWorkbench({ state, activeJourney, onClose })`, a local-only prompt list with clipboard actions.

- [ ] **Step 1: Write the failing component test**

```jsx
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ReportAIWorkbench from './ReportAIWorkbench';

describe('ReportAIWorkbench', () => {
  it('renders local prompts without provider or API key controls', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });

    render(
      <ReportAIWorkbench
        state={{ activityData: {}, profile: { name: '문 원장' } }}
        activeJourney="director"
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: '로컬 프롬프트 작업실' })).toBeInTheDocument();
    expect(screen.queryByText('글로벌 AI 설정')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/API 키 입력/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('AI에게 프롬프트 보내기')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: '프롬프트 템플릿 복사' })[0]);
    expect(writeText).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the focused test and confirm the old UI fails it**

Run: `npx vitest run src/components/ReportAIWorkbench.test.jsx`

Expected: FAIL because the heading is still `AI 실행 워크벤치` and provider controls are present.

- [ ] **Step 3: Remove live-provider state and runners from the component**

Keep `buildAxisScores`, `promptPack`, `vibeCodingPrompts`, `handleCopy`, and `handleVibeCopy`. Remove imports and state related to `PROVIDERS`, `getStoredApiKey`, `GlobalAIToolbar`, `AITaskRunner`, `activeProvider`, `apiKeys`, and `selectedModels`.

Use this local-only header copy:

```jsx
<span className="flow-eyebrow-tag">LOCAL PROMPT STUDIO</span>
<h2>로컬 프롬프트 작업실</h2>
<p>
  활동 답변을 이 브라우저 안에서 프롬프트로 조합합니다. 필요한 프롬프트를 복사해 원하는 AI 도구에서 사용하세요.
</p>
```

Prompt cards retain only their existing prompt text and copy button. They must not render any send, model, provider, key, response, or follow-up UI.

- [ ] **Step 4: Rename the report entry point and modal accessibility label**

In `src/components/ResultReport.jsx` use:

```jsx
<span className="flow-eyebrow-tag">PROMPT STUDIO</span>
<h3>로컬 프롬프트 작업실 (선택)</h3>
<p>활동 답변으로 만든 프롬프트를 확인하고 복사해 원하는 AI 도구에서 사용하세요. 앱은 외부 AI를 직접 호출하지 않습니다.</p>
<button type="button" className="btn-paper-primary" onClick={onOpenAIWorkbench}>
  프롬프트 작업실 열기 →
</button>
```

In `src/App.jsx`, change the modal `ariaLabel` to `로컬 프롬프트 작업실`.

- [ ] **Step 5: Run the focused component test**

Run: `npx vitest run src/components/ReportAIWorkbench.test.jsx`

Expected: 1 test passes.

- [ ] **Step 6: Commit the local prompt studio slice**

```powershell
git add src/components/ReportAIWorkbench.jsx src/components/ReportAIWorkbench.test.jsx src/components/ResultReport.jsx src/App.jsx
git commit -m "refactor: make prompt studio local only"
```

### Task 2: Remove the LLM runtime and guard the offline policy

**Files:**
- Create: `src/utils/offlinePolicy.test.js`
- Delete: `src/utils/llmClient.js`
- Delete: `src/components/GlobalAIToolbar.jsx`
- Delete: `src/components/AITaskRunner.jsx`
- Delete: `api/llm.js`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: repository file paths through Node `fs` in the policy test.
- Produces: a regression gate proving that no LLM proxy or browser key runtime remains.

- [ ] **Step 1: Write the failing offline policy test**

```js
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
});
```

- [ ] **Step 2: Run the policy test and confirm the proxy still fails it**

Run: `npx vitest run src/utils/offlinePolicy.test.js`

Expected: FAIL because `api/llm.js` exists.

- [ ] **Step 3: Delete the unused runtime files**

Delete only the five files listed above. Verify no remaining imports:

Run: `rg -n "llmClient|GlobalAIToolbar|AITaskRunner|api/llm" src api`

Expected: no matches.

- [ ] **Step 4: Remove the now-unused DOMPurify dependency**

Run: `npm uninstall dompurify`

Expected: `dompurify` is absent from `package.json` and `package-lock.json` remains valid.

- [ ] **Step 5: Run the policy and component tests together**

Run: `npx vitest run src/utils/offlinePolicy.test.js src/components/ReportAIWorkbench.test.jsx`

Expected: 2 tests pass.

- [ ] **Step 6: Commit the runtime removal**

```powershell
git add -A src/utils/llmClient.js src/components/GlobalAIToolbar.jsx src/components/AITaskRunner.jsx api/llm.js src/utils/offlinePolicy.test.js package.json package-lock.json
git commit -m "refactor: remove external llm runtime"
```

### Task 3: Update the tutorial model and policy documentation

**Files:**
- Modify: `src/activities/AutoCodeActivity.jsx`
- Modify: `.env.example`
- Modify: `CONTEXT.md`
- Modify: `src/utils/offlinePolicy.test.js`

**Interfaces:**
- Consumes: Google Gemini `generateContent` example in `AutoCodeActivity`.
- Produces: a current tutorial model example and durable policy documentation.

- [ ] **Step 1: Extend the policy test for the tutorial and environment template**

Add:

```js
it('uses the approved tutorial model without LLM proxy variables', () => {
  expect(read('src/activities/AutoCodeActivity.jsx')).toContain('gemini-3.6-flash');
  expect(read('.env.example')).not.toMatch(/VITE_LLM|GEMINI_API_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY/);
});
```

- [ ] **Step 2: Run the test and confirm the old model and env block fail it**

Run: `npx vitest run src/utils/offlinePolicy.test.js`

Expected: FAIL because the tutorial uses `gemini-2.5-flash` and `.env.example` contains LLM proxy variables.

- [ ] **Step 3: Update the tutorial constant and remove the LLM env block**

In `src/activities/AutoCodeActivity.jsx`, define the model inside the copied Apps Script:

```js
const GEMINI_MODEL = "gemini-3.6-flash";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
```

Remove only the `Server-side LLM proxy` section from `.env.example`. Leave benchmark, backup, gallery, and KV configuration unchanged.

- [ ] **Step 4: Clarify the durable domain rule**

Append to the existing AI prompt pack rule in `CONTEXT.md`:

```markdown
- The AMP runtime does not collect provider API keys, select hosted models, or execute prompts. Users may copy locally generated prompts into an external AI tool.
- Tutorial content may demonstrate an external API, but tutorial model IDs must be reviewed against the provider's official lifecycle documentation before release.
```

- [ ] **Step 5: Run focused and repository validation**

Run:

```powershell
npx vitest run src/utils/offlinePolicy.test.js src/components/ReportAIWorkbench.test.jsx src/utils/scoring.test.js src/hooks/useGameState.test.js
npx tsc --noEmit
npm run build
```

Expected: all selected tests pass, typecheck exits 0, and Vite production build succeeds.

- [ ] **Step 6: Commit the policy and tutorial update**

```powershell
git add src/activities/AutoCodeActivity.jsx .env.example CONTEXT.md src/utils/offlinePolicy.test.js
git commit -m "docs: enforce offline ai policy"
```

### Task 4: Visual regression check

**Files:**
- Verify only; no planned source changes.

**Interfaces:**
- Consumes: production-equivalent Vite dev server and Playwright.
- Produces: evidence that the report entry point and prompt studio work on desktop and mobile.

- [ ] **Step 1: Start the app**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite prints an available local URL.

- [ ] **Step 2: Verify desktop flow**

At 1440x900, load a saved report state, open `로컬 프롬프트 작업실`, and verify:

- no API key or model selector appears;
- prompt text is visible;
- copy button does not shift the card layout;
- modal closes and focus returns to the report trigger.

- [ ] **Step 3: Verify mobile flow**

At 375x812, repeat the flow and verify:

- no horizontal overflow;
- buttons wrap without text clipping;
- modal content scrolls independently;
- prompt text remains readable.

- [ ] **Step 4: Record final repository status**

Run: `git status --short`

Expected: only intentional plan or implementation files are changed; unrelated existing changes remain untouched.
