// 활동 완료 시점에 보낼 익명 통계 페이로드를 만든다.
// 이름·답변 원문·프로필 정보는 절대 포함하지 않는다.
// 각 활동별 필요한 *수치*만 추출해 서버에 송신.

function collectStrings(value, bucket) {
  if (!value) return;
  if (typeof value === 'string') {
    const t = value.trim();
    if (t) bucket.push(t);
    return;
  }
  if (Array.isArray(value)) value.forEach((v) => collectStrings(v, bucket));
  else if (typeof value === 'object') Object.values(value).forEach((v) => collectStrings(v, bucket));
}

function answerLengthStat(data) {
  const strings = [];
  collectStrings(data, strings);
  if (strings.length === 0) return null;
  const totalChars = strings.reduce((sum, s) => sum + s.length, 0);
  return {
    answerLengthMean: Math.round(totalChars / strings.length),
    answerCount: strings.length,
    totalChars,
  };
}

export function buildBenchmarkSnapshot(activityId, data) {
  if (!activityId || !data) return null;

  // Quiz: timing + accuracy
  if (activityId === 'quiz' || activityId === 'dev_quiz') {
    const correct = Number(data.correctCount ?? 0);
    const total = Number(data.responseDetails?.length ?? data.responses?.length ?? 0);
    if (total === 0) return null;
    return {
      activityId,
      timeSec: Number(data.totalTime ?? 0),
      accuracy: Number((correct / total).toFixed(2)),
    };
  }

  // Roleplay: score ratio + style label
  if (activityId === 'roleplay' || activityId === 'dev_roleplay') {
    const score = Number(data.totalScore ?? 0);
    const max = Number(data.maxScore ?? 0);
    if (max === 0) return null;
    return {
      activityId,
      scoreRatio: Number((score / max).toFixed(2)),
      styleTitle: typeof data.style?.title === 'string' ? data.style.title : null,
    };
  }

  // Crisis: answer length stat + completion count
  if (activityId === 'crisis' || activityId === 'dev_crisis') {
    const stat = answerLengthStat(data?.answers);
    if (!stat) return null;
    return {
      activityId,
      ...stat,
      completedScenarios: Number(data?.completedScenarios ?? 0),
    };
  }

  // Text-based answer activities
  const textBased = ['transfer', 'autopilot', 'noticing', 'cdm', 'pattern', 'gallery', 'seci', 'timeline'];
  const normalizedId = activityId.replace(/^dev_/, '');
  if (textBased.includes(normalizedId)) {
    const stat = answerLengthStat(data);
    if (!stat) return null;
    return { activityId, ...stat };
  }

  return null;
}
