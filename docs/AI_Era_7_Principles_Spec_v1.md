# AI 시대에 뒤쳐지지 않는 7가지 방법 — 구현 포인터

> **강연 설계 정본(전체 스펙):** [`원칙시리즈_2-7_강연설계스펙.md`](./원칙시리즈_2-7_강연설계스펙.md)  
> (데스크톱 `원칙시리즈_2-7_강연설계스펙.md` v1.0 을 리포로 동기화)

## 원칙 ↔ activityKey (앱 구현)

| # | 원칙 | activityKey | XP | 상태 |
|:-:|------|-------------|---:|:----:|
| 1 | 정보가 나를 통해 흐르는 시스템을 구축하라 | `dev_info_flow` | 100 | ✅ |
| 2 | 배운 것은 반드시 산출물로 닫아라 | `dev_output_close` | 120 | ✅ |
| 3 | 프롬프트를 절차로 바꿔 자산화하라 | `dev_prompt_asset` | 140 | ✅ |
| 4 | 위임하지 말고, 하네스를 설계하라 | `dev_harness_design` | 180 | ✅ |
| 5 | 출력이 아니라 검증 루프를 설계하라 | `dev_verify_loop` | 180 | ✅ |
| 6 | AI가 대체할 수 없는 좁은 도메인을 소유하라 | `dev_domain_moat` | 150 | ✅ |
| 7 | 시스템을 공개해 피드백을 복리로 만들어라 | `dev_public_loop` | 200 | ✅ |

## 코드 위치

| 역할 | 경로 |
|------|------|
| 콘텐츠·완료 규칙 | `src/data/developerPrinciples.js` |
| 공용 UI (설명+실습) | `src/activities/DevPrincipleActivity.jsx` |
| 카드 목록 (S1 상단) | `src/data/developerActivities.js` |
| 데모 오더 ①→⑦ | `src/data/journeyGuides.js` → `developer` |
| 상태 기본값 | `createPrincipleDefaultData` in `developerPrinciples.js` + `useGameState.js` |
| XP/진행도 | `src/utils/scoring.js` |
| 프롬프트 기프트 | `src/data/activityPrompts.js` |
| 하네스 | `.claude/skills/dev-journey-orchestrator/` |

## 규칙

- **H1**: 스펙 변경 시 앱 데이터/UI 동시 반영
- **S1**: 원칙 7개 = `DEV_ACTIVITIES` 맨 위, 기존 스택 랩은 그 아래
- 런타임 정본은 코드; 교수설계·멘트·슬라이드 아웃라인 정본은 `원칙시리즈_2-7_강연설계스펙.md`
- **배지**: ①~⑦ 전부 완료 시 발견 카드 `system_owner` (System Owner)
- **⑦ 완료 게이트**: firstPublic + cadence + firstDate + channel + invite + posted + where + 7주 캘린더 등록

## Gap 점검 (2026-07-26)

| 항목 | 상태 |
|------|:----:|
| 7 activityKey 배선 | ✅ |
| S1 상단 고정 | ✅ |
| demoOrder ①→⑦ | ✅ |
| 원칙별 라이브 앵커 ≥1 | ✅ |
| ⑦ Part A~D 실습 필드 | ✅ |
| System Owner 배지 | ✅ |
| 단위 테스트 `developerPrinciples.test.js` | ✅ |
