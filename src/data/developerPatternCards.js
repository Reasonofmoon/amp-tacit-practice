export const DEV_PATTERN_CARDS = [
  {
    situations: [
      { id: 's1', text: 'API에서 데이터를 가져와 안전하게 화면에 렌더링해야 함', icon: '🌐' },
      { id: 's2', text: '여러 개의 독립적인 비동기 요청을 동시에 빠르게 처리해야 함', icon: '⚡' },
      { id: 's3', text: '콜백 지옥(Callback Hell)에 빠져 가독성이 떨어진 레거시 코드', icon: '🍝' },
      { id: 's4', text: '스크롤/입력 등 DOM 이벤트가 너무 빈번하게 발생하여 성능 저하', icon: '📉' },
      { id: 's5', text: '기존 배열의 데이터를 가공하여 새로운 형태의 배열 생성', icon: '🔄' },
      { id: 's6', text: '전역 변수 오염을 막고 함수 내부의 상태를 안전하게 은닉', icon: '🔒' },
    ],
    responses: [
      { id: 'r1', text: 'async/await 패턴 적용 및 try-catch 에러 핸들링', icon: '🛡️' },
      { id: 'r2', text: 'Promise.all()을 활용한 병렬(Parallel) 처리', icon: '🏎️' },
      { id: 'r3', text: 'Promise 반환 또는 async 체이닝으로 로직 평탄화', icon: '📏' },
      { id: 'r4', text: '디바운싱(Debouncing) 또는 쓰로틀링(Throttling) 적용', icon: '⏳' },
      { id: 'r5', text: 'Array.prototype.map()과 불변성 파생 활용', icon: '✨' },
      { id: 'r6', text: '클로저(Closure) 또는 ES 모듈 시스템(IIFE) 패턴', icon: '📦' },
    ],
  },
];
