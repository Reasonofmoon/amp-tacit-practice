# AMP 키노트 영상 에피소드 기획안

> **"암묵지에서 AI 앱까지"** — 8개 앱을 8편의 시네마틱 에피소드로

---

## 🎬 프로젝트 개요

강연 시연 시 각 앱을 **30~90초 시네마틱 에피소드 영상**으로 소개합니다.
영상은 Phase A(암묵지 스토리) → Phase B(앱 실제 화면) 구조를 유지합니다.

### 제작 파이프라인

```
[1단계] Google Whisk → 캐릭터/씬 이미지 생성 (스타일 통일)
[2단계] Veo 2 or Flow → 이미지 → 30~90초 영상 클립 생성
[3단계] Suno AI → 에피소드별 BGM 생성 (Lo-fi / Cinematic)
[4단계] Remotion → 텍스트 오버레이 + 자막 + 최종 편집 렌더링
```

---

## 🧩 기존 프로젝트에서 뽑아낸 핵심 컨셉

| 프로젝트 | 핵심 기술 | 에피소드에 활용할 패턴 |
|---|---|---|
| **remo-motion-graphic** | Remotion + Gemini Imagen + Veo 파이프라인 | Kinetic Typography — 암묵지 문장이 시네마틱 텍스트로 등장 |
| **suno-album** | Suno AI 음악 생성 + 트렌드 분석 | 에피소드별 lo-fi BGM 자동 생성 (30~60초 트랙) |
| **lofi-video-factory** | Firebase → Suno → ElevenLabs → Veo → Remotion | 상태 머신 기반 영상 생성 파이프라인 (자동화 가능) |
| **fairy-tale** (404) | 동화 스타일 스토리텔링 추정 | Google Whisk에서 동화/일러스트 스타일 캐릭터 생성 |
| **dreamweave-vid** (404) | 꿈결 비주얼 영상 추정 | Veo 2에서 몽환적 전환 효과 프롬프트 참조 |

---

## 📺 8편 에피소드 상세

### Ep.1 — 📖 ReadMaster: "첫눈에 아는 직감" (30초)

| 항목 | 내용 |
|---|---|
| **씬 구성** | 원장님이 새 학생을 바라보는 시선 → 학생의 읽기 레벨이 숫자로 떠오르는 AR오버레이 |
| **Whisk 프롬프트** | "Korean female teacher observing a young student reading a book, warm classroom, watercolor illustration style, soft lighting" |
| **Veo/Flow 프롬프트** | "Camera slowly zooms into the teacher's eyes, translucent AR data overlays appear showing reading level metrics, cinematic warm tones" |
| **BGM** | Suno: "calm acoustic piano, educational documentary, 30 seconds" |
| **Remotion 오버레이** | Kinetic text: "직관 → 알고리즘 → 앱" |

### Ep.2 — 🐾 Pet Trip: "30분을 30초로" (30초)

| 항목 | 내용 |
|---|---|
| **씬 구성** | 학부모 상담장면 → 학습 여정이 게임 지도로 변환 → 펫 캐릭터가 달려감 |
| **Whisk 프롬프트** | "Cute animal character (cat/dog) traveling through a colorful game-style map with learning checkpoints, pixel art meets watercolor, joyful" |
| **Veo/Flow 프롬프트** | "A game map unfolds from a textbook, cute pet character runs through checkpoints, each checkpoint lights up, top-down camera angle" |
| **BGM** | Suno: "cheerful 8-bit chiptune mixed with orchestral, adventure theme, 30 seconds" |
| **Remotion 오버레이** | 진행률 바 애니메이션 + "30분 설명 → 30초" 텍스트 |

### Ep.3 — 🐶 SmartStart: "아이가 웃으면 성공" (45초)

| 항목 | 내용 |
|---|---|
| **씬 구성** | 아이가 처음 영어를 접하는 무표정 → 마스코트 등장 → 미션 클리어 → 환한 웃음 |
| **Whisk 프롬프트** | "Kawaii puppy mascot teaching alphabet to a small Korean child, colorful classroom with stickers and stars, Studio Ghibli style" |
| **Veo/Flow 프롬프트** | "A shy child sits at a desk, a friendly animated puppy appears from a tablet screen, child gradually smiles as stars float around" |
| **BGM** | Suno: "playful xylophone and ukulele, children's education, warm, 45 seconds" |
| **Remotion 오버레이** | 별 파티클 이펙트 + "동기부여 = 게이미피케이션" Kinetic text |

### Ep.4 — 🌌 Edu Ontology: "단어의 뿌리를 보는 눈" (45초)

| 항목 | 내용 |
|---|---|
| **씬 구성** | 단어 "tragedy" → 그리스 신전 + 염소 + 노래하는 합창단 → 어원 그래프 |
| **Whisk 프롬프트** | "Ancient Greek amphitheater with goats and a choir, the word 'TRAGEDY' formed by stars in the night sky, mythological art style" |
| **Veo/Flow 프롬프트** | "Camera flies through a constellation of connected words, each node pulses with light, neural network visualization in cosmic space" |
| **BGM** | Suno: "epic orchestral with ethereal choir, Greek mythology, 45 seconds" |
| **Remotion 오버레이** | 그래프 노드 + 연결선 애니메이션 + 어원 분해 텍스트 |

### Ep.5 — 🔗 Knot: "섬에서 대륙으로" (45초)

| 항목 | 내용 |
|---|---|
| **씬 구성** | 포스트잇이 흩어진 책상 → 노트들이 실로 연결 → 3D 지식 그래프로 변환 |
| **Whisk 프롬프트** | "Scattered colorful sticky notes on a desk, golden threads connecting them into a beautiful 3D knowledge web, minimalist art" |
| **Veo/Flow 프롬프트** | "Sticky notes float up from a desk and connect with glowing threads, camera pulls back to reveal a rotating 3D knowledge galaxy" |
| **BGM** | Suno: "ambient electronic with soft piano, knowledge discovery, 45 seconds" |
| **Remotion 오버레이** | "메모 → 연결 → 대륙" 3단계 Kinetic typography |

### Ep.6 — 🌊 BlueL: "청사진이 수업이 되다" (45초)

| 항목 | 내용 |
|---|---|
| **씬 구성** | 건축 청사진 도면 → 도면이 접혀서 교실이 됨 → 학생들이 단계별 실습 |
| **Whisk 프롬프트** | "Architectural blueprint unfolding into a modern classroom, students at desks with holographic step-by-step guides, blue tones" |
| **Veo/Flow 프롬프트** | "A blue blueprint paper unfolds and transforms into a 3D classroom, each section illuminates as students progress step by step" |
| **BGM** | Suno: "inspiring cinematic strings, building crescendo, educational, 45 seconds" |
| **Remotion 오버레이** | MECE 다이어그램 + 난이도 게이지 애니메이션 |

### Ep.7 — 🏰 Librainy: "500권의 안목" (60초) ⭐ 메인

| 항목 | 내용 |
|---|---|
| **씬 구성** | 거대한 도서관 → 원장님이 3초만에 책을 집음 → 데이터가 흐름 → AI 대시보드 |
| **Whisk 프롬프트** | "Magical castle library with floating books, a wise librarian surrounded by glowing data streams, Harry Potter meets tech, grand scale" |
| **Veo/Flow 프롬프트** | "Camera flies through a majestic library, books glow and data streams flow from them to a holographic dashboard, grand orchestral feel" |
| **BGM** | Suno: "grand orchestral with magical elements, library ambiance, epic reveal, 60 seconds" |
| **Remotion 오버레이** | 대시보드 UI 모션 + "20년의 눈 → AI의 눈" Kinetic text |

### Ep.8 — 🚀 MoonLang: "안목이 수입이 되다" (60초) ⭐ 피날레

| 항목 | 내용 |
|---|---|
| **씬 구성** | AI 도구들이 은하처럼 나열 → 원장님 손이 하나를 선택 → 레퍼럴 링크 → 💰 |
| **Whisk 프롬프트** | "Galaxy of glowing AI tool icons floating in space, a hand reaches out to select one, golden connection lines form, futuristic" |
| **Veo/Flow 프롬프트** | "A cosmic catalog of AI tools, a curator's hand selects a tool, referral connections form like golden neural pathways, money particles" |
| **BGM** | Suno: "futuristic synthwave, triumphant, business success, 60 seconds" |
| **Remotion 오버레이** | "암묵지 → 큐레이션 → 비즈니스" final Kinetic typography + 전체 8개 앱 몽타주 |

---

## 🛠️ 제작 워크플로우

### Step 1: Google Whisk로 씬 이미지 생성

```
1. labs.google.com/whisk 접속
2. 각 에피소드의 Whisk 프롬프트 입력
3. 스타일 일관성을 위해 동일한 "Subject + Scene + Style" 3-input 패턴 사용
4. 각 에피소드당 3~5장 키프레임 이미지 생성
5. 최종 선별: 에피소드당 2~3장
```

### Step 2: Veo 2 / Flow로 영상 생성

```
1. AI Studio (ai.studio/apps) 또는 VideoFX(aitestkitchen.withgoogle.com/tools/video-fx) 접속
2. Whisk에서 만든 이미지를 "씬 참조 이미지"로 업로드
3. Veo/Flow 프롬프트 입력 → 30~60초 클립 생성
4. 에피소드당 2~3 클립 생성 후 베스트 선별
```

### Step 3: Suno AI로 BGM 생성

```
1. suno.com 접속
2. 각 에피소드의 BGM 프롬프트 입력
3. 30~60초 트랙 생성 (Custom Mode)
4. 볼륨 조절 및 페이드 인/아웃 처리
```

### Step 4: Remotion으로 최종 편집

```
1. remo-motion-graphic 프로젝트의 Composition 패턴 활용
2. 각 에피소드를 Sequence로 구성
3. Kinetic Typography 오버레이 추가
4. BGM + Veo 영상 + 텍스트 → 최종 렌더링
5. 1920×1080@30fps MP4 출력
```

---

## 📊 제작 일정 (예상)

| 단계 | 소요 시간 | 산출물 |
|---|---|---|
| Whisk 이미지 생성 | 2~3시간 | 에피소드당 3~5장 × 8편 = 24~40장 |
| Veo/Flow 영상 생성 | 3~4시간 | 에피소드당 2~3 클립 × 8편 = 16~24 클립 |
| Suno BGM 생성 | 1~2시간 | 8트랙 |
| Remotion 편집 렌더링 | 4~6시간 | 8편 최종 영상 |
| **합계** | **~15시간 (2일)** | **8편 × 30~90초 = 총 5~8분** |

---

## 🎥 최종 사용 시나리오

강연 중 각 앱 시연 **직전에** 해당 에피소드 영상을 재생합니다:

```
강연자: "두 번째 앱을 보기 전에, 짧은 영상을 하나 보시겠습니다."
→ [Ep.2 Pet Trip 30초 영상 재생]
→ 영상 끝 → 쇼케이스 앱에서 Pet Trip 노드 클릭 → 라이브 시연
```

이 구조로 **"감성적 몰입(영상) → 이성적 체험(라이브 시연)"** 의 2단계 임팩트를 만듭니다.
