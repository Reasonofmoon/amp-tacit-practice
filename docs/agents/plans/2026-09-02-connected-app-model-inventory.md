# AMP 연결 앱 AI 모델 인벤토리

- 조사일: 2026-09-02
- 기준: 원격 기본 브랜치의 최신 공개 커밋
- 상태 정의:
  - P0: 종료 모델 또는 구 API 때문에 실제 기능 실패 가능
  - P1: 현재 동작하지만 하드코딩, 키 보관, 수명주기 통제가 취약
  - P2: 런타임 LLM 호출 없음 또는 생성 파이프라인에만 사용

## 결과 요약

| 앱 | 저장소 | 런타임 판정 | 확인 내용 | 조치 상태 |
|---|---|---:|---|---|
| AMP Tacit Knowledge | `amp-tacit-knowledge` | P0 -> 해소 | 외부 LLM 프록시, 키, 모델 UI가 오프라인 ADR과 충돌 | `main@b50fd88`부터 로컬 Prompt Studio로 전환 |
| Sign Design | `sign-design-automation` | P1 -> 해소 | 활성 모델 하드코딩 | `19a96c8`: Sonnet 5/Opus 5 Zod registry, 테스트·타입·빌드 통과 |
| ReadMaster | `readmaster-funnel` | P2 | 공급자 SDK, 모델 ID, API 키 환경변수 미발견 | AI runtime none 기록 |
| 영어 작문 첨삭 | `moon-writing-correction` | P0 -> 해소 | 최신 UI 선택을 종료 모델로 숨은 치환, 저장 설정 migration 위험 | `f017c89` + `1be566f`: 직접 호출, Zod allowlist, 세션 보존 migration; 테스트 34개·빌드 통과 |
| Level Test Proto | `echobridge-web` | P2 -> 정비 | 앱 런타임이 아닌 reading curation script에서 Claude 사용 | `8073a62`: Haiku 4.5/Sonnet 5/Opus 5 registry; 과거 provenance 보존 |
| Edu Ontology | `eduontology` | P0 -> 해소 | 분석 API와 DB 신규 기본값에 종료된 `gemini-2.0-flash` | `36a85ce` + `541fad5`: stable Gemini registry, Zod 직접 의존성, 테스트·타입·빌드 통과 |
| Storyboard Gen | `storyboard-gen` | P0 -> 해소 | 종료 Gemini preview와 registry 우회 call-site | `1fde9d4` + `216f04a`: text/image registry, 전체 프로젝트 migration; 테스트 6개·타입·빌드 통과 |
| Knot | `knot` | P0 -> 해소 | `gpt-4o-mini` Chat Completions, 잘못된 Claude 테스트 ID, UI model drift | `fe201ad` + `b7cb24f`: current registry/Responses API/UI 정합, 테스트 8개·타입·빌드 통과 |
| Academy OS | `lms-main` | P2 | 공급자 SDK, 모델 ID, API 키 환경변수 미발견 | AI runtime none 기록 |
| BlueL | `bluel` | P0 -> 해소 | Cloud Functions에 종료된 `gemini-2.0-flash` 다수 | `c469cb2` + `61d121a` + `3460aae`: 3.6 registry, frontend/functions Zod, 생성·임베딩 분리 |
| Librainy | `librainy-platform` | P0 -> 해소 | 오래된 2.5 preview와 종료 2.0 Flash | `58efb41` + `836a88e`: 8 route 단일 stable registry, retired override 거부 |
| Audio Book Quest | `audio-book-quest` | P2 | 런타임 LLM 호출 미발견 | AI runtime none 기록 |
| MoonLang | `moonlang-tools` | P2 | AI 제품 소개 콘텐츠만 있고 사용자 런타임 호출은 미발견 | 콘텐츠와 런타임 분리 기록 |
| Gido Board | `gido-board` | P0 -> 해소 | 종료 Sonnet 4, `gpt-4o`, Chat Completions, 느슨한 응답 파싱 | `078bca1`: Sonnet 5/GPT current, Responses API, Zod; 테스트 10개·타입·CLI 빌드 통과 |
| Baduck Coding | `baduck-coding` | P0 -> 해소 | CLI/UI/code generator의 구 모델과 OpenAI Chat Completions | `f5f269e` + `6b8dd73`: provider transport/registry/Zod, 활성 호환 모델 보존; 테스트 24개·빌드 통과 |
| Sabo Philosophy | `sabo-philosophy` | P1 -> 코드 해소 | 브라우저 localStorage API 키와 직접 Gemini 호출 | `0869c45` + `982feeb`: serverless proxy, strict Zod/error contract; 테스트 9개·타입·빌드 통과 |
| App Factory | `app-factory` | P0 -> 해소 | 런타임 기본과 다수 YAML에 종료 Sonnet 4 ID | `33990b7` + `f7a102b` + `31d5a32` + `a40b94f`: 87 YAML/전체 runtime migration, 활성 4.6 보존; core 12개·타입·빌드 통과 |

## 저장소 매핑

AMP의 모든 외부 시연 항목은 `src/data/showcaseActivities.js`에서 GitHub 저장소와 연결한다. 대체 배포본도 `extraLinks[].repoUrl`로 원본 저장소를 기록한다.

## 검증 경계

정적 코드 수정 완료와 production 정상 작동은 다른 상태다.

1. 로컬 게이트: 종료 모델 0건, 관련 테스트, `npx tsc --noEmit`, lint/build.
2. 공급자 게이트: 실제 운영 키로 최소 프롬프트 1회, 모델 ID와 응답 스키마 확인.
3. 배포 게이트: production URL에서 핵심 사용자 흐름 1회, 인증/한도/모델 미지원 오류 확인.
4. 관찰 게이트: 배포 후 24시간 오류율, p95 지연, 비용 급증 확인.

현재 작업에는 운영 API 키와 Vercel/Render/Firebase 배포 권한이 포함되지 않으므로 2~4번은 코드 변경 후에도 별도 운영 작업으로 남는다. 특히 Sabo는 production에 `GEMINI_API_KEY`가 없으면 새 프록시가 의도적으로 실패한다.

## 공급자 기준

- OpenAI: https://developers.openai.com/api/docs/models
- OpenAI Responses API: https://developers.openai.com/api/docs/guides/migrate-to-responses
- Anthropic 모델: https://platform.claude.com/docs/en/models/overview
- Anthropic 종료 정책: https://platform.claude.com/docs/en/about-claude/model-deprecations
- Gemini 모델: https://ai.google.dev/gemini-api/docs/models
- Gemini 종료 정책: https://ai.google.dev/gemini-api/docs/deprecations
