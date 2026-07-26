/**
 * AMP 26 lecture slides — 2026-11-11
 * Run: node docs/build-amp26-slides.mjs
 */
import pptxgen from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, 'AMP26_Lecture_Slides.pptx');

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
  s.addText('암묵지를 시스템으로 만드는 90분', {
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
    { t: '도구 자랑이 아닙니다', d: '운영 방식 3가지를 손에 쥐고 나갑니다' },
    { t: '① ② ③ 을 깊게', d: '정보 흐름 · 산출물로 닫기 · 프롬프트 자산화' },
    { t: '④ ~ ⑦ 은 지도로', d: '하네스 · 검증 · 도메인 · 공개 — 이름과 한 문장' },
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
    { n: '01', c: C.accent, t: '뒤처지는 이유는 모델이 아닙니다', d: '정보가 안 흐르고, 안 닫히고, 절차가 안 되기 때문' },
    { n: '02', c: C.blue, t: '몸으로 아는 판단이 암묵지입니다', d: '원장·실무·기획 — 조직의 암묵지로 일반화' },
    { n: '03', c: C.violet, t: '증거는 루프입니다', d: '앱과 매일 돌아가는 시스템으로 증명' },
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
    { n: '①', t: '정보 흐름', deep: true },
    { n: '②', t: '산출물 닫기', deep: true },
    { n: '③', t: '절차 자산화', deep: true },
    { n: '④', t: '하네스', deep: false },
    { n: '⑤', t: '검증 루프', deep: false },
    { n: '⑥', t: '도메인 해자', deep: false },
    { n: '⑦', t: '공개 루프', deep: false },
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
  s.addText('정보가 나를 통해 흐르는\n시스템을 구축하라', {
    x: 0.7, y: 2.15, w: 8.5, h: 1.4,
    fontSize: 32, fontFace: 'Georgia', color: C.white, bold: true, margin: 0,
  });
  s.addText('14:14 – 14:28  ·  앱: dev_info_flow', {
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
  s.addText('많이 저장하면\n내 것이 된다', {
    x: 0.7, y: 2.2, w: 3.9, h: 1.2,
    fontSize: 22, fontFace: 'Georgia', color: C.coral, bold: true, align: 'center', margin: 0,
  });
  s.addText('고이기만 하면 창고', {
    x: 0.7, y: 3.6, w: 3.9, h: 0.4,
    fontSize: 15, fontFace: 'Calibri', color: C.muted, align: 'center', margin: 0,
  });
  card(s, 5.2, 1.2, 4.3, 3.2, 'ECFDF5');
  s.addText('✅', {
    x: 5.4, y: 1.5, w: 3.9, h: 0.5,
    fontSize: 28, align: 'center', margin: 0,
  });
  s.addText('흐르게 만들어야\n내 것이 된다', {
    x: 5.4, y: 2.2, w: 3.9, h: 1.2,
    fontSize: 22, fontFace: 'Georgia', color: C.accent, bold: true, align: 'center', margin: 0,
  });
  s.addText('자산은 순환에서 생긴다', {
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
  s.addText('① 정보 루프 4단계', {
    x: 0.5, y: 0.3, w: 9, h: 0.45,
    fontSize: 26, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const stages = [
    { n: '1', t: '수집', d: '어디에 들어오는가' },
    { n: '2', t: '정제', d: '무엇을 남기는가' },
    { n: '3', t: '저장', d: '다시 꺼낼 곳' },
    { n: '4', t: '재사용', d: '언제 다시 쓰는가' },
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
  s.addText('배운 것은 반드시\n산출물로 닫아라', {
    x: 0.7, y: 2.15, w: 8.5, h: 1.4,
    fontSize: 32, fontFace: 'Georgia', color: C.white, bold: true, margin: 0,
  });
  s.addText('14:28 – 14:41  ·  앱: dev_output_close', {
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
  s.addText('② 산출물 최소 계약', {
    x: 0.5, y: 0.3, w: 9, h: 0.45,
    fontSize: 26, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const contracts = [
    { n: '형태', d: '매번 같은 그릇에 담는다' },
    { n: '시한', d: '소비 후 24시간 이내 등' },
    { n: '크기 하한', d: '3줄이면 닫은 것으로 인정' },
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
  s.addText('프롬프트를 절차로 바꿔\n자산화하라', {
    x: 0.7, y: 2.15, w: 8.5, h: 1.4,
    fontSize: 32, fontFace: 'Georgia', color: C.white, bold: true, margin: 0,
  });
  s.addText('14:41 – 14:55  ·  앱: dev_prompt_asset', {
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
  s.addText('③ NAME → SLOT → SHAPE → CHECK', {
    x: 0.5, y: 0.3, w: 9, h: 0.45,
    fontSize: 24, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const steps = [
    { k: 'NAME', d: '이름을 붙인다' },
    { k: 'SLOT', d: '변하는 칸을 뚫는다' },
    { k: 'SHAPE', d: '출력 형태를 고정' },
    { k: 'CHECK', d: '성공 기준을 적는다' },
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
  s.addText('두 번 쓸 것 같으면, 그 자리에서 절차로 만들어라.', {
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
  s.addText('④ ~ ⑦ 지도로만', {
    x: 0.5, y: 0.3, w: 9, h: 0.45,
    fontSize: 26, fontFace: 'Georgia', color: C.ink, bold: true, margin: 0,
  });
  const map = [
    { n: '④', t: '하네스', d: '위임하지 말고 고삐를 쥔다' },
    { n: '⑤', t: '검증', d: '그럴듯함 말고 게이트' },
    { n: '⑥', t: '도메인', d: '좁고 깊게 소유한다' },
    { n: '⑦', t: '공개', d: '피드백을 복리로' },
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
  s.addText('흐르게 하고, 닫고, 절차로 만들고\n— 묶고, 검증하고, 좁히고, 연다.', {
    x: 0.7, y: 2.0, w: 8.5, h: 1.4,
    fontSize: 26, fontFace: 'Georgia', color: C.white, bold: true, margin: 0,
  });
  s.addText('모델은 바뀝니다. 루프의 주인은 여러분입니다.', {
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
