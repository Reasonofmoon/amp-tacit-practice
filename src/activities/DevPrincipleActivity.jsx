import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ActivityFooter from '../components/ActivityFooter';
import {
  createPrincipleDefaultData,
  getPrincipleById,
  getPrincipleSpeakerNotes,
  isPrinciplePracticeReady,
  isPrincipleUnlocked,
} from '../data/developerPrinciples';

function mergeDefaults(id, data) {
  const defaults = createPrincipleDefaultData(id);
  return {
    ...defaults,
    ...data,
    loop: { ...defaults.loop, ...data?.loop },
    contract: { ...defaults.contract, ...data?.contract },
    checklist: { ...defaults.checklist, ...data?.checklist },
    promotion: { ...defaults.promotion, ...data?.promotion },
    storage: { ...defaults.storage, ...data?.storage },
    target: { ...defaults.target, ...data?.target },
    boundary: { ...defaults.boundary, ...data?.boundary },
    decomp: { ...defaults.decomp, ...data?.decomp },
    rubric: {
      format: { ...defaults.rubric?.format, ...data?.rubric?.format },
      fact: { ...defaults.rubric?.fact, ...data?.rubric?.fact },
      intent: { ...defaults.rubric?.intent, ...data?.rubric?.intent },
    },
    log: {
      ...defaults.log,
      ...data?.log,
      fields: { ...defaults.log?.fields, ...data?.log?.fields },
    },
    probes: { ...defaults.probes, ...data?.probes },
    narrowing: { ...defaults.narrowing, ...data?.narrowing },
    selfTest: { ...defaults.selfTest, ...data?.selfTest },
    plan: { ...defaults.plan, ...data?.plan },
    levers: { ...defaults.levers, ...data?.levers },
    ship: { ...defaults.ship, ...data?.ship },
    weekPlan: { ...defaults.weekPlan, ...data?.weekPlan },
    auditRows: data?.auditRows ?? defaults.auditRows,
    roles: data?.roles ?? defaults.roles,
    steps: data?.steps ?? defaults.steps,
    retry: data?.retry ?? defaults.retry,
  };
}

function SpeakerNotesPanel({ principleId, color, defaultOpen = false }) {
  const notes = getPrincipleSpeakerNotes(principleId);
  const [open, setOpen] = useState(defaultOpen);
  if (!notes.length) return null;
  return (
    <div className="card speaker-notes-panel" style={{ padding: '14px 16px', border: `1px dashed ${color}55` }}>
      <button
        type="button"
        className="speaker-notes-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>🎤 발표 멘트 / 강연자 노트</span>
        <span aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ul className="speaker-notes-list">
          {notes.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      <p className="speaker-notes-hint">
        {defaultOpen
          ? '발표 모드: 강연자 노트가 기본으로 펼쳐져 있습니다.'
          : '수강생 워크시트가 아닙니다. 발표자만 펼치세요.'}
      </p>
    </div>
  );
}

function ExplainPanel({ principle, presenterMode = false }) {
  const { explain, myth, contrast, liveExamples } = principle;
  const examples = liveExamples ?? (principle.liveExample ? [principle.liveExample] : []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SpeakerNotesPanel
        principleId={principle.id}
        color={principle.color}
        defaultOpen={presenterMode}
      />

      <div className="card" style={{ padding: '20px', borderLeft: `4px solid ${principle.color}` }}>
        <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.65 }}>{explain.hook}</p>
      </div>

      {myth && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>오해 깨기</h3>
          <p style={{ margin: '0 0 8px', color: '#b91c1c' }}>❌ {myth.wrong}</p>
          <p style={{ margin: 0, color: '#047857' }}>✅ {myth.right}</p>
        </div>
      )}

      {contrast && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>핵심 대비</h3>
          <div className="dev-contrast-table">
            <div className="dev-contrast-head">
              <span>{contrast.left}</span>
              <span>{contrast.right}</span>
            </div>
            {contrast.rows.map(([left, right]) => (
              <div key={`${left}-${right}`} className="dev-contrast-row">
                <span>{left}</span>
                <span>{right}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '20px', background: 'rgba(14, 165, 233, 0.06)' }}>
        <h3 style={{ marginTop: 0 }}>원칙</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>{explain.principle}</p>
      </div>

      {explain.stages?.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>프레임</h3>
          <div className="dev-flow-stages">
            {explain.stages.map((stage, index) => (
              <div key={stage.key} className="dev-flow-stage">
                <span className="dev-flow-stage-n">{index + 1}</span>
                <div>
                  <strong>{stage.label}</strong>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {explain.problem?.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>왜 막히는가</h3>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.75 }}>
            {explain.problem.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {explain.antiPatterns?.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>피해야 할 함정</h3>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.75 }}>
            {explain.antiPatterns.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {examples.map((ex) => (
        <div
          key={ex.url}
          className="card"
          style={{ padding: '20px', border: '1px dashed rgba(14, 165, 233, 0.45)' }}
        >
          <h3 style={{ marginTop: 0 }}>{ex.label}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.65 }}>{ex.blurb}</p>
          <a
            href={ex.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ display: 'inline-flex' }}
          >
            라이브 링크 열기 →
          </a>
        </div>
      ))}

      <div className="card" style={{ padding: '16px 20px', background: 'var(--bg-app)' }}>
        <strong>한 줄 정리</strong>
        <p style={{ margin: '8px 0 0', lineHeight: 1.65 }}>{explain.takeaway}</p>
      </div>
    </div>
  );
}

function PracticeInfoFlow({ draft, setDraft, persist }) {
  const loop = draft.loop ?? {};
  const setLoop = (key, value) => {
    const next = { ...draft, loop: { ...loop, [key]: value } };
    setDraft(next);
    persist(next);
  };
  const setField = (key, value) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    persist(next);
  };
  return (
    <>
      <FieldCard label="정보 입구 3개" value={draft.sources} onChange={(v) => setField('sources', v)} rows={3} />
      <FieldCard label="병목" value={draft.bottlenecks} onChange={(v) => setField('bottlenecks', v)} rows={2} />
      {['collect', 'refine', 'store', 'reuse'].map((key) => (
        <FieldCard
          key={key}
          label={key}
          value={loop[key] ?? ''}
          onChange={(v) => setLoop(key, v)}
          single
        />
      ))}
      <FieldCard label="주간 리듬" value={draft.weeklyCadence} onChange={(v) => setField('weeklyCadence', v)} single />
    </>
  );
}

function PracticeOutputClose({ draft, setDraft, persist }) {
  const rows = draft.auditRows ?? [];
  const updateRow = (index, patch) => {
    const nextRows = rows.map((row, i) => (i === index ? { ...row, ...patch } : row));
    const next = { ...draft, auditRows: nextRows };
    setDraft(next);
    persist(next);
  };
  const setContract = (key, value) => {
    const next = { ...draft, contract: { ...draft.contract, [key]: value } };
    setDraft(next);
    persist(next);
  };
  const setCheck = (key, value) => {
    const next = { ...draft, checklist: { ...draft.checklist, [key]: value } };
    setDraft(next);
    persist(next);
  };
  return (
    <>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>Part A. 열린 루프 감사</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          최근 7일 소비 3개. 남은 흔적에 못 쓰면 그게 정답입니다.
        </p>
        {rows.map((row, index) => (
          <div key={`audit-${index}`} className="dev-mini-grid" style={{ marginBottom: '12px' }}>
            <input
              placeholder={`소비 ${index + 1}`}
              value={row.item}
              onChange={(e) => updateRow(index, { item: e.target.value })}
            />
            <input
              placeholder="언제"
              value={row.when}
              onChange={(e) => updateRow(index, { when: e.target.value })}
            />
            <input
              placeholder="남은 흔적"
              value={row.trace}
              onChange={(e) => updateRow(index, { trace: e.target.value })}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="checkbox"
                checked={Boolean(row.closed)}
                onChange={(e) => updateRow(index, { closed: e.target.checked })}
              />
              닫힘
            </label>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>Part B. 산출물 최소 계약</h3>
        <FieldCard
          label="형태: 무엇을 소비하면 어떤 산출물?"
          value={draft.contract?.form}
          onChange={(v) => setContract('form', v)}
          placeholder="유튜브 → 제목·핵심 3줄·반론 1줄 노트"
        />
        <FieldCard
          label="시한: 소비 후 몇 시간 이내?"
          value={draft.contract?.deadline}
          onChange={(v) => setContract('deadline', v)}
          single
          placeholder="24"
        />
        <FieldCard
          label="크기 하한"
          value={draft.contract?.minSize}
          onChange={(v) => setContract('minSize', v)}
          single
          placeholder="핵심 3줄"
        />
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>Part C. 즉시 실행</h3>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={Boolean(draft.checklist?.closedOne)}
            onChange={(e) => setCheck('closedOne', e.target.checked)}
          />
          Part A 중 1개를 지금 닫았다
        </label>
        <FieldCard
          label="저장 위치"
          value={draft.checklist?.storePath}
          onChange={(v) => setCheck('storePath', v)}
          single
        />
        <FieldCard
          label="다음 7일 닫기 목표 개수"
          value={draft.checklist?.weeklyGoal}
          onChange={(v) => setCheck('weeklyGoal', v)}
          single
        />
      </div>
    </>
  );
}

function PracticePromptAsset({ draft, setDraft, persist }) {
  const set = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    persist(next);
  };
  const setPromo = (key, value) => set({ promotion: { ...draft.promotion, [key]: value } });
  const setStorage = (key, value) => set({ storage: { ...draft.storage, [key]: value } });
  return (
    <>
      <FieldCard
        label="두 번 이상 쓴 요청 (한 문장)"
        value={draft.candidate}
        onChange={(v) => set({ candidate: v })}
      />
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>NAME → SLOT → SHAPE → CHECK</h3>
        <FieldCard label="NAME (kebab-case)" value={draft.promotion?.name} onChange={(v) => setPromo('name', v)} single placeholder="weekly-report-writer" />
        <FieldCard label="SLOT 변수" value={draft.promotion?.slots} onChange={(v) => setPromo('slots', v)} single placeholder="{기간} {대상} {강조}" />
        <FieldCard label="SHAPE" value={draft.promotion?.shape} onChange={(v) => setPromo('shape', v)} rows={2} />
        <FieldCard label="CHECK (줄바꿈으로 2~3개)" value={draft.promotion?.check} onChange={(v) => setPromo('check', v)} rows={3} />
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>저장</h3>
        <label style={{ display: 'block', marginBottom: 8 }}>
          위치
          <select
            value={draft.storage?.location ?? ''}
            onChange={(e) => setStorage('location', e.target.value)}
            style={{ width: '100%', marginTop: 6, padding: '10px 12px' }}
          >
            <option value="">선택</option>
            <option value="프롬프트 노트">프롬프트 노트</option>
            <option value="스킬 파일">스킬 파일</option>
            <option value="스니펫 도구">스니펫 도구</option>
            <option value="기타">기타</option>
          </select>
        </label>
        <FieldCard label="검색 키워드" value={draft.storage?.keyword} onChange={(v) => setStorage('keyword', v)} single />
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={Boolean(draft.executed)} onChange={(e) => set({ executed: e.target.checked })} />
          완성 절차를 1회 실행해 봤다
        </label>
      </div>
    </>
  );
}

function PracticeHarness({ draft, setDraft, persist }) {
  const set = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    persist(next);
  };
  return (
    <>
      <FieldCard label="3단계 이상으로 쪼개지는 반복 업무" value={draft.target?.task} onChange={(v) => set({ target: { ...draft.target, task: v } })} />
      <FieldCard label="최종 산출물" value={draft.target?.output} onChange={(v) => set({ target: { ...draft.target, output: v } })} single />
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>역할 분할</h3>
        {(draft.roles ?? []).map((role, index) => (
          <div key={role.role} className="dev-mini-grid" style={{ marginBottom: 10 }}>
            <strong>{role.role}</strong>
            <input
              placeholder="하는 일"
              value={role.does}
              onChange={(e) => {
                const roles = draft.roles.map((r, i) => (i === index ? { ...r, does: e.target.value } : r));
                set({ roles });
              }}
            />
            <input
              placeholder="산출"
              value={role.produces}
              onChange={(e) => {
                const roles = draft.roles.map((r, i) => (i === index ? { ...r, produces: e.target.value } : r));
                set({ roles });
              }}
            />
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>절차 배선 (최소 3단계)</h3>
        {(draft.steps ?? []).map((step, index) => (
          <div key={`step-${index}`} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px dashed var(--paper-300)' }}>
            <FieldCard label={`단계 ${index + 1} 이름`} value={step.name} onChange={(v) => {
              const steps = draft.steps.map((s, i) => (i === index ? { ...s, name: v } : s));
              set({ steps });
            }} single />
            <FieldCard label="쓰는 절차" value={step.procedure} onChange={(v) => {
              const steps = draft.steps.map((s, i) => (i === index ? { ...s, procedure: v } : s));
              set({ steps });
            }} single />
            <FieldCard label="완료 조건" value={step.doneWhen} onChange={(v) => {
              const steps = draft.steps.map((s, i) => (i === index ? { ...s, doneWhen: v } : s));
              set({ steps });
            }} single />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => set({ steps: [...(draft.steps ?? []), { name: '', procedure: '', doneWhen: '' }] })}
        >
          + 단계 추가
        </button>
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>경계 선언 (필수)</h3>
        <FieldCard label="하지 않을 것 1" value={draft.boundary?.never1} onChange={(v) => set({ boundary: { ...draft.boundary, never1: v } })} single />
        <FieldCard label="하지 않을 것 2" value={draft.boundary?.never2} onChange={(v) => set({ boundary: { ...draft.boundary, never2: v } })} single />
        <FieldCard label="사람이 반드시 개입하는 지점" value={draft.boundary?.humanGate} onChange={(v) => set({ boundary: { ...draft.boundary, humanGate: v } })} single />
      </div>
    </>
  );
}

function PracticeVerify({ draft, setDraft, persist, harnessHint }) {
  const set = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    persist(next);
  };
  return (
    <>
      {harnessHint && (
        <div className="card" style={{ padding: '12px 16px', background: 'rgba(236, 72, 153, 0.08)' }}>
          <strong>④ 하네스에서 불러온 힌트</strong>
          <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{harnessHint}</p>
        </div>
      )}
      <FieldCard label="게이트를 달 단계" value={draft.target?.step} onChange={(v) => set({ target: { ...draft.target, step: v } })} single />
      <FieldCard label="가장 흔한 실패 모양" value={draft.target?.failureMode} onChange={(v) => set({ target: { ...draft.target, failureMode: v } })} />
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>RUBRIC 3층</h3>
        {['format', 'fact', 'intent'].map((layer) => (
          <div key={layer} style={{ marginBottom: 10 }}>
            <FieldCard
              label={`${layer} 항목`}
              value={draft.rubric?.[layer]?.item}
              onChange={(v) => set({
                rubric: {
                  ...draft.rubric,
                  [layer]: { ...draft.rubric?.[layer], item: v },
                },
              })}
              single
            />
            <FieldCard
              label="통과 판정 방법"
              value={draft.rubric?.[layer]?.how}
              onChange={(v) => set({
                rubric: {
                  ...draft.rubric,
                  [layer]: { ...draft.rubric?.[layer], how: v },
                },
              })}
              single
            />
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>GATE</h3>
        <FieldCard label="합격: N개 중 M개 (예: 3 중 2)" value={draft.gate?.passCount} onChange={(v) => set({ gate: { ...draft.gate, passCount: v } })} single />
        <FieldCard label="절대 탈락 조건" value={draft.gate?.hardFail} onChange={(v) => set({ gate: { ...draft.gate, hardFail: v } })} />
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>RETRY (구조적 수정만)</h3>
        {(draft.retry ?? []).map((row, index) => (
          <div key={row.kind} style={{ marginBottom: 10 }}>
            <strong>{row.kind}</strong>
            <FieldCard
              label="무엇을 바꾸나"
              value={row.change}
              onChange={(v) => {
                const retry = draft.retry.map((r, i) => (i === index ? { ...r, change: v } : r));
                set({ retry });
              }}
            />
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>LOG</h3>
        <FieldCard label="기록 위치" value={draft.log?.path} onChange={(v) => set({ log: { ...draft.log, path: v } })} single />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '8px 0' }}>
          {[
            ['input', '입력'],
            ['broken', '깨진 항목'],
            ['changed', '바꾼 것'],
            ['result', '결과'],
          ].map(([key, label]) => (
            <label key={key} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={Boolean(draft.log?.fields?.[key])}
                onChange={(e) => set({
                  log: {
                    ...draft.log,
                    fields: { ...draft.log?.fields, [key]: e.target.checked },
                  },
                })}
              />
              {label}
            </label>
          ))}
        </div>
        <FieldCard label="언제 다시 읽나" value={draft.log?.when} onChange={(v) => set({ log: { ...draft.log, when: v } })} single />
      </div>
    </>
  );
}

function PracticeDomain({ draft, setDraft, persist }) {
  const set = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    persist(next);
  };
  const composed = [draft.narrowing?.field, draft.narrowing?.audience, draft.narrowing?.constraint]
    .filter(Boolean)
    .join(' × ');
  return (
    <>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>4탐침 (최소 2개)</h3>
        {[
          ['wrongness', '오답 감각'],
          ['privateData', '비공개 데이터'],
          ['reps', '반복 노출'],
          ['bilingual', '용어 번역력'],
        ].map(([key, label]) => (
          <FieldCard
            key={key}
            label={label}
            value={draft.probes?.[key]}
            onChange={(v) => set({ probes: { ...draft.probes, [key]: v } })}
          />
        ))}
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>좁힘 공식</h3>
        <FieldCard label="일반 영역" value={draft.narrowing?.field} onChange={(v) => set({ narrowing: { ...draft.narrowing, field: v } })} single />
        <FieldCard label="특정 대상" value={draft.narrowing?.audience} onChange={(v) => set({ narrowing: { ...draft.narrowing, audience: v } })} single />
        <FieldCard label="특정 제약" value={draft.narrowing?.constraint} onChange={(v) => set({ narrowing: { ...draft.narrowing, constraint: v } })} single />
        {composed && (
          <p style={{ marginTop: 8 }}>
            <strong>= </strong>
            {composed}
          </p>
        )}
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>대체 가능성 자가 테스트</h3>
        {[
          ['q1', 'AI가 그럴듯한 답을 내는가?'],
          ['q2', '틀린 지점을 내가 지목할 수 있는가?'],
          ['q3', '뒷받침 기록이 있는가?'],
        ].map(([key, label]) => (
          <div key={key} style={{ marginBottom: 10 }}>
            <span style={{ display: 'block', marginBottom: 4 }}>{label}</span>
            <label style={{ marginRight: 12 }}>
              <input
                type="radio"
                name={key}
                checked={draft.selfTest?.[key] === true}
                onChange={() => set({ selfTest: { ...draft.selfTest, [key]: true } })}
              />
              {' '}예
            </label>
            <label>
              <input
                type="radio"
                name={key}
                checked={draft.selfTest?.[key] === false}
                onChange={() => set({ selfTest: { ...draft.selfTest, [key]: false } })}
              />
              {' '}아니오
            </label>
          </div>
        ))}
      </div>
      <FieldCard label="90일 산출물 형태" value={draft.plan?.form} onChange={(v) => set({ plan: { ...draft.plan, form: v } })} single />
      <FieldCard label="주당 건수" value={draft.plan?.perWeek} onChange={(v) => set({ plan: { ...draft.plan, perWeek: v } })} single />
    </>
  );
}

function PracticePublic({ draft, setDraft, persist, inventory }) {
  const set = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    persist(next);
  };
  const weekLabels = [
    ['w1', '1주차'],
    ['w2', '2주차'],
    ['w3', '3주차'],
    ['w4', '4주차'],
    ['w5', '5주차'],
    ['w6', '6주차'],
    ['w7', '7주차'],
  ];
  return (
    <>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>Part A. 자산 인벤토리</h3>
        <ul style={{ margin: '0 0 12px', paddingLeft: '1.1rem' }}>
          {inventory.map((item) => (
            <li key={item.id}>
              {item.label}
              {item.done ? ' ✅' : ' · 미완료'}
            </li>
          ))}
        </ul>
        <FieldCard
          label="가장 먼저 공개할 것"
          value={draft.firstPublic}
          onChange={(v) => set({ firstPublic: v })}
          single
          placeholder="예: 원칙 #2 계약서 / 도메인 좌표"
        />
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>Part B. 3레버</h3>
        <label style={{ display: 'block', marginBottom: 8 }}>
          발행 주기
          <select
            value={draft.levers?.cadence ?? ''}
            onChange={(e) => set({ levers: { ...draft.levers, cadence: e.target.value } })}
            style={{ width: '100%', marginTop: 6, padding: '10px 12px' }}
          >
            <option value="">선택</option>
            <option value="주 1회">주 1회</option>
            <option value="주 2회">주 2회</option>
            <option value="격주">격주</option>
            <option value="월 1회">월 1회</option>
          </select>
        </label>
        <FieldCard
          label="첫 발행일"
          value={draft.levers?.firstDate}
          onChange={(v) => set({ levers: { ...draft.levers, firstDate: v } })}
          single
          placeholder="YYYY-MM-DD 또는 이번 주 금요일"
        />
        <label style={{ display: 'block', marginBottom: 8 }}>
          접근 경로
          <select
            value={draft.levers?.channel ?? ''}
            onChange={(e) => set({ levers: { ...draft.levers, channel: e.target.value } })}
            style={{ width: '100%', marginTop: 6, padding: '10px 12px' }}
          >
            <option value="">선택</option>
            <option value="GitHub Pages">GitHub Pages</option>
            <option value="노션 공개">노션 공개</option>
            <option value="팀 채널">팀 채널</option>
            <option value="뉴스레터">뉴스레터</option>
            <option value="기타">기타</option>
          </select>
        </label>
        <FieldCard label="URL / 채널 이름" value={draft.levers?.url} onChange={(v) => set({ levers: { ...draft.levers, url: v } })} single />
        <FieldCard label="반박 초대 한 문장" value={draft.levers?.invite} onChange={(v) => set({ levers: { ...draft.levers, invite: v } })} rows={2} />
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>Part C. 최소 단위 실행</h3>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={Boolean(draft.ship?.posted)}
            onChange={(e) => set({ ship: { ...draft.ship, posted: e.target.checked } })}
          />
          고른 자산을 지금 1곳에 올렸다
        </label>
        <FieldCard
          label="올린 곳 URL / 위치"
          value={draft.ship?.where}
          onChange={(v) => set({ ship: { ...draft.ship, where: v } })}
          single
        />
        <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={Boolean(draft.ship?.inviteAttached)}
            onChange={(e) => set({ ship: { ...draft.ship, inviteAttached: e.target.checked } })}
          />
          반박 초대 문장을 함께 붙였다
        </label>
      </div>
      <div className="card" style={{ padding: '16px 20px' }}>
        <h3 style={{ marginTop: 0 }}>Part D. 7주 루프 예약</h3>
        {weekLabels.map(([key, label]) => (
          <FieldCard
            key={key}
            label={label}
            value={draft.weekPlan?.[key]}
            onChange={(v) => set({ weekPlan: { ...draft.weekPlan, [key]: v } })}
            single
          />
        ))}
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
          <input
            type="checkbox"
            checked={Boolean(draft.weekPlan?.calendarRegistered)}
            onChange={(e) => set({ weekPlan: { ...draft.weekPlan, calendarRegistered: e.target.checked } })}
          />
          캘린더/리마인더에 실제로 등록했다
        </label>
      </div>
    </>
  );
}

function FieldCard({ label, value, onChange, rows = 3, single = false, placeholder }) {
  return (
    <label className="card" style={{ padding: '12px 16px', display: 'block', marginBottom: 10 }}>
      <span style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</span>
      {single ? (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', padding: '10px 12px' }}
        />
      ) : (
        <textarea
          rows={rows}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%' }}
        />
      )}
    </label>
  );
}

export default function DevPrincipleActivity({
  id,
  data,
  saveData,
  complete,
  onBack,
  state,
  presenterMode = false,
}) {
  const principleId = id?.startsWith('dev_') ? id : 'dev_info_flow';
  const principle = getPrincipleById(principleId);
  const [draft, setDraft] = useState(() => mergeDefaults(principleId, data));
  const [step, setStep] = useState(data?.step === 'practice' ? 'practice' : 'explain');

  const practiceReady = useMemo(
    () => isPrinciplePracticeReady(principleId, draft),
    [principleId, draft],
  );

  const unlocked = isPrincipleUnlocked(principleId, state?.completed ?? [], { presenterMode });

  if (!principle) {
    return (
      <div className="activity-workspace">
        <p>원칙 콘텐츠를 찾을 수 없습니다.</p>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="activity-workspace">
        <header className="workspace-header">
          <div>
            <h2 className="question-title" style={{ marginBottom: 0 }}>🔒 아직 잠긴 원칙입니다</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
              이전 원칙을 완료한 뒤 다시 열어 주세요. ①→⑦ 순서로 잠금이 풀립니다.
              키노트 중에는 상단 <strong>발표</strong> 토글로 잠금을 해제할 수 있습니다.
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
        </header>
      </div>
    );
  }

  const persist = (next) => {
    const payload = { ...next, step };
    saveData(payload);
    return payload;
  };

  const goPractice = () => {
    const next = { ...draft, step: 'practice', explainRead: true };
    setDraft(next);
    setStep('practice');
    saveData(next);
  };

  const harnessSteps = state?.activityData?.dev_harness_design?.steps ?? [];
  const harnessHint = harnessSteps
    .filter((s) => s?.name)
    .map((s) => s.name)
    .join(' → ');

  const inventory = [
    'dev_info_flow',
    'dev_output_close',
    'dev_prompt_asset',
    'dev_harness_design',
    'dev_verify_loop',
    'dev_domain_moat',
  ].map((pid) => ({
    id: pid,
    label: getPrincipleById(pid)?.shortTitle ?? pid,
    done: state?.completed?.includes(pid),
  }));

  const kind = principle.practice?.kind;
  const autofill = () => {
    let next = { ...draft };
    switch (kind) {
      case 'info_flow':
        next = {
          ...next,
          sources: 'AI 뉴스레터, GitHub Releases, 팀 Discord',
          bottlenecks: '저장은 하는데 주간 리뷰 없음',
          loop: {
            collect: 'RSS 아침 인박스',
            refine: '제품에 쓸 수 있나?',
            store: 'Obsidian AI-Inbox',
            reuse: '금 20분 리뷰',
          },
          weeklyCadence: '매일 10분 / 금 20분',
        };
        break;
      case 'output_close':
        next = {
          ...next,
          auditRows: [
            { item: '유튜브 에이전트 영상', when: '어제', trace: '없음', closed: false },
            { item: '뉴스레터 3통', when: '그제', trace: '하이라이트만', closed: false },
            { item: '팀 위클리', when: '월', trace: '회의록', closed: true },
          ],
          contract: { form: '영상→3줄 노트', deadline: '24시간', minSize: '핵심 3줄' },
          checklist: { closedOne: true, storePath: 'Obsidian/Inbox', weeklyGoal: '5' },
        };
        break;
      case 'prompt_asset':
        next = {
          ...next,
          candidate: '주간 업무 요약 부탁',
          promotion: {
            name: 'weekly-report-writer',
            slots: '{기간} {독자} {강조}',
            shape: 'H2 3개 / 불릿 3 / 400자',
            check: '수치 포함\n사내 용어 유지',
          },
          storage: { location: '스킬 파일', keyword: 'weekly-report' },
          executed: true,
        };
        break;
      case 'harness_design':
        next = {
          ...next,
          target: { task: '주간 AI 뉴스 브리핑', output: '발행 포스트 1건' },
          roles: [
            { role: '설계자', does: '토픽 선정', produces: '토픽 리스트' },
            { role: '실행자', does: '초안 작성', produces: '마크다운' },
            { role: '검사자', does: '출처·톤 검증', produces: '체크 결과' },
          ],
          steps: [
            { name: '수집', procedure: 'RSS', doneWhen: '10건' },
            { name: '큐레이션', procedure: '3건 선정', doneWhen: '선정표' },
            { name: '발행', procedure: 'Hexo', doneWhen: 'URL' },
          ],
          boundary: { never1: '미검증 출처 단정', never2: '자동 배포 금지', humanGate: '최종 발행 승인' },
        };
        break;
      case 'verify_loop':
        next = {
          ...next,
          target: { step: '큐레이션', failureMode: '출처 없는 수치' },
          rubric: {
            format: { item: '3건 표', how: '열 수 확인' },
            fact: { item: '출처 링크', how: 'URL 존재' },
            intent: { item: '독자 액션', how: '할 일 1개' },
          },
          gate: { passCount: '3중 2', hardFail: '출처 0' },
          retry: [
            { kind: '형식 깨짐', change: '표 템플릿 강제', max: '2' },
            { kind: '사실 부족', change: '출처 단계 분리', max: '2' },
            { kind: '의도 이탈', change: '독자 페르소나 재주입', max: '1' },
          ],
          log: {
            path: 'Obsidian/verify-log',
            fields: { input: true, broken: true, changed: true, result: true },
            when: '매주 금요일',
          },
        };
        break;
      case 'domain_moat':
        next = {
          ...next,
          probes: {
            wrongness: '입시 개편 해석이 피상적일 때',
            privateData: '상담 실패 로그',
            reps: '학부모 상담 200+',
            bilingual: '제도 용어 ↔ 학부모 말',
          },
          narrowing: { field: '교육', audience: '고1 학부모', constraint: '2028 개편 이후' },
          selfTest: { q1: true, q2: true, q3: true },
          plan: { form: '입시뉴스 주 3건', perWeek: '3', renewContract: true },
        };
        break;
      case 'public_loop':
        next = {
          ...next,
          firstPublic: '도메인 좌표 + 계약서',
          levers: {
            cadence: '주 1회',
            firstDate: '이번 주 금요일',
            channel: '팀 채널',
            url: '#general',
            invite: '틀린 부분이 보이면 알려주세요. 고쳐서 다시 올리겠습니다.',
          },
          ship: {
            posted: true,
            where: '팀 채널 #ai-lab',
            inviteAttached: true,
            nextDate: '다음 주 금',
          },
          weekPlan: {
            w1: '정보 흐름 맵',
            w2: '산출물 계약',
            w3: '절차 1개',
            w4: '하네스 설계도',
            w5: '검증 루브릭',
            w6: '도메인 좌표',
            w7: '회고 — 6주간 무엇이 깨졌는가',
            calendarRegistered: true,
          },
        };
        break;
      default:
        break;
    }
    setDraft(next);
    persist(next);
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: principle.color }}>
            {principle.tag} · AI 시대 생존
          </span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>
            {principle.icon} {principle.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '54ch' }}>
            {principle.subtitle}
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="dev-principle-tabs" role="tablist" aria-label="설명과 실습">
        <button
          type="button"
          role="tab"
          aria-selected={step === 'explain'}
          className={`dev-principle-tab ${step === 'explain' ? 'active' : ''}`}
          onClick={() => {
            setStep('explain');
            const next = { ...draft, step: 'explain' };
            setDraft(next);
            saveData(next);
          }}
        >
          1. 설명
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={step === 'practice'}
          className={`dev-principle-tab ${step === 'practice' ? 'active' : ''}`}
          onClick={goPractice}
        >
          2. 실습
        </button>
      </div>

      <div className="workspace-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {step === 'explain' && (
          <motion.div key="explain" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ExplainPanel principle={principle} presenterMode={presenterMode} />
            <button
              type="button"
              className="btn btn-primary neon-btn"
              onClick={goPractice}
              style={{ width: '100%', marginTop: 16 }}
            >
              이해했어요 · 실습하기 →
            </button>
          </motion.div>
        )}

        {step === 'practice' && (
          <motion.div key="practice" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: '16px 20px' }}>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>{principle.practice?.intro}</p>
              <p style={{ margin: '10px 0 0', fontSize: '0.88rem', color: principle.color }}>
                {principle.practice?.completeHint}
              </p>
            </div>

            {kind === 'info_flow' && <PracticeInfoFlow draft={draft} setDraft={setDraft} persist={persist} />}
            {kind === 'output_close' && <PracticeOutputClose draft={draft} setDraft={setDraft} persist={persist} />}
            {kind === 'prompt_asset' && <PracticePromptAsset draft={draft} setDraft={setDraft} persist={persist} />}
            {kind === 'harness_design' && <PracticeHarness draft={draft} setDraft={setDraft} persist={persist} />}
            {kind === 'verify_loop' && (
              <PracticeVerify draft={draft} setDraft={setDraft} persist={persist} harnessHint={harnessHint} />
            )}
            {kind === 'domain_moat' && <PracticeDomain draft={draft} setDraft={setDraft} persist={persist} />}
            {kind === 'public_loop' && (
              <PracticePublic draft={draft} setDraft={setDraft} persist={persist} inventory={inventory} />
            )}

            {principle.debrief?.length > 0 && (
              <div className="card" style={{ padding: '16px 20px' }}>
                <h3 style={{ marginTop: 0 }}>디브리핑 힌트</h3>
                <ol style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                  {principle.debrief.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
              </div>
            )}

            <ActivityFooter
              placeholder="이 원칙을 내 주에 적용하면 무엇이 달라질까?"
              disableComplete={!practiceReady}
              onAutoFill={autofill}
              onSkip={() =>
                complete({
                  activityData: persist({ ...draft, insight: 'Skipped', finished: false }),
                  bonusXp: 0,
                })
              }
              onComplete={(insight) =>
                complete({
                  activityData: persist({
                    ...draft,
                    insight,
                    explainRead: true,
                    step: 'practice',
                    finished: true,
                  }),
                  bonusXp: practiceReady ? Math.round((principle.xp ?? 100) * 0.15) : 5,
                })
              }
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
