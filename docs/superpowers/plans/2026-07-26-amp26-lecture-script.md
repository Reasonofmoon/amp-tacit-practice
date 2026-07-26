# AMP 26기 분 단위 대본 작성 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AMP 26기(2026-11-11 14:00–15:30)용 분 단위 강연 대본·런오브쇼·좌석 워크시트 초안을 문서 패키지로 완성한다.

**Architecture:** 설계 스펙(`2026-11-11-amp26-lecture-design.md`)을 단일 진실 원천으로 두고, 대본은 시계열 블록 단위 마크다운, 런오브쇼는 체크리스트, 워크시트는 ①②③ 좌석 메모 1페이지로 분리한다. 앱 코드 변경은 범위 밖(발표 모드는 이미 배포됨).

**Tech Stack:** Markdown docs only; 시연 URL `https://amp-tacit-practice.vercel.app/`; 원칙 데이터 참조 `src/data/developerPrinciples.js`

## Global Constraints

- 총 본 강연 **90분** (14:00–15:30), 세팅 13:50–14:00 별도
- 깊이 **B1**: ①③ 깊게, ④⑦ 스케치 only
- 청중 혼합: 매 원칙 끝에 **원장 / 실무 / 기획** 번역 1줄
- 앱 조작: **발표 모드 ON**, 개발자 여정
- 대본 형식: `[시계] [분] [화면/액션] [대사]` 구분, 침묵·손들기 명시
- 플레이스홀더(TBD) 금지

---

### Task 1: 분 단위 대본 본문

**Files:**
- Create: `docs/AMP26_Lecture_Script.md`
- Reference: `docs/superpowers/specs/2026-11-11-amp26-lecture-design.md`
- Reference: `docs/원칙시리즈_2-7_강연설계스펙.md` (원칙 멘트·앵커)
- Reference: `docs/AMP_Keynote_Script_v4.md` (톤·쇼케이스 패턴)

**Interfaces:**
- Consumes: 타임라인 표, 핵심 메시지 3줄, 시연 시퀀스
- Produces: 블록 0–9 전부 대본 (대사 전문 + 액션)

- [x] **Step 1:** `docs/AMP26_Lecture_Script.md`에 메타 헤더(일시·대상·URL·모드) 작성
- [x] **Step 2:** 블록 1–2 (오프닝 5′ + 나의 이야기 9′) 대사·액션 작성
- [x] **Step 3:** 블록 3–5 (원칙 ①②③) 각 원칙 Hook·오해·시연·좌석·번역 1줄 작성
- [x] **Step 4:** 블록 6–9 (맵·CTA·Q&A·클로징) 작성
- [x] **Step 5:** 시계 합계가 90분인지 표로 검산

**검증:** 각 블록에 `액션`과 `대사`가 모두 있고, ①②③에 시연 URL/카드 id가 명시됨.

---

### Task 2: 런오브쇼 체크리스트

**Files:**
- Create: `docs/AMP26_Run_of_Show.md`

**Interfaces:**
- Consumes: 대본의 시연 순서·폴백
- Produces: 13:50 체크리스트, 탭 예열 목록, 장애 표, 리허설 일정

- [x] **Step 1:** 사전 세팅 체크리스트 (발표 ON, 여정, 탭 4개, QR, 백업)
- [x] **Step 2:** 분 단위 cue sheet (한 줄/블록)
- [x] **Step 3:** 장애 폴백 표 + 시간 초과 시 커트 우선순위
- [x] **Step 4:** 리허설 일정 (11/4, 11/10)

**검증:** 네트워크 끊김·앱 로딩 실패 각각 1개 이상 폴백.

---

### Task 3: 좌석 워크시트 1페이지

**Files:**
- Create: `docs/AMP26_Seat_Worksheet.md`

**Interfaces:**
- Consumes: ① 입구 / ② 계약 / ③ 절차 이름
- Produces: 인쇄 가능한 체크·빈칸 양식 + 7일 챌린지 표

- [x] **Step 1:** ①②③ 빈칸 필드
- [x] **Step 2:** Day1–7 표
- [x] **Step 3:** QR/URL 자리

**검증:** 강연 중 필기 3분 이내 작성 가능한 분량.

---

### Task 4: 교차 검수 · 커밋

**Files:**
- Modify: 위 3파일 + 필요 시 스펙 포인터

- [x] **Step 1:** 스펙 타임라인 ↔ 대본 시계 불일치 0건
- [x] **Step 2:** `git add` 해당 docs → commit  
  `docs: AMP26 lecture script, run-of-show, and seat worksheet`

---

## Spec coverage (self-review)

| 스펙 요구 | 태스크 |
|-----------|--------|
| 90분 B1 타임라인 | T1 |
| 시연 동선·발표 모드 | T1, T2 |
| 혼합 청중 번역 | T1 |
| 7일 CTA | T1, T3 |
| 폴백·리허설 | T2 |
| 좌석 산출물 | T3 |
