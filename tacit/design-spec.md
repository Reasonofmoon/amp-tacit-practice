# Tacit KnowledgeLab Design Spec v2.0
## "노트북 에스테틱" — From Dark Dashboard to Warm Paper Companion

> **Target**: `키노트 쇼케이스: 암묵지에서 AI로` 페이지 전체 리디자인
> **Inspiration**: [superr.ai](https://www.superr.ai/) — 종이 노트·손글씨·스티커·두들의 따뜻한 감각
> **Audience**: 영어 학원 원장(adult educators) — 장난기 있되 유치하지 않은 균형
> **Stack**: Next.js 16 + React 19 + Tailwind v4 + Framer Motion 11

---

## 1. Design Philosophy

### 1.1 코어 메타포
**"원장님의 수업 노트가 AI 웹앱으로 변신하는 순간"**

현재 페이지는 *다이어그노스틱 플랫폼*이라는 기능적 메시지만 있음.
새 디자인은 **수업 노트 → AI 앱**이라는 물리적·시각적 변환 서사를 중심에 둠.

### 1.2 Feeling Words (한/영 페어)
| 핵심 감정 | 한국어 | 영어 |
|---|---|---|
| Primary | 따뜻함 · 손맛 | Warm · Handcrafted |
| Secondary | 장난기 · 신뢰 | Playful · Trustworthy |
| Tertiary | 정돈됨 · 여백 | Organized · Spacious |

### 1.3 Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| 크림색 종이 배경 (#FAF7F2) | 순백색 #FFFFFF |
| 손글씨 폰트 헤드라인 | 전부 산세리프로 통일 |
| 살짝 기울어진 카드 (−2° ~ +3°) | 완벽한 격자 정렬만 사용 |
| 하이라이터 스트로크 장식 | 그라디언트 네온 glow |
| 스티커·두들 삽입 | 3D isometric 아이콘 |
| XP바 = 연필이 채워지는 모션 | 일반 선형 프로그레스 바 |
| 밝은 컬러 4~5색 혼합 | 단색 블루 dominance |
| 여백 넉넉 (min py-24) | 꽉 찬 섹션 |

---

## 2. Color System

### 2.1 Base Palette — "Paper & Ink"

```css
/* globals.css / tailwind.config */
--paper-50:  #FDFBF7;  /* 가장 밝은 종이 — hero 배경 */
--paper-100: #FAF7F2;  /* 메인 종이 — 기본 body */
--paper-200: #F3EEE4;  /* 살짝 그늘진 종이 — 카드 */
--paper-300: #E8DFCE;  /* 진한 종이 — 경계 */
--paper-400: #C9BBA3;  /* 종이 그림자 텍스처 */

--ink-900: #1A1915;    /* 잉크 — 메인 텍스트 */
--ink-700: #3C3A33;    /* 보조 텍스트 */
--ink-500: #7A746A;    /* 가이드 텍스트 */
--ink-300: #B8B0A2;    /* 희미한 라인 */
```

### 2.2 Accent Palette — "Sticker Colors"
Superr.ai의 블루/핑크/옐로우/그린 4색 조합을 한국 문구 감성으로 번역.

```css
--ink-blue:     #2E5BFF;  /* 만년필 블루 — primary CTA */
--coral-pink:   #FF6B6B;  /* 코럴 — 강조·포스트잇 */
--mustard:      #F4B740;  /* 머스타드 — 하이라이터 옐로우 */
--sage-green:   #7CB342;  /* 세이지 — 성공·레벨업 */
--lavender:     #B794F4;  /* 라벤더 — 보조 accent */

/* Washed 버전 (배경용) */
--blue-wash:    #E8EFFF;
--pink-wash:    #FFE8E8;
--yellow-wash:  #FFF4DB;
--green-wash:   #EBF5E0;
--lavender-wash:#F0E8FF;
```

### 2.3 시맨틱 매핑

| Purpose | Token | 예시 |
|---|---|---|
| 기본 배경 | `--paper-100` | `<body>` |
| 카드 배경 | `--paper-50` + subtle shadow | 플로우 카드 |
| 하이라이트 카드 | `--yellow-wash` | "1분 안에 맛보기" |
| Primary CTA | `--ink-blue` | "추천 시연 시작" |
| 축하·성공 | `--sage-green` | XP 획득, 레벨업 |
| 경고·강조 | `--coral-pink` | 새 기능 배지 |

### 2.4 다크모드는 어떻게?
**기본은 라이트 전용.** 다크모드가 필요하면 "야간 자율학습 노트" 컨셉으로 `--paper-100`을 `#1E1B16` (구운 종이) 으로 치환하고 펜 색만 밝게 반전. 하지만 1차 릴리스는 라이트만 권장.

---

## 3. Typography

### 3.1 Font Stack

```css
/* Display — 손글씨 헤드라인 */
--font-display: 'Gaegu', 'Hi Melody', 'Nanum Pen Script', cursive;
/* 또는 유료: 'Cafe24 Dongdong', '배달의민족 주아' */

/* Headline — 정돈된 산세리프 */
--font-headline: 'Pretendard Variable', 'Pretendard', -apple-system, sans-serif;

/* Body — 읽기 편한 산세리프 */
--font-body: 'Pretendard Variable', 'Pretendard', sans-serif;

/* Monospace — 코드·숫자 */
--font-mono: 'JetBrains Mono', 'D2Coding', monospace;
```

> **Gaegu** (Google Fonts) 추천 이유: 무료, 한영 모두 지원, Superr의 loose 손글씨와 유사.

### 3.2 Type Scale

```css
/* Display (손글씨) — Hero, 섹션 타이틀 */
--text-display-xl: clamp(3rem, 6vw, 5.5rem);   /* font-weight: 400 */
--text-display-lg: clamp(2.25rem, 4vw, 3.5rem);
--text-display-md: clamp(1.75rem, 3vw, 2.5rem);

/* Headline (Pretendard) — 카드 타이틀 */
--text-h1: 2rem;      /* 32px, weight 700 */
--text-h2: 1.5rem;    /* 24px, weight 700 */
--text-h3: 1.25rem;   /* 20px, weight 600 */

/* Body */
--text-lg: 1.125rem;  /* 18px */
--text-base: 1rem;    /* 16px — line-height 1.7 */
--text-sm: 0.875rem;  /* 14px */
--text-xs: 0.75rem;   /* 12px — uppercase eyebrow */
```

### 3.3 조합 레시피

**Hero 헤드라인 (현재 "키노트 쇼케이스: 암묵지에서 AI로" 치환):**
```
Eyebrow: DIAGNOSTIC PLAYGROUND  [Pretendard · uppercase · tracking-widest · text-xs · ink-blue]
Display: 암묵지가 앱으로 [손글씨 Gaegu · display-xl]  ← 손글씨
         변하는 그 순간. [Pretendard Bold · display-xl]  ← 산세리프 혼합
Sub: 원장님의 8가지 수업 노하우가 탁월한 웹앱으로 변신하는 과정을 보여드립니다.
```

**핵심 트릭**: 한 문장 안에서 **손글씨 폰트 + 산세리프 Bold**를 섞어 superr.ai의 "actually! makes learning fun" 효과 재현.

---

## 4. Spatial & Layout Rules

### 4.1 Grid
- Max content width: `1120px` (hero는 `1280px`까지)
- Section padding: `py-24` 데스크톱 / `py-16` 모바일
- Card padding: `p-8` 데스크톱 / `p-6` 모바일
- Gap between cards: `gap-6` ~ `gap-8`

### 4.2 Rotation Quirks (superr.ai DNA)
스티커와 포스트잇류 요소에 **살짝 기울어진 각도** 부여:

```css
.sticker-rotate-left  { transform: rotate(-3deg); }
.sticker-rotate-right { transform: rotate(2deg); }
.sticker-rotate-sm    { transform: rotate(-1.5deg); }
```

규칙:
- 스티커·포스트잇: ±2° ~ ±4°
- 카드: 호버 시에만 ±1° (평상시 0°)
- 버튼: 회전 X (접근성·클릭 정확도)
- 헤드라인 한 단어만 회전 가능 (예: "actually!" 를 −6°)

### 4.3 Scattered Layout
CTA 섹션이나 feature 섹션에서 완벽한 그리드 대신 **흩뿌림(scattered) 레이아웃** 사용:

```
  [Card A]         [Card B]
              ○← 두들
       [Card C]
  [Card D]    ★← 스티커
```

각 카드가 그리드 셀 안에서 `translate`로 살짝 어긋나게 (±12px).

---

## 5. Iconography & Illustration Assets

### 5.1 필요한 Hand-drawn SVG 자산

**Underline / Circle / Arrow 두들 (11종)**
```
- scribble-underline-1.svg   (흐린 파도)
- scribble-underline-2.svg   (더블라인)
- circle-emphasis.svg        (단어 감싸는 원)
- arrow-curvy.svg           (S자 화살표)
- arrow-loop.svg            (원 그리며 가리키는 화살표)
- star-burst.svg            (4점 반짝이)
- heart-doodle.svg
- checkmark-handdrawn.svg
- asterisk-spark.svg
- squiggle-divider.svg       (섹션 구분선)
- highlighter-stroke.svg     (하이라이터 자국)
```

### 5.2 Sticker Pack (8종)
원장님 감성에 맞춘 **에듀 테마 스티커**:

| Sticker | 용도 | 컬러 |
|---|---|---|
| 📝 연필 (손으로 그린) | "Make" 느낌 | `--mustard` |
| 📖 펼친 책 | 읽기 영역 | `--ink-blue` |
| ⭐ 손글씨 별 | 성취 | `--mustard` |
| 💡 전구 두들 | 인사이트 | `--coral-pink` |
| 🎓 졸업모자 | 레벨업 | `--sage-green` |
| ✨ 반짝이 | XP 획득 애니메이션 | `--lavender` |
| 🏆 트로피 (시안) | 마스터 달성 | `--mustard` |
| 🫶 하트 | 추천 | `--coral-pink` |

> **제작 방법**: Figma에서 손글씨 브러시로 직접 그리거나, Midjourney `--niji` 모드로 "hand-drawn sticker, thick outline, pastel fill, childlike but refined" 프롬프트 사용. 최종 SVG export.

### 5.3 Paper Texture Background
```css
body {
  background-color: var(--paper-100);
  background-image: url('/textures/paper-grain.png');  /* 300x300 tileable, 8% opacity */
  background-repeat: repeat;
}
```
또는 CSS-only 노이즈:
```css
.paper-grain {
  background:
    radial-gradient(circle at 20% 30%, rgba(200,180,140,0.04) 1px, transparent 1px),
    radial-gradient(circle at 80% 70%, rgba(200,180,140,0.03) 1px, transparent 1px),
    var(--paper-100);
  background-size: 120px 120px, 180px 180px, auto;
}
```

---

## 6. Motion System

### 6.1 Easing Curves
```ts
// framer-motion / CSS transition
export const ease = {
  paper:   [0.22, 1, 0.36, 1],      // easeOutExpo — 페이지 진입
  bounce:  [0.68, -0.55, 0.27, 1.55], // easeOutBack — 스티커 등장
  pen:     [0.65, 0, 0.35, 1],      // easeInOutCubic — 선 그리기
  wobble:  'linear',                  // 무한 반복용
};
```

### 6.2 Duration Token
| 상황 | Duration |
|---|---|
| Hover (카드 lift) | `200ms` |
| 버튼 press | `120ms` |
| 스티커 등장 | `600ms` with bounce |
| 손글씨 그려지기 | `1400ms` (pen easing) |
| 섹션 reveal | `800ms` stagger 80ms |
| XP bar 채우기 | `900ms` |
| Wobble loop | `3s` infinite |

### 6.3 핵심 모션 패턴

#### ① Handwriting Reveal (Hero 헤드라인)
SVG `<path>`로 손글씨 제목을 그리고, `stroke-dasharray` 애니메이션으로 **펜이 글씨를 쓰는 효과**.

```tsx
<motion.path
  d="M10,40 Q30,10 50,40 T90,40"
  stroke="var(--ink-900)"
  strokeWidth="3"
  fill="transparent"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
/>
```

#### ② Highlighter Sweep (키워드 강조)
단어 뒤에 `--mustard` 색 직사각형을 `scaleX: 0 → 1`, `transform-origin: left`로 **형광펜이 그어지는 효과**.

```tsx
<span className="relative">
  AI로
  <motion.span
    className="absolute inset-x-0 bottom-0 h-[40%] bg-yellow-300 -z-10 rounded-sm"
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    style={{ transformOrigin: 'left' }}
    transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
  />
</span>
```

#### ③ Sticker Wobble (상시 미세 흔들림)
무한 반복으로 스티커가 살짝 떠 있는 느낌.

```tsx
<motion.img
  animate={{ rotate: [-3, 3, -3], y: [0, -4, 0] }}
  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
/>
```

#### ④ Card Lift (Hover)
```css
.lift-card {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.lift-card:hover {
  transform: translateY(-4px) rotate(-0.5deg);
  box-shadow: 0 12px 24px rgba(26,25,21,0.08);
}
```

#### ⑤ Scroll Reveal (섹션 진입)
```tsx
<motion.section
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
```
자식 요소는 `staggerChildren: 0.08`로 순차 등장.

#### ⑥ XP Bar = "연필로 채우기"
현재: 단순 width 애니메이션
신규: 색칠된 파란 연필이 옆으로 이동하며 흔적을 남기는 효과

```tsx
// 1) 배경 선 (연필 자국 기반선)
// 2) 채워지는 바 (width 0→N%)
// 3) 연필 아이콘이 바 끝을 따라 이동 + 살짝 wobble
<div className="relative h-3 bg-paper-300 rounded-full">
  <motion.div
    className="absolute inset-y-0 left-0 bg-ink-blue rounded-full"
    initial={{ width: '0%' }}
    whileInView={{ width: `${progress}%` }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
  />
  <motion.img
    src="/stickers/pencil.svg"
    className="absolute -top-4 w-8"
    initial={{ left: '0%' }}
    whileInView={{ left: `${progress}%` }}
    animate={{ rotate: [-2, 2, -2] }}
    transition={{
      left: { duration: 0.9 },
      rotate: { duration: 0.4, repeat: Infinity }
    }}
  />
</div>
```

#### ⑦ 레벨업 컨페티 (신규)
`0 XP → 100 XP` 돌파 시 스티커 8~12개가 화면에서 튀어나와 회전하며 떨어짐. `canvas-confetti` 라이브러리 + custom 스티커 shape 사용.

---

## 7. Component Patterns — Before / After

### 7.1 Hero Section

#### Before
```
[중앙 정렬 eyebrow + 제목 + 서브]
[큰 카드 안에 Primary CTA + 3컬럼 step]
```
— 모든 것이 중앙의 기계적 카드 안에 들어가 답답함.

#### After
```
좌측: eyebrow + 2줄 타이포 (손글씨+산세 믹스)
      → "암묵지가 앱으로 변하는 [그 순간.]"  (대괄호 = 하이라이터)
      서브텍스트
      [추천 시연 시작] 블루 버튼 + [직접 둘러보기] 아웃라인
우측: 원장님 노트북 오브젝트 (stack of 3 notebooks)
      → 각 노트북에 다른 표지, 스티커 부착, 살짝 기울어짐
주변: 떠다니는 스티커 3~4개 (pencil, star, book) w/ wobble
```

**레이아웃 변경**: 풀블리드 hero (h-screen-80vh), 좌텍스트 우비주얼 2-col, 배경은 paper-50.

### 7.2 Level / XP Card

#### Before
`견습 원장 · Lv.1 · 0 XP` — 블루 일자 프로그레스 바, 카드 배경 무덤덤

#### After
**"이름표(name-tag)" 컨셉**:
- 카드 배경: `--paper-50` + 상단에 구멍 2개 (노트 스프링 바인더처럼)
- 약간 기울어진 포스트잇 `--yellow-wash` 띠가 대각선으로 가로질러 "CURRENT LEVEL" 표시
- 레벨 뱃지: 손으로 그린 새싹 아이콘 (sage-green) — 다음 레벨은 나침반, 그 다음은 로켓
- XP 바: 위 §6.3 ⑥ 연필 채우기 모션
- 하단: "디음 목표: 2레벨 · 100 XP 남음" + 화살표 두들

### 7.3 Recommended Flow Card

#### Before
다크 네이비 배경, 블루 배지, 3개 step 박스가 flat한 카드

#### After
**"펼친 노트 페이지" 컨셉**:
- 배경: `--paper-50` with 가로 라인 (노트 괘선) `repeating-linear-gradient`
- 상단 좌측 스티커: "RECOMMENDED FLOW" 손글씨 포스트잇 (pink-wash, rotate -3°)
- 제목: "1. ReadMaster 진단부터 시작하세요" — `1.`만 손글씨 폰트로 크게
- 3개 step: 인덱스 탭(index tab)처럼 좌측 가장자리에 색 띠 붙은 카드, 각기 다른 rotation (−1°, 0°, +1°)
- CTA: "추천 시연 시작" 블루 버튼 (+) 마우스 호버 시 버튼 옆에 `arrow-curvy.svg` 두들 등장

### 7.4 Preview Box (맨 아래 금빛 박스)

#### Before
노란 테두리 + 굵은 헤더 — 평범한 alert

#### After
**"접힌 메모지" 컨셉**:
- 우상단 모서리가 접힌 듯한 SVG fold effect
- 제목 앞에 `highlighter-stroke.svg` 배경
- 인용문 앞뒤로 손글씨 따옴표 `"` `"` (Gaegu, 큰 사이즈)
- 하단 미세한 연필 자국 장식

---

## 8. Page Structure (Section-by-Section)

### 섹션 순서 (스크롤 따라)
```
1. Hero               — 풀블리드, 좌텍스트 우노트북
2. Level / XP 카드     — 떠있는 name-tag
3. Recommended Flow    — 펼친 노트 페이지
4. Guided Demo Steps   — 수평 스크롤 or 4단 그리드
5. Showcase Apps (8)   — 흩뿌려진 사진첩 스타일
6. 원장님 후기 / FAQ   — 포스트잇 월
7. Footer              — 손글씨 서명 + 소셜
```

### 각 섹션 연결 요소
섹션 사이에 **squiggle-divider.svg** (굴곡진 가로선) 삽입 — 스크롤 시 왼→오 그려지는 애니메이션.

---

## 9. Micro-Copy Upgrade

현재 카피는 기능 서술 위주. 새 카피는 **2인칭 말 건네기 + 정서적 단어** 사용.

| Before | After |
|---|---|
| DIAGNOSTIC PLATFORM | DIAGNOSTIC PLAYGROUND |
| 키노트 쇼케이스: 암묵지에서 AI로 | 원장님의 *암묵지*가 앱으로 변하는 순간. |
| 나만의 교육 암묵지가 8개의 탁월한 웹앱 솔루션으로... | 8개 노하우를 손으로 눌러보실 수 있게 준비했어요. |
| 1분 안에 맛 가치 체험 | 60초면 충분합니다 ☕ |
| 추천 시연 시작 | 지금 바로 체험하기 → |
| 직접 둘러보기 | 천천히 둘러보기 |
| 1. ReadMaster 열기 | 먼저, ReadMaster를 열어볼게요 |
| 가장 이해가 쉬운 앱으로 바로 진입합니다. | 설명 없이 바로 손에 쥐어지는 앱부터. |

**룰**: 모든 버튼 텍스트는 7자 이하, 문장은 22자 이하. CTA는 화살표 `→` 또는 `↗`로 마무리.

---

## 10. Tailwind Config (v4)

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-paper-50:   #FDFBF7;
  --color-paper-100:  #FAF7F2;
  --color-paper-200:  #F3EEE4;
  --color-paper-300:  #E8DFCE;
  --color-ink-900:    #1A1915;
  --color-ink-700:    #3C3A33;
  --color-ink-500:    #7A746A;
  --color-ink-blue:   #2E5BFF;
  --color-coral:      #FF6B6B;
  --color-mustard:    #F4B740;
  --color-sage:       #7CB342;
  --color-lavender:   #B794F4;
  --color-blue-wash:  #E8EFFF;
  --color-pink-wash:  #FFE8E8;
  --color-yellow-wash:#FFF4DB;
  --color-green-wash: #EBF5E0;

  --font-display:  'Gaegu', cursive;
  --font-sans:     'Pretendard Variable', sans-serif;

  --ease-paper:  cubic-bezier(0.22, 1, 0.36, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);
  --ease-pen:    cubic-bezier(0.65, 0, 0.35, 1);

  --shadow-sticky: 0 2px 6px rgba(26,25,21,0.08),
                   0 8px 20px rgba(26,25,21,0.04);
  --shadow-notebook: 0 1px 0 var(--color-paper-300),
                     0 12px 30px rgba(26,25,21,0.06);
}

/* Paper texture */
body {
  background-color: var(--color-paper-100);
  background-image:
    radial-gradient(circle at 20% 30%, rgba(200,180,140,0.05) 1px, transparent 1px),
    radial-gradient(circle at 80% 70%, rgba(200,180,140,0.04) 1px, transparent 1px);
  background-size: 140px 140px, 200px 200px;
  font-family: var(--font-sans);
  color: var(--color-ink-900);
}

/* Notebook line 장식 유틸리티 */
.notebook-lines {
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 31px,
    rgba(46,91,255,0.08) 31px,
    rgba(46,91,255,0.08) 32px
  );
}
```

---

## 11. Accessibility Checklist

- [ ] 손글씨 폰트는 장식용에만 사용, **본문은 반드시 Pretendard**
- [ ] 회전된 카드라도 `aria-label` 정상, 포커스 링은 수평
- [ ] 애니메이션은 `prefers-reduced-motion` 감지 시 모두 OFF
- [ ] 스티커·두들은 모두 `aria-hidden="true"` (decorative)
- [ ] 대비비: paper-100 + ink-900 = 15.8:1 (WCAG AAA 통과)
- [ ] 버튼 최소 터치 타겟 44×44px 유지
- [ ] 형광펜 sweep 효과는 텍스트 대비에 영향 없도록 `z-index: -1` 배치

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## 12. Implementation Roadmap

### Phase 1 — Foundation (2일)
- [ ] Gaegu 폰트 + Pretendard 로드 설정
- [ ] Tailwind theme 토큰 적용
- [ ] Paper texture 배경 적용
- [ ] 스티커 SVG 8종 제작/컬러 토큰화

### Phase 2 — Hero + Level (2일)
- [ ] Hero 레이아웃 2-col 전환
- [ ] Handwriting reveal SVG 경로 작성
- [ ] Highlighter sweep 컴포넌트
- [ ] Level 카드 name-tag 스타일
- [ ] XP 바 연필 모션

### Phase 3 — Flow + Demo (2일)
- [ ] Notebook-page 카드 리디자인
- [ ] Step tab 3-card 레이아웃
- [ ] 섹션 간 squiggle divider
- [ ] Scroll reveal 전면 적용

### Phase 4 — Polish (1일)
- [ ] `prefers-reduced-motion` 전수 점검
- [ ] 모바일 반응형 (스티커 축소/비표시 결정)
- [ ] 레벨업 confetti 이벤트
- [ ] FAQ 포스트잇 월

### Phase 5 — Content (1일)
- [ ] 마이크로카피 전체 리라이팅
- [ ] `<head>` OG 이미지 노트북 스타일로 재제작

**총 예상: 8 작업일**

---

## 13. 레퍼런스 & 영감

- **Superr.ai** — 종이·손글씨·스티커 DNA의 원천
- **Linear Method** (linear.app/method) — 타이포 리듬
- **Notion "Calm notebook"** 2024 리브랜드 — 파스텔 중립톤
- **모나미 153** 만년필 블루 — primary blue 근거
- **국민서관 / 위즈덤하우스 어린이책 표지** — 한국 에듀 색감
- **배달의민족 주아체** — 한글 손글씨 대안 폰트

---

## 14. 최종 원칙 (Design Constitution)

> **세 문장으로 요약**

1. **종이는 배경이 아니라 주인공이다.** 모든 카드·섹션은 "종이 위의 무언가"로 설계하라.
2. **손글씨는 소금처럼 쓴다.** 전체 UI의 10% 이하에만 사용, 나머지는 Pretendard로 가독성 확보.
3. **장난은 원장님의 품위를 해치지 않는 선에서.** 스티커는 8개 이하, 회전은 ±4° 이하, 컬러 블록은 한 화면에 3색 이하.

---

*문서 v1.0 · 2026.04.18 · Tacit KnowledgeLab Design Team*
