/**
 * AMP 26 lecture slides — 2026-11-11
 * Run: node docs/build-amp26-slides.mjs
 */
import pptxgen from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, process.env.AMP26_SLIDES_OUT || 'AMP26_Lecture_Slides.pptx');

const C = {
  ink: '1A1915',
  inkSoft: '3C3A33',
  muted: '6B6560',
  paper: 'FAF7F2',
  paperDeep: 'F3EEE4',
  white: 'FFFFFF',
  accent: '0F766E',
  accentSoft: 'CCFBF1',
  coral: 'C2410C',
  gold: 'B45309',
  blue: '1D4ED8',
  violet: '6D28D9',
  line: 'E8DFCE',
};

const shadow = () => ({
  type: 'outer',
  color: '000000',
  blur: 8,
  offset: 3,
  angle: 135,
  opacity: 0.08,
});

function footer(slide, page, total) {
  slide.addText('AMP 26 · 2026.11.11 · 송세훈', {
    x: 0.5, y: 5.25, w: 6.5, h: 0.28,
    fontSize: 11, fontFace: 'Calibri', color: C.muted, margin: 0,
  });
  slide.addText(`${page} / ${total}`, {
    x: 8.2, y: 5.25, w: 1.3, h: 0.28,
    fontSize: 11, fontFace: 'Calibri', color: C.muted, align: 'right', margin: 0,
  });
}

function sectionBar(slide, color = C.accent) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625,
    fill: { color }, line: { color },
  });
}

function card(slide, x, y, w, h, fill = C.white) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: fill },
    rectRadius: 0.08,
    shadow: shadow(),
    line: { color: C.line, width: 1 },
  });
}

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = '송세훈';
pres.title = 'AI 시대에 뒤처지지 않는 7가지 — AMP 26';
pres.subject = '2026-11-11 AMP 26 lecture';

const TOTAL = 21;

// ── 1 Title ──────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.ink };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: C.accent }, line: { color: C.accent },
  });
  s.addText('고려대학교 AMP 26기', {
    x: 0.7, y: 1.2, w: 8.5, h: 0.4,
    fontSize: 16, fontFace: 'Calibri', color: '94A3B8', margin: 0,
  });
  s.addText('AI 시대에 뒤처지지 않는\n7가지', {
    x: 0.7, y: 1.7, w: 8.5, h: 1.6,
    fontSize: 40, fontFace: 'Georgia', color: C.white, bold: true, margin: 0,
  });
  s.addText('보고 · 3줄 남기고 · AI 말에 이름 붙이기', {
    x: 0.7, y: 3.5, w: 8.5, h: 0.4,
    fontSize: 18, fontFace: 'Calibri', color: '5EEAD4', margin: 0,
  });
  s.addText('송세훈  ·  2026.11.11  14:00–15:30  ·  amp-tacit-practice.vercel.app', {
    x: 0.7, y: 4.6, w: 8.5, h: 0.35,
    fontSize: 13, fontFace: 'Calibri', color: '94A3B8', margin: 0,
  });
}

// ── 2 Promise ────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s);
  s.addText('오늘 90분의 약속', {
    x: 0.5, y: 0.35, w: 9, h: 0.55,
    fontSize: 32, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const items = [
    { t: '도구·코딩 수업이 아닙니다', d: '메모장에 적을 수 있는 것 3개만 가져가면 성공' },
    { t: '① ② ③ 을 깊게', d: '정보 문·서랍 정하기 · 3줄 남기기 · AI 단축어 이름' },
    { t: '④ ~ ⑦ 은 지도로', d: '역할 쪽지 · 합격 기준 · 센 한 줄 · 팀 채널 한 장' },
  ];
  items.forEach((it, i) => {
    const y = 1.2 + i * 1.2;
    card(s, 0.5, y, 9, 1.05, C.white);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7, y: y + 0.28, w: 0.5, h: 0.5,
      fill: { color: C.accentSoft }, rectRadius: 0.08, line: { color: C.accentSoft },
    });
    s.addText(String(i + 1), {
      x: 0.7, y: y + 0.28, w: 0.5, h: 0.5,
      fontSize: 18, fontFace: 'Georgia', color: C.accent, bold: true, align: 'center', valign: 'middle', margin: 0,
    });
    s.addText(it.t, {
      x: 1.45, y: y + 0.18, w: 7.8, h: 0.35,
      fontSize: 18, fontFace: 'Calibri', color: C.ink, bold: true, margin: 0,
    });
    s.addText(it.d, {
      x: 1.45, y: y + 0.55, w: 7.8, h: 0.35,
      fontSize: 14, fontFace: 'Calibri', color: C.muted, margin: 0,
    });
  });
  footer(s, 2, TOTAL);
}

// ── 3 Three messages ─────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s);
  s.addText('세 문장만 기억하세요', {
    x: 0.5, y: 0.35, w: 9, h: 0.5,
    fontSize: 28, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const msgs = [
    { n: '01', c: C.accent, t: 'ChatGPT 종류 문제가 아닙니다', d: '정보가 흩어지고, 본 걸 안 적고, 같은 말을 매번 다시 침' },
    { n: '02', c: C.blue, t: '말로 설명 못 하는 판단이 보물입니다', d: '원장=상담 감 / 실무=처리 순서 / 기획=안 만들 기준' },
    { n: '03', c: C.violet, t: '증명 방법은 매일 돌리는 습관입니다', d: '앱 시연 + 데브로그처럼 “받는 주소”가 있는 사람' },
  ];
  msgs.forEach((m, i) => {
    const y = 1.05 + i * 1.3;
    card(s, 0.5, y, 9, 1.15);
    s.addText(m.n, {
      x: 0.75, y: y + 0.3, w: 1.1, h: 0.55,
      fontSize: 28, fontFace: 'Georgia', color: m.c, bold: true, margin: 0,
    });
    s.addText(m.t, {
      x: 2.0, y: y + 0.22, w: 7.2, h: 0.4,
      fontSize: 18, fontFace: 'Calibri', color: C.ink, bold: true, margin: 0,
    });
    s.addText(m.d, {
      x: 2.0, y: y + 0.65, w: 7.2, h: 0.35,
      fontSize: 14, fontFace: 'Calibri', color: C.muted, margin: 0,
    });
  });
  footer(s, 3, TOTAL);
}

// ── 4 My story ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s, C.gold);
  s.addText('나의 이야기', {
    x: 0.5, y: 0.35, w: 9, h: 0.45,
    fontSize: 28, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  s.addText('몸이 아는데 입이 안 따라옵니다', {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 20, fontFace: 'Georgia', color: C.gold, italic: true, margin: 0,
  });
  const cols = [
    { h: '현장', b: '새 학생의 레벨 감\n상담 한 마디의 위기 신호\n말로 못 쓰는 판단' },
    { h: '한계', b: '한 사람에게만 있으면\n조직이 스케일되지 않음\n인수인계가 불가능' },
    { h: '전환', b: '감각을 흐르게\n닫고 절차로\n루프를 소유' },
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.1;
    card(s, x, 1.55, 2.95, 2.9);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.55, w: 2.95, h: 0.12, fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText(c.h, {
      x: x + 0.2, y: 1.9, w: 2.55, h: 0.45,
      fontSize: 20, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
    });
    s.addText(c.b, {
      x: x + 0.2, y: 2.5, w: 2.55, h: 1.7,
      fontSize: 15, fontFace: 'Calibri', color: C.inkSoft, margin: 0,
    });
  });
  footer(s, 4, TOTAL);
}

// ── 5 Translation ────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s, C.blue);
  s.addText('조직의 암묵지 — 세 언어로', {
    x: 0.5, y: 0.35, w: 9, h: 0.5,
    fontSize: 28, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const rows = [
    { role: '원장', ex: '상담 직관 · 퇴원 신호 · 반 배정 감각' },
    { role: '실무', ex: '반복 보고 순서 · 예외 처리 · 에스컬레이션' },
    { role: '기획', ex: '‘이건 아니다’ 기준 · 우선순위 감각' },
  ];
  rows.forEach((r, i) => {
    const y = 1.15 + i * 1.15;
    card(s, 0.5, y, 9, 1.0);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7, y: y + 0.25, w: 1.5, h: 0.5,
      fill: { color: C.accentSoft }, rectRadius: 0.08, line: { color: C.accentSoft },
    });
    s.addText(r.role, {
      x: 0.7, y: y + 0.25, w: 1.5, h: 0.5,
      fontSize: 16, fontFace: 'Calibri', color: C.accent, bold: true, align: 'center', valign: 'middle', margin: 0,
    });
    s.addText(r.ex, {
      x: 2.5, y: y + 0.28, w: 6.7, h: 0.45,
      fontSize: 17, fontFace: 'Calibri', color: C.ink, margin: 0, valign: 'middle',
    });
  });
  footer(s, 5, TOTAL);
}

// ── 6 Seven map ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s);
  s.addText('7원칙 전체 지도', {
    x: 0.5, y: 0.3, w: 9, h: 0.45,
    fontSize: 28, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  s.addText('오늘: ①②③ 깊게  ·  ④⑤⑥⑦ 지도', {
    x: 0.5, y: 0.8, w: 9, h: 0.3,
    fontSize: 14, fontFace: 'Calibri', color: C.muted, margin: 0,
  });
  const principles = [
    { n: '①', t: '문·서랍\n정하기', deep: true },
    { n: '②', t: '3줄\n남기기', deep: true },
    { n: '③', t: 'AI\n단축어', deep: true },
    { n: '④', t: '역할\n쪽지', deep: false },
    { n: '⑤', t: '합격\n기준', deep: false },
    { n: '⑥', t: '센\n한 줄', deep: false },
    { n: '⑦', t: '팀 채널\n한 장', deep: false },
  ];
  principles.forEach((p, i) => {
    const x = 0.35 + i * 1.35;
    const fill = p.deep ? C.accent : C.white;
    const tc = p.deep ? C.white : C.ink;
    card(s, x, 1.5, 1.25, 2.6, fill);
    s.addText(p.n, {
      x, y: 1.85, w: 1.25, h: 0.7,
      fontSize: 28, fontFace: 'Georgia', color: tc, bold: true, align: 'center', margin: 0,
    });
    s.addText(p.t, {
      x: x + 0.08, y: 2.7, w: 1.1, h: 0.9,
      fontSize: 13, fontFace: 'Calibri', color: tc, align: 'center', margin: 0,
    });
    s.addText(p.deep ? '깊게' : '지도', {
      x, y: 3.6, w: 1.25, h: 0.3,
      fontSize: 11, fontFace: 'Calibri', color: p.deep ? '99F6E4' : C.muted, align: 'center', margin: 0,
    });
  });
  footer(s, 6, TOTAL);
}

// ── 7 P1 cover ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.accent };
  s.addText('원칙 ①', {
    x: 0.7, y: 1.6, w: 8.5, h: 0.45,
    fontSize: 18, fontFace: 'Calibri', color: '99F6E4', margin: 0,
  });
  s.addText('정보 문 하나,\n서랍 하나 정하기', {
    x: 0.7, y: 2.15, w: 8.5, h: 1.4,
    fontSize: 32, fontFace: 'Georgia', color: C.white, bold: true, margin: 0,
  });
  s.addText('14:14 – 14:28  ·  받기→골라내기→넣어두기→다시 꺼내기', {
    x: 0.7, y: 4.3, w: 8.5, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: 'CCFBF1', margin: 0,
  });
}

// ── 8 P1 myth ────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s, C.accent);
  s.addText('① 오해 깨기', {
    x: 0.5, y: 0.35, w: 9, h: 0.45,
    fontSize: 26, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  card(s, 0.5, 1.2, 4.3, 3.2, 'FEF2F2');
  s.addText('❌', {
    x: 0.7, y: 1.5, w: 3.9, h: 0.5,
    fontSize: 28, align: 'center', margin: 0,
  });
  s.addText('북마크·폴더만\n늘리면 된다', {
    x: 0.7, y: 2.2, w: 3.9, h: 1.2,
    fontSize: 22, fontFace: 'Georgia', color: C.coral, bold: true, align: 'center', margin: 0,
  });
  s.addText('나중에 못 찾음 = 창고', {
    x: 0.7, y: 3.6, w: 3.9, h: 0.4,
    fontSize: 15, fontFace: 'Calibri', color: C.muted, align: 'center', margin: 0,
  });
  card(s, 5.2, 1.2, 4.3, 3.2, 'ECFDF5');
  s.addText('✅', {
    x: 5.4, y: 1.5, w: 3.9, h: 0.5,
    fontSize: 28, align: 'center', margin: 0,
  });
  s.addText('받는 문 하나\n서랍 하나 정한다', {
    x: 5.4, y: 2.2, w: 3.9, h: 1.2,
    fontSize: 22, fontFace: 'Georgia', color: C.accent, bold: true, align: 'center', margin: 0,
  });
  s.addText('금요일에 다시 꺼내 쓴다', {
    x: 5.4, y: 3.6, w: 3.9, h: 0.4,
    fontSize: 15, fontFace: 'Calibri', color: C.muted, align: 'center', margin: 0,
  });
  footer(s, 8, TOTAL);
}

// ── 9 P1 stages ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s, C.accent);
  s.addText('① 네 칸만 채우면 됩니다', {
    x: 0.5, y: 0.3, w: 9, h: 0.45,
    fontSize: 26, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const stages = [
    { n: '1', t: '받기', d: '카톡? 메일?\n입구 1개' },
    { n: '2', t: '골라내기', d: '이번 주에\n쓸 것만' },
    { n: '3', t: '넣어두기', d: '노션/메모\n서랍 1개' },
    { n: '4', t: '다시 꺼내기', d: '금 20분\n다시 보기' },
  ];
  stages.forEach((st, i) => {
    const x = 0.45 + i * 2.4;
    card(s, x, 1.3, 2.25, 2.8);
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.75, y: 1.6, w: 0.75, h: 0.75,
      fill: { color: C.accent }, line: { color: C.accent },
    });
    s.addText(st.n, {
      x: x + 0.75, y: 1.6, w: 0.75, h: 0.75,
      fontSize: 22, fontFace: 'Georgia', color: C.white, bold: true, align: 'center', valign: 'middle', margin: 0,
    });
    s.addText(st.t, {
      x: x + 0.15, y: 2.6, w: 1.95, h: 0.45,
      fontSize: 20, fontFace: 'Georgia', color: C.ink, bold: true, align: 'center', margin: 0,
    });
    s.addText(st.d, {
      x: x + 0.15, y: 3.2, w: 1.95, h: 0.5,
      fontSize: 14, fontFace: 'Calibri', color: C.muted, align: 'center', margin: 0,
    });
  });
  footer(s, 9, TOTAL);
}

// ── 10 P1 demo cue ───────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s, C.accent);
  s.addText('① 시연 큐', {
    x: 0.5, y: 0.35, w: 9, h: 0.45,
    fontSize: 26, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  card(s, 0.5, 1.1, 9, 3.5);
  s.addText([
    { text: '1. 앱 → 원칙 #1 설명 탭', options: { breakLine: true } },
    { text: '2. 4단계 프레임 스크롤', options: { breakLine: true } },
    { text: '3. 라이브: reasonofmoon.github.io 최신 브리핑', options: { breakLine: true } },
    { text: '4. 좌석: 정보 입구 1개 적기', options: { breakLine: true } },
  ], {
    x: 0.9, y: 1.5, w: 8.2, h: 2.5,
    fontSize: 20, fontFace: 'Calibri', color: C.ink, paraSpaceAfter: 12, margin: 0,
  });
  footer(s, 10, TOTAL);
}

// ── 11 P2 cover ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: 'B45309' };
  s.addText('원칙 ②', {
    x: 0.7, y: 1.6, w: 8.5, h: 0.45,
    fontSize: 18, fontFace: 'Calibri', color: 'FDE68A', margin: 0,
  });
  s.addText('보면 끝?\n3줄 남기고 끝', {
    x: 0.7, y: 2.15, w: 8.5, h: 1.4,
    fontSize: 32, fontFace: 'Georgia', color: C.white, bold: true, margin: 0,
  });
  s.addText('14:28 – 14:41  ·  형태 · 시한 · 3줄이면 닫힘', {
    x: 0.7, y: 4.3, w: 8.5, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: 'FEF3C7', margin: 0,
  });
}

// ── 12 P2 hook ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.ink };
  s.addText('질문', {
    x: 0.7, y: 1.3, w: 8.5, h: 0.4,
    fontSize: 16, fontFace: 'Calibri', color: 'FBBF24', margin: 0,
  });
  s.addText('지난 한 달 본 것 중,\n지금 3분 설명할 수 있는 게\n몇 개입니까?', {
    x: 0.7, y: 1.9, w: 8.5, h: 2.0,
    fontSize: 28, fontFace: 'Georgia', color: C.white, bold: true, margin: 0,
  });
  s.addText('… 나머지는 사라진 게 아닙니다. 닫히지 않았을 뿐입니다.', {
    x: 0.7, y: 4.3, w: 8.5, h: 0.4,
    fontSize: 16, fontFace: 'Calibri', color: '94A3B8', italic: true, margin: 0,
  });
}

// ── 13 P2 contract ───────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s, C.gold);
  s.addText('② 나는 이렇게 쓰기로 한다 (빈칸)', {
    x: 0.5, y: 0.3, w: 9, h: 0.45,
    fontSize: 24, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const contracts = [
    { n: '형태', d: '유튜브 보면 → 제목 + 핵심 3줄 + 내 생각 1줄' },
    { n: '시한', d: '본 날 자정 전 / 늦어도 24시간 안' },
    { n: '최소', d: '3줄만 써도 “끝”으로 친다 (완벽 금지)' },
  ];
  contracts.forEach((c, i) => {
    const y = 1.1 + i * 1.2;
    card(s, 0.5, y, 9, 1.05);
    s.addText(`${i + 1}`, {
      x: 0.75, y: y + 0.25, w: 0.6, h: 0.55,
      fontSize: 28, fontFace: 'Georgia', color: C.gold, bold: true, margin: 0,
    });
    s.addText(c.n, {
      x: 1.5, y: y + 0.2, w: 7.5, h: 0.35,
      fontSize: 18, fontFace: 'Calibri', color: C.ink, bold: true, margin: 0,
    });
    s.addText(c.d, {
      x: 1.5, y: y + 0.55, w: 7.5, h: 0.35,
      fontSize: 15, fontFace: 'Calibri', color: C.muted, margin: 0,
    });
  });
  footer(s, 13, TOTAL);
}

// ── 14 P3 cover ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.violet };
  s.addText('원칙 ③', {
    x: 0.7, y: 1.6, w: 8.5, h: 0.45,
    fontSize: 18, fontFace: 'Calibri', color: 'DDD6FE', margin: 0,
  });
  s.addText('AI에 맨날 치는 그 말,\n이름 붙여 두기', {
    x: 0.7, y: 2.15, w: 8.5, h: 1.4,
    fontSize: 32, fontFace: 'Georgia', color: C.white, bold: true, margin: 0,
  });
  s.addText('14:41 – 14:55  ·  이름 · 빈칸 · 결과 모양 · 합격 기준', {
    x: 0.7, y: 4.3, w: 8.5, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: 'EDE9FE', margin: 0,
  });
}

// ── 15 P3 478 ────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s, C.violet);
  s.addText('③ 자산인가, 쓰레기인가', {
    x: 0.5, y: 0.35, w: 9, h: 0.45,
    fontSize: 26, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  card(s, 0.5, 1.2, 4.3, 3.2);
  s.addText('478', {
    x: 0.5, y: 1.8, w: 4.3, h: 1.0,
    fontSize: 64, fontFace: 'Georgia', color: C.muted, bold: true, align: 'center', margin: 0,
  });
  s.addText('아카이브 파일', {
    x: 0.5, y: 3.0, w: 4.3, h: 0.4,
    fontSize: 16, fontFace: 'Calibri', color: C.muted, align: 'center', margin: 0,
  });
  card(s, 5.2, 1.2, 4.3, 3.2, 'F5F3FF');
  s.addText('7', {
    x: 5.2, y: 1.8, w: 4.3, h: 1.0,
    fontSize: 64, fontFace: 'Georgia', color: C.violet, bold: true, align: 'center', margin: 0,
  });
  s.addText('본문이 살아 있는 것', {
    x: 5.2, y: 3.0, w: 4.3, h: 0.4,
    fontSize: 16, fontFace: 'Calibri', color: C.violet, align: 'center', margin: 0,
  });
  s.addText('정답: 아직 둘 다 아니다. 형태에 달렸다.', {
    x: 0.5, y: 4.6, w: 9, h: 0.35,
    fontSize: 15, fontFace: 'Calibri', color: C.inkSoft, italic: true, margin: 0,
  });
  footer(s, 15, TOTAL);
}

// ── 16 P3 NSSC ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s, C.violet);
  s.addText('③ AI 단축어 네 칸', {
    x: 0.5, y: 0.3, w: 9, h: 0.45,
    fontSize: 26, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const steps = [
    { k: '이름', d: 'parent-reply\n주간보고' },
    { k: '빈칸', d: '{학부모 요지}\n{기간}' },
    { k: '결과 모양', d: '공감 2문장\n+ 할 일 3개' },
    { k: '합격 기준', d: '비난 톤 없음\n숫자 1개' },
  ];
  steps.forEach((st, i) => {
    const x = 0.45 + i * 2.4;
    card(s, x, 1.2, 2.25, 2.4);
    s.addText(st.k, {
      x: x + 0.1, y: 1.7, w: 2.05, h: 0.55,
      fontSize: 18, fontFace: 'Consolas', color: C.violet, bold: true, align: 'center', margin: 0,
    });
    s.addText(st.d, {
      x: x + 0.15, y: 2.5, w: 1.95, h: 0.7,
      fontSize: 15, fontFace: 'Calibri', color: C.inkSoft, align: 'center', margin: 0,
    });
  });
  s.addText('두 번 비슷하게 쳤으면, 그 자리에서 이름 붙여라.', {
    x: 0.5, y: 4.0, w: 9, h: 0.45,
    fontSize: 16, fontFace: 'Georgia', color: C.violet, italic: true, margin: 0,
  });
  footer(s, 16, TOTAL);
}

// ── 17 Map 4-7 ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s);
  s.addText('④ ~ ⑦ 이름만 기억 (깊게 안 함)', {
    x: 0.5, y: 0.3, w: 9, h: 0.45,
    fontSize: 24, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const map = [
    { n: '④', t: '역할 쪽지', d: '“알아서 해줘” 금지 · 설계/실행/검사 · 하지 말 것' },
    { n: '⑤', t: '합격 기준 3개', d: '받기 전에: 형식·사실·의도 체크' },
    { n: '⑥', t: '센 한 줄', d: '영역 × 누구 × 제약 = 내가 제일 센 자리' },
    { n: '⑦', t: '팀 채널 한 장', d: '완성 기다리지 말고 올리고 “틀리면 알려주세요”' },
  ];
  map.forEach((m, i) => {
    const y = 1.0 + i * 0.95;
    card(s, 0.5, y, 9, 0.85);
    s.addText(m.n, {
      x: 0.75, y: y + 0.18, w: 0.8, h: 0.5,
      fontSize: 22, fontFace: 'Georgia', color: C.accent, bold: true, margin: 0,
    });
    s.addText(m.t, {
      x: 1.7, y: y + 0.15, w: 2.2, h: 0.55,
      fontSize: 18, fontFace: 'Calibri', color: C.ink, bold: true, valign: 'middle', margin: 0,
    });
    s.addText(m.d, {
      x: 4.0, y: y + 0.15, w: 5.2, h: 0.55,
      fontSize: 16, fontFace: 'Calibri', color: C.inkSoft, valign: 'middle', margin: 0,
    });
  });
  footer(s, 17, TOTAL);
}

// ── 18 7-day ─────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s, C.coral);
  s.addText('다음 7일 챌린지', {
    x: 0.5, y: 0.25, w: 9, h: 0.4,
    fontSize: 26, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const days = [
    ['D1', '입구 1 + 저장 위치 1', '①'],
    ['D2', '소비 1건 3줄로 닫기', '②'],
    ['D3', '요청에 이름 붙이기', '③'],
    ['D4', '하지 말 것 1줄', '④'],
    ['D5', '통과 기준 1줄', '⑤'],
    ['D6', '도메인 한 문장', '⑥'],
    ['D7', '1곳 공개 + 반박 초대', '⑦'],
  ];
  s.addTable(
    [
      [
        { text: 'Day', options: { fill: { color: C.ink }, color: C.white, bold: true } },
        { text: '할 일', options: { fill: { color: C.ink }, color: C.white, bold: true } },
        { text: '원칙', options: { fill: { color: C.ink }, color: C.white, bold: true } },
      ],
      ...days.map((row, i) =>
        row.map((cell) => ({
          text: cell,
          options: {
            fill: { color: i % 2 === 0 ? C.white : C.paperDeep },
            color: C.ink,
          },
        })),
      ),
    ],
    {
      x: 0.5, y: 0.85, w: 9, h: 3.9,
      colW: [1.2, 6.5, 1.3],
      border: { pt: 0.5, color: C.line },
      fontFace: 'Calibri',
      fontSize: 14,
      valign: 'middle',
    },
  );
  footer(s, 18, TOTAL);
}

// ── 19 Q&A ───────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s);
  s.addText('Q & A', {
    x: 0.5, y: 1.8, w: 9, h: 0.8,
    fontSize: 48, fontFace: 'Georgia', color: C.ink, bold: true, align: 'center', margin: 0,
  });
  s.addText('15:18 – 15:28', {
    x: 0.5, y: 2.8, w: 9, h: 0.4,
    fontSize: 18, fontFace: 'Calibri', color: C.muted, align: 'center', margin: 0,
  });
  footer(s, 19, TOTAL);
}

// ── 20 Closing ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.ink };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: C.accent }, line: { color: C.accent },
  });
  s.addText('한 줄 회수', {
    x: 0.7, y: 1.4, w: 8.5, h: 0.4,
    fontSize: 16, fontFace: 'Calibri', color: '5EEAD4', margin: 0,
  });
  s.addText('정보 문 하나 정하고,\n본 건 3줄 남기고,\nAI 말에 이름 붙이세요.', {
    x: 0.7, y: 1.9, w: 8.5, h: 1.6,
    fontSize: 26, fontFace: 'Georgia', color: C.white, bold: true, margin: 0,
  });
  s.addText('모델은 바뀝니다. 메모를 돌리는 사람이 이깁니다.', {
    x: 0.7, y: 3.7, w: 8.5, h: 0.4,
    fontSize: 16, fontFace: 'Calibri', color: '94A3B8', margin: 0,
  });
  s.addText('AMP 26기 여러분, 감사합니다.  ·  송세훈', {
    x: 0.7, y: 4.6, w: 8.5, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: '64748B', margin: 0,
  });
}

// ── 21 Links ─────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  sectionBar(s);
  s.addText('참고 · 링크', {
    x: 0.5, y: 0.35, w: 9, h: 0.45,
    fontSize: 26, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  s.addText([
    { text: '시연 앱  amp-tacit-practice.vercel.app', options: { breakLine: true } },
    { text: '데브로그  reasonofmoon.github.io', options: { breakLine: true } },
    { text: '대본  docs/AMP26_Lecture_Script.md', options: { breakLine: true } },
    { text: '런오브쇼  docs/AMP26_Run_of_Show.md', options: { breakLine: true } },
    { text: '워크시트  docs/AMP26_Seat_Worksheet.md', options: { breakLine: true } },
  ], {
    x: 0.7, y: 1.2, w: 8.5, h: 3.2,
    fontSize: 18, fontFace: 'Calibri', color: C.inkSoft, paraSpaceAfter: 14, margin: 0,
  });
  footer(s, 21, TOTAL);
}

await pres.writeFile({ fileName: outPath });
console.log('Wrote', outPath);
