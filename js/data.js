/* ============================================================
   data.js — 콘텐츠 단일 출처 (S0 스키마 확정)
   ------------------------------------------------------------
   · 모든 텍스트/링크/에셋 경로는 여기서만 수정한다. (S7: 코드 수정 없이 교체)
   · placeholder: true  → 예시 데이터. 실데이터 수령 후 교체 대상.
   · verify: true       → 수치·사실 "확인 필요". UI에서 표시 가능(meta.showVerifyMarks).
   · status: "planning" → "기획 단계" 라벨로 표기.
   · 금융·자산 수치는 절대 넣지 않는다.
   ============================================================ */
window.portfolioData = {
  meta: {
    title: "Donghyun Lim — Portfolio for CAEST",
    description: "임동현의 스크롤리텔링 자기소개서. Craft × AI.",
    lang: "ko",
    target: "CAEST",
    showVerifyMarks: true,      // S7에서 false로 바꾸면 "확인 필요" 표시 일괄 숨김
    updated: "2026-11-16"
  },

  profile: {
    nameKo: "임동현",
    nameEn: "Donghyun Lim",
    nameLines: ["Donghyun", "Lim"],            // 히어로 키네틱 타이포 줄 단위
    roles: ["AI Startup Founder", "PM", "Creator"],
    tagline: "좋아하는 것을 잘하는 것으로, 시간으로 완성합니다.",   // placeholder
    affiliation: "충북대학교 화학과 · 2027 경영학과 전과 예정",
    location: "Cheongju, Korea",
    now: { label: "NOW", text: "AI 교육 서비스 창업 준비 중" },      // NOW 배지
    placeholder: true
  },

  nav: [
    { id: "about",   label: "About" },
    { id: "work",    label: "Work" },
    { id: "archive", label: "Archive" },
    { id: "stack",   label: "Stack" },
    { id: "contact", label: "Let's Talk" }
  ],

  slogan: {
    en: "Nothing beats what you love and do well — and time completes it.",
    enLines: ["Nothing beats what you love", "and do well —", "and time completes it."],
    ko: "그 어떤 것도 좋아하고 잘하는 것을 이길 수 없고, 시간이 그것을 완성시킨다",
    placements: ["hero", "interlude"]          // 히어로 하단 보조 + Work→Archive 사이 풀스크린
  },

  hero: {
    eyebrow: "Portfolio · 2026",
    /* 배경 슬라이드: 지금은 책·계획 노트 사진 1장만(2026-11-16). 여러 장을 넣으면 순서대로 교차 전환된다.
       position = 가로 화면에서 보여줄 지점(object-position), positionMobile = 세로 화면용 */
    slides: [
      {
        webp: "assets/img/study-notes.webp", webpSmall: "assets/img/study-notes-480.webp", smallWidth: 480,
        fallback: "assets/img/study-notes.jpg", width: 739, height: 1600,
        position: "50% 30%", positionMobile: "50% 50%",
        inset: "58%"                          // 사진을 화면 폭의 58%로 줄여 오른쪽에 배치(가로 화면만). 지우면 화면 가득
      }
    ],
    slideInterval: 6000,        // 한 장이 머무는 시간(ms)
    scrollHint: "Scroll"
  },

  about: {
    heading: "About",
    paragraphs: [                                             // placeholder 카피
      "화학을 전공하며 실험으로 가설을 검증하는 법을 배웠고, 지금은 그 방식으로 AI 서비스를 만듭니다.",
      "장인의 도시가 한계에서 가치를 만들어냈듯, 저는 AI라는 새 도구로 '잘 만드는 일'의 범위를 넓히는 데 관심이 있습니다.",
      "기획하고, 직접 만들고, 사람들 앞에서 설명하는 것까지가 제 일입니다."
    ],
    hook: { left: "Craft", right: "AI", note: "소재의 한계가 만든 명품의 가치 ↔ 도구의 확장이 만드는 새로운 가치" },
    bento: [   // 3카드(3대 500은 2026-11-16 회장님 요청으로 제외). 3장이면 한 줄, 4장이면 2×2. value가 숫자면 카운트업, 문자열이면 그대로 표시
      { id: "books",  label: "읽은 책",       value: 200, suffix: "+", unit: "권", icon: "book-open", accent: "gold" },   // 2026-11-13 본인 확인
      { id: "talk",   label: "대표 활동",     value: "대학생 대상 경제 강의", icon: "mic",      accent: "teal" },
      { id: "focus",  label: "지금 집중하는 것", value: "AI 교육 서비스",   icon: "sparkles", accent: "gold" }
    ],
    placeholder: true
  },

  work: {
    heading: "Work",
    intro: "기획부터 실행까지 직접 해본 일들.",                 // placeholder
    featuredVideo: {            // Work 하이라이트 카드 (세로 폰 프레임)
      title: "대학생 대상 경제 강의",
      role: "Speaker",
      period: "2026",
      description: "거시경제부터 역사, 투자 수단, 돈 공부와 자산 관리까지. 대학생이 돈의 흐름을 스스로 읽을 수 있도록 직접 만든 자료로 진행한 강의입니다.",
      sources: [
        { src: "assets/video/econ-lecture.webm", type: "video/webm" },
        { src: "assets/video/econ-lecture.mp4",  type: "video/mp4" }
      ],
      poster: { webp: "assets/video/econ-lecture-poster.webp", fallback: "assets/video/econ-lecture-poster.jpg" },
      width: 720, height: 1558, duration: 20.5,
      hasAudio: true,           // 자동재생은 muted, 탭하면 소리 on
      tags: ["Public Speaking", "Economics"]
    },
    timeline: [   // 최신순. 날짜-역할-설명-태그 카드
      {
        id: "caest", period: "2026.09 — 현재", title: "CÆst 1기 · AI 공부방 운영", role: "Lead",
        // 출처: 옵시디언 01_PROJECTS/CÆst 1기 (로드맵·교육자료·제작기록) + 회장님 설명(2026-11-16)
        description: "충북대에서 6명이 모여, AI에게 질문만 하는 사람에서 직접 만들어 내는 사람이 되는 것을 목표로 하는 Claude 공부 모임입니다. 커리큘럼 설계와 교육 자료 제작, 모임 운영을 맡고 있으며, 15주 과정 가운데 11주차까지 진행했습니다.",
        points: [   // 카드 안 활동 목록
          "Claude Code 활용법 공부: 프롬프트 기초부터 CLAUDE.md, 서브에이전트, 스킬·훅·MCP까지 이어지는 과정을 설계하고, 34쪽 분량의 에이전트 실무 가이드를 교육 자료로 만들었습니다.",
          "자동화 에이전트 제작: 반복 업무를 맡기는 전용 에이전트를 각자 설계해 보고, 역할을 나눈 에이전트 팀으로 묶어 운영하는 방법을 함께 익혔습니다.",
          "토큰 절약법 전파: 직접 공부해 정리한 토큰 절약법 20가지를 멤버들에게 알려 주고 각자의 작업 환경에 적용하게 했습니다.",
          "AI로 웹사이트 제작: 지금 보고 계신 이 자소서 웹페이지와, 3D 인터랙션이 들어간 모임 쇼케이스 사이트 1차 시안을 Claude Code로 만들었습니다.",
          "운영 체계 설계: 6명이 각자 역할을 나눠 맡고, Notion 공유 문서 하나로 같은 맥락을 쓰는 협업 방식을 만들었습니다."
        ],
        tags: ["Claude Code", "AI Agent", "Automation", "Community", "Leadership"], link: null,
        photos: [   // 카드 안에 나란히 들어가는 사진. position = 잘라낼 때 기준점
          { webp: "assets/img/ai-study-1.webp", webpSmall: "assets/img/ai-study-1-480.webp", fallback: "assets/img/ai-study-1.jpg",
            position: "50% 48%", alt: "카페 긴 테이블에 둘러앉아 각자 노트북으로 작업하는 공부 모임" },
          { webp: "assets/img/ai-study-2.webp", webpSmall: "assets/img/ai-study-2-480.webp", fallback: "assets/img/ai-study-2.jpg",
            position: "50% 30%", alt: "노트북 화면 옆에서 손으로 쓴 정리 노트를 사진으로 남기는 모습" }
        ]
      },
      {
        id: "econ-lecture", period: "2026", title: "대학생 대상 경제 강의", role: "Speaker",
        // 출처: 옵시디언 경제강의 폴더(강의 슬라이드 3종·1교시 원고) + 회장님 설명(2026-11-16)
        description: "대학생이 뉴스와 숫자를 보고 돈의 흐름을 스스로 읽을 수 있게 하는 것을 목표로, 직접 만든 슬라이드로 진행한 강의입니다. 지표 설명에서 끝내지 않고 '그래서 내 돈은 어떻게 해야 하는가'까지 이어지도록 구성했습니다.",
        points: [
          "거시경제: 금리와 FOMC, 양적긴축(QT), 장단기 금리차, CPI·PCE·PPI 같은 물가 지표로 시장의 사이클을 읽는 틀을 다뤘습니다.",
          "역사: 금리 역전 뒤에 찾아온 경기 침체, 화폐 가치가 흔들린 시기에 자산이 어떻게 움직였는지를 사례로 설명했습니다.",
          "세계 정세와 한국 경제: 에너지·환율·반도체 이슈가 한국 경제와 개인의 자산에 어떤 경로로 영향을 주는지 3교시 구성으로 풀었습니다.",
          "투자 수단 활용법: VIX·버핏 지수 같은 지표 읽는 법, 경기 사이클에 따른 섹터 흐름, 코어-위성 방식의 자산 배분을 소개했습니다.",
          "돈 공부와 자산 관리: 현금 비중과 부채 관리, 분산의 원칙처럼 사회 초년생이 바로 쓸 수 있는 기본기를 정리했습니다.",
          "사례로 설명하기: '소재의 한계가 만든 명품의 가치'처럼 익숙한 브랜드 이야기에서 경제 개념을 끌어내는 방식으로 진행했습니다."
        ],
        tags: ["Public Speaking", "Macro Economics", "Investing", "Storytelling"], link: null, featured: true
      },
      {
        id: "ai-instagram", period: "2026 — 현재", title: "AI 인스타그램 계정", role: "Creator",
        description: "AI 활용법을 숏폼 콘텐츠로 만들어 공유합니다.",
        tags: ["Content", "Short-form", "AI"], link: "https://www.instagram.com/hyuns_lim/", placeholder: true
      }
    ],
    showcase: [   // 가로 핀닝 쇼케이스. image가 null이면 타이포 카드로 렌더
      { id: "sc-lecture", title: "Economics Lecture", caption: "강연 현장", image: "assets/img/lecture-hall.webp", accent: "gold" },
      { id: "sc-caest",   title: "CÆst",             caption: "AI 공부방 운영", image: "assets/img/ai-study-1.webp", position: "50% 48%", accent: "teal" },
      { id: "sc-ai",      title: "AI Content",        caption: "AI 인스타 계정", image: null, accent: "teal",  placeholder: true }
    ]
  },

  archive: {
    heading: "Archive",
    intro: "기록으로 남긴 순간들.",                              // placeholder
    /* 패럴랙스 메이슨리(2단). ratio = 화면에 보이는 틀의 가로/세로(원본과 다르면 position 기준으로 잘림),
       speed = 패럴랙스 계수(1 = 고정, 1보다 크면 빠르게), image: null이면 "사진 추가 예정" 자리 */
    items: [
      {
        id: "ar-lecture", caption: "경제 강의 · 강연장", year: "2026",
        image: { webp: "assets/img/lecture-hall.webp", webpSmall: "assets/img/lecture-hall-600.webp", fallback: "assets/img/lecture-hall.jpg" },
        ratio: 0.75, speed: 0.9, alt: "강의실에서 마이크를 들고 강연하는 모습과 청중"
      },
      {
        id: "ar-study-1", caption: "CÆst · AI 공부방", year: "2026",
        image: { webp: "assets/img/ai-study-1.webp", webpSmall: "assets/img/ai-study-1-480.webp", fallback: "assets/img/ai-study-1.jpg" },
        ratio: 0.7, speed: 1.12, position: "50% 48%", alt: "카페 긴 테이블에 둘러앉아 각자 노트북으로 작업하는 공부 모임"
      },
      {
        id: "ar-notes", caption: "독서와 계획 노트", year: "2026",
        image: { webp: "assets/img/study-notes.webp", webpSmall: "assets/img/study-notes-480.webp", fallback: "assets/img/study-notes.jpg" },
        ratio: 0.62, speed: 0.88, position: "50% 40%", alt: "책 두 권과 손글씨 계획표가 띄워진 태블릿"
      },
      {
        id: "ar-study-2", caption: "CÆst · 기록", year: "2026",
        image: { webp: "assets/img/ai-study-2.webp", webpSmall: "assets/img/ai-study-2-480.webp", fallback: "assets/img/ai-study-2.jpg" },
        ratio: 0.8, speed: 1.0, position: "50% 30%", alt: "노트북 화면 옆에서 손으로 쓴 정리 노트를 사진으로 남기는 모습"
      }
    ]
  },

  stack: {
    heading: "Stack",
    rows: [   // 무한 마키. 줄마다 방향 반대
      { direction: "left",  items: ["Claude Code", "Anthropic API", "n8n", "Notion", "Midjourney"] },
      { direction: "right", items: ["Product Planning", "Public Speaking", "Short-form Content", "Storytelling", "Team Lead"] }
    ],
    /* 직접 만든 것 목록. 출처: ~/.claude/agents(22개)·skills, Notion 워크스페이스, 옵시디언 제작기록 (2026-11-16) */
    builds: [
      {
        title: "Claude Code 에이전트 팀", note: "4개 팀 · 에이전트 22개",
        items: [
          { name: "투자 분석 팀", meta: "에이전트 5", desc: "거시·펀더멘탈·퀀트·리스크 담당이 각자 분석하고, 총괄이 주간 보고서로 종합합니다." },
          { name: "자산 관리 팀", meta: "에이전트 7", desc: "자산 계획·세무·회계·현금흐름·리스크·감사 역할로 나눠 월간 점검을 돌립니다." },
          { name: "콘텐츠 팀", meta: "에이전트 5", desc: "릴스 기획, 촬영 가이드, 성과 분석, 협업 제안서를 역할별로 맡깁니다." },
          { name: "학습 팀", meta: "에이전트 5", desc: "교재 분석, 개념 정리, 시험 전략, 예상 문제 출제를 차례로 처리합니다." },
          { name: "팀 운영 스킬과 훅", meta: "스킬 4종", desc: "팀별 호출 순서와 검증 체크리스트는 스킬로, 자동 실행 조건은 훅으로 묶었습니다." },
          { name: "에이전트 시각화 도구", meta: "훅 연동", desc: "에이전트 팀이 일하는 과정을 화면으로 보여 주는 도구를 만들었습니다." }
        ]
      },
      {
        title: "Notion", note: "지식베이스 설계·운영",
        items: [
          { name: "CÆst 1기 워크스페이스", meta: "모임 운영", desc: "회의록과 멤버별 주간 활동 제출, 개인 포트폴리오 페이지를 한곳에 모았습니다." },
          { name: "대학공부 HUB", meta: "과목 DB", desc: "과목별 시험 범위, 기출 분석, 남은 공부 체크리스트를 관리합니다." },
          { name: "경제·투자 학습 허브", meta: "캘린더 + 로그", desc: "거시경제 이벤트 캘린더와 공부한 내용을 쌓는 학습 로그입니다." },
          { name: "목표 단계별 PLAN", meta: "목표 DB", desc: "장기 목표를 단계별 실행 계획으로 쪼개 추적합니다." },
          { name: "인스타그램 벤치마킹 아카이브", meta: "리서치", desc: "참고 계정과 릴스 구조를 분석해 기획에 다시 쓰는 자료실입니다." }
        ]
      },
      {
        title: "Web", note: "Claude Code로 제작",
        items: [
          { name: "이 자소서 웹페이지", meta: "HTML · GSAP", desc: "기획부터 검증 스크립트까지 단계별로 나눠 만들었습니다." },
          { name: "공부 모임 쇼케이스 사이트", meta: "Next.js · 3D", desc: "WebGL 3D 히어로가 들어간 모임 소개 사이트 1차 시안입니다." }
        ]
      }
    ]
  },

  contact: {
    heading: "Let's Talk",
    message: "함께 만들 일이 있다면, 편하게 연락 주세요.",        // placeholder
    links: [   // 마그네틱 버튼. enabled:false → 비활성(값 수령 전)
      { id: "instagram", label: "Instagram", url: "https://www.instagram.com/hyuns_lim/",          icon: "instagram", enabled: true },
      { id: "linkedin",  label: "LinkedIn",  url: "https://www.linkedin.com/in/donghyunlim03/",    icon: "linkedin",  enabled: true },
      { id: "email",     label: "Email",     url: "mailto:031205ldh@gmail.com", icon: "mail", enabled: true },
      { id: "resume",    label: "Résumé PDF", url: null, icon: "file-down", enabled: false, note: "준비 중" }
    ],
    footer: "© 2026 Donghyun Lim. Built with care."
  }
};
