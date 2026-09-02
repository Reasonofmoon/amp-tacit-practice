# AMP 연결 앱 AI 모델 수명주기 개선 실행계획

- 작성일: 2026-09-02
- 상태: 로컬 구현 완료 / 운영 배포 게이트 대기
- 범위: `amp-tacit-knowledge` 본체와 시연에 연결된 14개 앱
- 목표: 종료된 모델, 숨은 레거시 매핑, 프리뷰 모델 의존 때문에 발생하는 실패를 제거하고 재발 방지 체계를 만든다.

## 1. 결론

권장안은 **앱별 긴급 복구 + 공통 모델 운영 계약**의 2단계 방식이다.

1. 실제 장애를 만드는 종료 모델과 숨은 다운그레이드부터 앱별로 교체한다.
2. 각 저장소에 같은 형식의 모델 레지스트리, 정적 검사, 실호출 스모크 테스트를 둔다.
3. AMP 본체는 기존 ADR에 따라 외부 AI 호출을 제거하고 시연 허브와 로컬 암묵지 추출 도구 역할에 집중한다.
4. 저장소 주소가 없는 앱은 블랙박스 테스트 후 저장소와 배포 프로젝트의 소유 관계를 먼저 확정한다.

중앙 AI 게이트웨이로 모든 앱을 한 번에 묶는 방식은 이번 범위에서 채택하지 않는다. 운영 단일 장애점, 키 관리, 비용 귀속, 기존 앱 마이그레이션 부담이 현재 문제보다 더 크다.

## 2. 계획 수립 기준

### 공식 공급자 기준

- OpenAI: 신규 텍스트 통합은 Responses API를 기본으로 하고, 용도에 따라 `gpt-5.6-luna`, `gpt-5.6-terra`, `gpt-5.6-sol`을 선택한다.
- Anthropic: `claude-sonnet-4-20250514`, `claude-opus-4-20250514`, `claude-3-5-haiku-20241022`는 종료되었다. 신규 기본 후보는 `claude-sonnet-5`, 고품질은 `claude-opus-5`, 저비용은 `claude-haiku-4-5-20251001`이다.
- Google: `gemini-2.0-flash`는 2026-06-01 종료되었다. 텍스트 기본 후보는 `gemini-3.6-flash`, 이미지 기본 후보는 `gemini-3.1-flash-image`이다.
- 프리뷰 모델은 실험 기능에서만 허용하고, 기본값이나 유일한 폴백으로 사용하지 않는다.

### 공통 모델 운영 계약

각 AI 사용 저장소에 아래 정보를 한 파일에서 관리한다.

```ts
type ModelPolicy = {
  provider: 'openai' | 'anthropic' | 'google';
  useCase: 'economy' | 'balanced' | 'quality' | 'image';
  modelId: string;
  api: 'responses' | 'messages' | 'generateContent' | 'images';
  fallbackModelId?: string;
  lifecycle: 'ga' | 'preview';
  lastVerifiedAt: string;
};
```

운영 원칙은 다음과 같다.

- UI 표시 모델과 실제 전송 모델은 반드시 같다.
- 최신처럼 보이는 별칭을 과거 모델로 변환하는 숨은 매핑을 금지한다.
- 모델 ID 기본값은 레지스트리 한 곳에만 둔다.
- 환경변수로 모델을 교체할 수 있게 하되, Zod 허용 목록을 통과한 값만 사용한다.
- 폴백은 같은 공급자와 같은 기능 범위에서만 작동한다.
- `404 model_not_found`, `400 unsupported_parameter`, `429`, 인증 오류를 구분해 기록한다.
- 배포 전 실제 키로 최소 1회 요청하는 스모크 테스트를 통과해야 한다.

## 3. 대안 비교

| 안 | 내용 | 장점 | 단점 | 판정 |
|---|---|---|---|---|
| A | 종료 모델 문자열만 즉시 교체 | 가장 빠름 | 다음 종료 때 같은 장애 반복 | 단독 사용 금지 |
| B | 앱별 복구 후 공통 운영 계약 적용 | 장애를 빨리 복구하면서 재발 방지 | 여러 저장소에 반복 작업 필요 | **권장** |
| C | 모든 앱을 중앙 AI 게이트웨이로 통합 | 정책과 비용 통제가 쉬움 | 마이그레이션과 단일 장애점이 큼 | 장기 검토 |

## 4. 전체 앱 판정과 실행 항목

| 순서 | 앱 | 소스 확인 | 현재 판정 | 실행 항목 | 우선순위 |
|---:|---|---|---|---|---|
| 0 | Tacit KnowledgeLab 소개 | AMP 내부 | API 없음 | 소개 흐름과 링크 상태만 회귀 테스트 | P2 |
| 1 | Sign Design 자동화 | 확인 | `claude-opus-4-7` 하드코딩, 현재 활성이나 비용·교체 위험 | 모델 환경변수화, 레지스트리와 스모크 테스트 추가 | P1 |
| 2 | ReadMaster 진단 | 확인 (`readmaster-funnel`) | 1차 검색에서 런타임 LLM 모델 미발견 | AI 비사용 확인 및 링크 회귀 테스트 | P2 |
| 3 | 영어 작문 첨삭 | 확인 | 최신 UI 모델을 종료된 Gemini 1.5·Claude 3.x 또는 과거 OpenAI 4o로 강제 변환 | 숨은 매핑 삭제, 실제 현행 모델 호출, 폴백 재작성 | **P0** |
| 4 | Level Test Proto | 확인 | 런타임 앱보다 콘텐츠 큐레이션 스크립트에서 Claude 사용 | 스크립트 모델 레지스트리화, 기존 결과 메타데이터는 보존 | P2 |
| 5 | Edu Ontology | 확인 (`eduontology`) | 분석 API와 DB 신규 기본값에 종료된 `gemini-2.0-flash` 사용 | Gemini 3.6 registry 도입, 신규 provenance 기본값 갱신 | **P0** |
| 6 | Storyboard Gen | 확인 | 종료된 Gemini 프리뷰 텍스트·이미지 모델이 기본/폴백에 존재 | GA 모델로 교체, 프리뷰 격리, 이미지·텍스트 별도 스모크 테스트 | **P0** |
| 7 | Knot 노트 앱 | 확인 (`knot`) | `gpt-4o-mini` Chat Completions와 잘못된 Claude 테스트 ID 사용 | Responses API 전환, 모델 registry와 설정 검사 갱신 | **P0** |
| 8 | Academy OS | 확인 | 검색 범위에서 런타임 LLM 모델 미발견 | AI 비사용 확인 테스트와 환경변수 감사만 수행 | P2 |
| 9 | BlueL 플랫폼 | 확인 (`bluel`) | Cloud Functions 여러 경로에 종료된 `gemini-2.0-flash` 사용 | 생성 모델 registry화, 3.6 Flash 전환, 임베딩 모델 분리 | **P0** |
| 10 | Librainy 도서관 | 확인 (`librainy-platform`, `audio-book-quest`) | 다수 API route에 오래된 2.5 preview와 2.0 Flash 사용 | stable 3.6 Flash 단일 registry로 통합 | **P0** |
| 11 | MoonLang 수익화 | 확인 (`moonlang-tools`) | 런타임 LLM 호출 미발견, 콘텐츠에 과거 모델 설명 존재 | 콘텐츠와 런타임을 구분해 AI 비사용 판정 기록 | P2 |
| 12 | 碁Vibe/Baduck 코딩 설계 | 확인 (`gido-board`, `baduck-coding`) | CLI는 종료 Sonnet 4와 Chat Completions 사용, UI도 구 모델 목록 보유 | CLI·UI registry 갱신, Responses API 전환 | **P0** |
| 13 | 사보 철학 AI | 확인 (`sabo-philosophy`) | Gemini 2.5 모델은 활성이나 브라우저 `localStorage`에 API 키 저장 | 현행 모델 registry화 후 서버 프록시 보안 마이그레이션 별도 수행 | P1 |
| 14 | App Factory | 확인 | 기본값과 다수 모듈에 종료된 Claude Sonnet/Opus 4 ID 존재 | 모듈 스키마 마이그레이션, 가격표·CLI·테스트 동시 갱신 | **P0** |

`amp-tacit-knowledge` 본체 자체는 별도 P0 대상이다. `api/llm.js`, `src/utils/llmClient.js`, `GlobalAIToolbar`, `ReportAIWorkbench`가 “외부 API 금지” ADR과 충돌한다.

## 5. 저장소별 상세 작업

### 5.1 amp-tacit-knowledge

권장 결정은 기존 ADR을 유지하는 것이다. AMP는 현장에서 항상 열리는 시연 허브여야 하므로 모델 장애가 전체 강연을 멈추게 해서는 안 된다.

수정 범위:

- `src/utils/llmClient.js`: 라이브 공급자/키 저장 기능 제거
- `api/llm.js`: 서버 프록시 제거
- `src/components/GlobalAIToolbar.jsx`: 로컬 프롬프트 도구로 전환하거나 제거
- `src/components/ReportAIWorkbench.jsx`: 결정론적 로컬 요약과 프롬프트 복사 기능만 유지
- `src/activities/AutoCodeActivity.jsx`: 예제 모델을 `gemini-3.6-flash`로 갱신하고 모델 상수화
- `.env.example`과 배포 환경: 사용하지 않는 AI 키와 프록시 변수 제거
- `CONTEXT.md`: “AI 분석은 로컬 휴리스틱” 규칙 재확인

완료 기준:

- 네트워크가 끊겨도 13개 활동, 최종 리포트, 시연 앱 목록이 작동한다.
- 코드 검색에서 공급자 API 엔드포인트와 런타임 API 키 저장 로직이 0건이다.
- 기존 `localStorage` 게임 상태가 유지된다.

대안은 ADR 0001을 대체하고 서버 전용 AI 프록시를 정식 채택하는 것이다. 이 경우 별도 보안·비용·개인정보 ADR과 운영 설계가 먼저 필요하므로 이번 기본 계획에서는 제외한다.

### 5.2 moon-writing-correction

핵심 원인은 `src/lib/serverAi.ts`의 `getActualModelId()`다. 설정 화면은 최신 모델을 보여주지만 서버는 종료된 모델로 바꿔 호출한다.

수정 범위:

- `src/lib/aiConfig.ts`: 공급자별 `economy/balanced/quality` 레지스트리 도입
- `src/lib/serverAi.ts`: `getActualModelId()` 제거, 선택된 모델 ID를 그대로 전달
- Gemini: 기본 `gemini-3.6-flash`, 품질 `gemini-2.5-pro`, 경제형 `gemini-3.5-flash-lite`
- OpenAI: 기본 `gpt-5.6-terra`, 품질 `gpt-5.6-sol`, 경제형 `gpt-5.6-luna`; Responses API 유지
- Anthropic: 기본 `claude-sonnet-5`, 품질 `claude-opus-5`, 경제형 `claude-haiku-4-5-20251001`
- `FALLBACK_MODELS`: 종료·가상 모델 제거, capability-compatible 폴백만 유지
- 설정 저장 데이터에 과거 모델이 있으면 공급자별 기본 모델로 안전하게 마이그레이션

완료 기준:

- 설정 화면의 모델 ID와 요청 로그의 모델 ID가 동일하다.
- 세 공급자 각각 첨삭 요청 1회가 성공한다.
- 종료 모델 문자열 정적 검사가 0건이다.
- 모델 불가 시 사용자에게 공급자·모델·오류 유형이 구분되어 표시된다.

### 5.3 storyboard-gen

수정 범위:

- `apps/gongbang/types.ts`: 종료된 프리뷰 모델 제거
- 텍스트 기본 `gemini-3.6-flash`, 경제형 `gemini-3.5-flash-lite`, 품질 `gemini-2.5-pro`
- 이미지 기본 `gemini-3.1-flash-image`, 품질 `gemini-3-pro-image`
- OpenAI 이미지 기본 `gpt-image-2`; 공식 목록에서 확인되지 않는 `gpt-image-1.5`는 제거 또는 실계정 검증 후 실험 항목으로 격리
- `apps/gongbang/aiEngine.ts`: 종료된 프리뷰 폴백 체인 제거
- `MODEL_IMAGE_EDIT`도 중앙 레지스트리에서 가져오도록 변경
- 기존 localStorage에 종료 모델이 저장된 경우 새 기본값으로 마이그레이션

완료 기준:

- 서사 생성, 신규 이미지 생성, 이미지 편집이 각각 최소 1회 성공한다.
- 공급자와 모델 종류가 어긋나는 요청이 타입과 런타임 검증에서 차단된다.
- 프리뷰 모델을 켜지 않아도 전체 핵심 플로우가 작동한다.

### 5.4 app-factory

수정 범위:

- `packages/core/src/executor.ts`: 기본 `claude-sonnet-4-20250514` 제거, 모델 해석과 가격표 분리
- `packages/cli/src/commands/audit-spec.ts`: 종료 모델 기본값 교체
- CLI 도움말, 예제, 빌더의 과거 모델 ID 갱신
- 모듈 YAML의 `recommended_model`을 용도별로 일괄 마이그레이션
- 고난도 생성: `claude-sonnet-5` 또는 평가 통과 시 `claude-opus-5`
- 저비용 검사: `claude-haiku-4-5-20251001`
- 가격표는 모델 레지스트리와 같은 소스에서 계산하도록 통합
- 모델 ID를 기준으로 공급자를 추론하지 않고 명시적 `provider` 필드를 사용

마이그레이션은 두 단계로 한다.

1. 로더가 구 모델 ID를 읽으면 오류 대신 새 모델 제안을 포함한 경고를 낸다.
2. 모든 모듈 YAML과 테스트 픽스처를 바꾼 뒤 구 모델을 하드 오류로 전환한다.

완료 기준:

- 전체 모듈 로드와 대표 파이프라인 실행이 성공한다.
- 비용 추정값이 선택 모델의 최신 가격 테이블과 일치한다.
- 종료 모델 문자열 정적 검사가 0건이다.
- 공급자 선택이 모델명 접두사에 의존하지 않는다.

### 5.5 sign-design-automation

`claude-opus-4-7`은 현재 활성이라 긴급 장애는 아니지만 모델이 하드코딩되어 있다.

수정 범위:

- `packages/ai/src/concept-agent/index.ts`: `MODEL` 상수를 `ANTHROPIC_MODEL` 환경변수 + Zod 검증 레지스트리로 교체
- 기본 모델은 비용과 응답시간을 고려해 `claude-sonnet-5`로 두고, 고품질 모드는 `claude-opus-5`로 명시 선택
- Claude Opus 4.7 이상에서 비기본 `temperature/top_p/top_k`를 보내지 않는지 요청 페이로드 검사
- 스트리밍 시작, 중간 토큰, 완료, 오류 흐름 테스트

완료 기준:

- 환경변수만 바꿔 모델 전환이 가능하다.
- 기본 콘셉트 생성과 고품질 생성이 모두 성공한다.
- 모델 접근 권한이 없으면 지원 가능한 대체 모델을 안내한다.

### 5.6 echobridge-web / Level Test Proto

런타임 레벨테스트보다 `src/scripts/curation/reading/agent_runner.ts`가 모델을 직접 호출한다. 생성된 JSON의 모델명은 과거 실행 이력이라 무조건 치환하면 안 된다.

수정 범위:

- 실행 스크립트의 모델만 레지스트리화한다.
- 신규 큐레이션 기본을 `claude-haiku-4-5-20251001`, `claude-sonnet-5`, `claude-opus-5`로 갱신한다.
- 기존 `src/data/reading/curated/*.json`의 provenance 모델명은 보존한다.
- dry-run과 소량 샘플 큐레이션으로 품질 차이를 비교한다.

완료 기준:

- 기존 레벨테스트 UI와 데이터는 변하지 않는다.
- 신규 큐레이션 1개 tranche가 세 역할 모두 성공한다.
- 과거 provenance와 신규 provenance가 구분된다.

### 5.7 lms-main / Academy OS

현재 검색에서는 런타임 모델 호출이 발견되지 않았다. “수정 없음”도 검증 결과로 남긴다.

실행 항목:

- 전체 저장소에서 공급자 SDK, 엔드포인트, 모델 ID, AI 관련 환경변수를 재검색한다.
- Firebase Functions, Vercel Functions, GitHub Actions까지 범위를 넓힌다.
- AI 비사용이면 `AI runtime: none`으로 인벤토리에 기록하고 링크·로그인·핵심 대시보드만 회귀 테스트한다.

### 5.8 추가 확인 저장소

배포명 역추적으로 다음 저장소를 확인했다.

- ReadMaster: `Reasonofmoon/readmaster-funnel`
- Edu Ontology: `Reasonofmoon/eduontology`
- Knot: `Reasonofmoon/knot`
- BlueL: `Reasonofmoon/bluel`
- Librainy / Audio Book Quest: `Reasonofmoon/librainy-platform`, `Reasonofmoon/audio-book-quest`
- MoonLang: `Reasonofmoon/moonlang-tools`
- Baduck: `Reasonofmoon/baduck-coding`
- Gido: `Reasonofmoon/gido-board`
- Sabo: `Reasonofmoon/sabo-philosophy`

앱마다 다음 순서를 반복한다.

1. Vercel/Render/Lovable 프로젝트 이름과 Git 저장소를 매칭한다.
2. AMP의 `showcaseActivities.js`에 `repoUrl`, 배포 제공자, 담당자, 마지막 검증일을 추가한다.
3. 브라우저 개발자 도구 또는 Playwright로 핵심 AI 동작의 요청 URL과 오류 코드를 수집한다.
4. 저장소에서 모델 ID, 공급자 SDK, 서버리스 함수, 환경변수, 폴백을 전수 검색한다.
5. 종료 모델은 앱별 레지스트리로 교체한다.
6. 타입체크, 관련 테스트, 실제 키 스모크 테스트, 배포 후 핵심 플로우를 검증한다.

저장소는 모두 확인했지만 배포 환경변수와 실계정 키는 별도 운영 권한이 필요하다. 정적 수정과 로컬 검증만으로 production 정상 작동을 보장하지 않으며, 배포 후 실호출 게이트를 통과해야 완료로 판정한다.

## 6. 실행 순서

### Wave 0. 기준선과 소유권 확정 (0.5~1일)

- 15개 항목의 URL, 저장소, 배포 제공자, 환경변수 소유자 표 작성
- 각 저장소의 현재 커밋과 배포 커밋 기록
- 종료 모델 정적 검색 결과 저장
- 실제 장애 시나리오와 HTTP 오류 코드 확보
- AMP 정책 결정 게이트: ADR 0001 유지 승인

### Wave 1. 장애 가능성이 높은 P0 복구 (3~5일)

순서:

1. `amp-tacit-knowledge` 정책 복원
2. `moon-writing-correction`
3. `storyboard-gen`
4. `app-factory`
5. `eduontology`, `bluel`, `librainy-platform`
6. `gido-board`, `baduck-coding`, `knot`

각 앱은 별도 브랜치와 별도 커밋으로 처리한다. 한 앱의 배포 검증이 끝나기 전 다음 앱 변경을 같은 PR에 섞지 않는다.

### Wave 2. P1 예방 정비 (2~4일)

- `sign-design-automation`, `sabo-philosophy`
- 모델 자체는 활성이나 하드코딩 또는 브라우저 키 저장 위험이 있는 앱
- 모델 레지스트리와 수명주기 검사 도입
- 기본 경로와 폴백 경로 각각 실호출 검증

### Wave 3. P2 확인 및 문서화 (1~2일)

- `echobridge-web`, `lms-main`, MoonLang, 소개 화면
- AI 비사용 앱도 “검사 완료” 상태 기록
- AMP 시연 순서와 앱 상태 표시 최종 점검

### Wave 4. 통합 회귀와 배포 (1~2일)

- AMP에서 14개 외부 앱 링크 점검
- 데스크톱과 375px 모바일에서 시연 플로우 확인
- API 키가 없는 상태, 잘못된 키, 모델 미지원, 한도 초과 오류 확인
- 배포 후 핵심 AI 기능 1회씩 실호출
- 24시간 오류 로그와 비용 급증 여부 관찰

예상 총공수는 저장소 접근이 즉시 가능하다는 조건에서 **8~14 개발일**이다. 접근권한 확인과 품질 비교 평가 시간은 별도다.

## 7. 테스트와 배포 게이트

앱별 최소 게이트:

1. 정적 검사: 종료 모델과 금지된 프리뷰 모델 0건
2. 타입 검사: 해당 저장소의 `npx tsc --noEmit` 또는 공식 typecheck 스크립트 통과
3. 관련 단위 테스트: 레지스트리, 설정 마이그레이션, 폴백, 응답 파싱
4. 계약 테스트: 공급자별 요청/응답 fixture를 Zod로 검증
5. 실제 스모크: 배포와 같은 키로 최소 프롬프트 1회
6. E2E: 사용자가 실제로 쓰는 핵심 기능 1개 완료
7. 배포 확인: production URL에서 같은 E2E 재실행

롤백 기준:

- 성공률이 기존 기준보다 5%p 이상 하락
- 평균 비용이 승인값보다 30% 이상 증가
- p95 응답시간이 2배 이상 증가
- 출력 스키마 실패 또는 빈 응답이 1% 이상

롤백 방법:

- 모델 환경변수를 직전 검증 모델로 되돌린다.
- 코드 호환 문제가 있으면 이전 배포 커밋을 재배포한다.
- 종료 모델로의 롤백은 금지한다.

## 8. 재발 방지 자동화

- 주 1회 공식 deprecation 페이지와 저장소 모델 ID를 비교하는 CI 작업
- pull request에서 종료 모델 문자열을 차단하는 `check:model-lifecycle` 스크립트
- 각 앱의 `/api/health/ai` 또는 CLI 스모크 명령으로 모델 접근성 확인
- `lastVerifiedAt`이 30일을 넘으면 경고
- 프리뷰 모델은 `ENABLE_PREVIEW_MODELS=true`에서만 선택 가능
- 모델 교체 PR에는 품질 샘플, 지연시간, 토큰, 예상 비용을 함께 기록

## 9. 작업 분할

독립 작업은 Luna worker에 다음처럼 분리할 수 있다.

| 작업 | 파일 범위 | 기대 결과 | 제외 범위 |
|---|---|---|---|
| Writing 복구 | `src/lib/aiConfig.ts`, `src/lib/serverAi.ts`, 설정 UI와 관련 테스트 | 숨은 레거시 매핑 제거, 3사 스모크 성공 | 첨삭 UX 재설계 |
| Storyboard 복구 | `apps/gongbang`의 모델·provider·설정 파일 | 종료 프리뷰 제거, 텍스트/이미지 생성 성공 | 캔버스 편집기 리팩터링 |
| App Factory 마이그레이션 | `packages/core`, `packages/cli`, 모듈 YAML | 종료 Claude ID 0건, 파이프라인 성공 | 모듈 기능 변경 |
| 미확인 앱 조사 | 앱별 저장소와 배포 프로젝트 | 소유권·모델·키·오류 증거 표 | 승인 없는 코드 변경 |
| AMP 정책 복원 | AMP의 LLM/API/UI 관련 파일 | 오프라인 시연 가능, ADR 준수 | 기존 활동 삭제 |

각 worker는 변경 파일, 실행 명령, 검증 결과, 미해결 위험을 보고해야 한다.

## 10. 승인 게이트

구현 전에 다음 한 가지 제품 결정을 승인해야 한다.

> **권장안: AMP 본체는 외부 AI를 호출하지 않는 오프라인 시연 허브로 유지하고, 실제 AI 호출은 연결된 개별 앱에서만 수행한다.**

이 결정을 승인하면 Wave 0부터 순서대로 실행한다. AMP 본체에서도 실시간 AI를 유지해야 한다면, 먼저 ADR 0001을 대체하는 서버 프록시·키 관리·비용·개인정보 ADR을 작성한 뒤 나머지 계획을 조정한다.

## 11. 공식 근거

- OpenAI Models: https://developers.openai.com/api/docs/models
- OpenAI Responses migration: https://developers.openai.com/api/docs/guides/migrate-to-responses
- Anthropic Models overview: https://platform.claude.com/docs/en/models/overview
- Anthropic Model deprecations: https://platform.claude.com/docs/en/about-claude/model-deprecations
- Gemini Models: https://ai.google.dev/gemini-api/docs/models
- Gemini Deprecations: https://ai.google.dev/gemini-api/docs/deprecations
