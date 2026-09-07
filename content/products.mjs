export const productProfiles = [
  {
    slug: 'placia',
    en: {
      title: 'Travel plans and photo memories, organized in one place.',
      summary: 'An on-device travel app for organizing photos by place, revisiting trips, and keeping itineraries, checklists, and budgets together.',
      context: 'Placia connects the practical details of planning a trip with the photos and places people want to remember afterward. Its local-first product model keeps travel records on the device. Account and device services are being developed alongside the app.',
      workflow: [
        { title: 'Organize photos', detail: 'Bring travel photos and their places together to revisit a trip.' },
        { title: 'Plan a trip', detail: 'Keep itineraries, checklists, budgets, and reservation records in the same travel workspace.' },
        { title: 'Keep a personal record', detail: 'Review and update travel memories on the device.' },
      ],
    },
    ko: {
      title: '여행 계획과 사진 속 기억을 한곳에 정리하는 앱',
      summary: '여행 사진을 장소별로 정리하고 지난 여행을 돌아보며, 일정·체크리스트·예산을 기기 안에서 관리하는 여행 앱입니다.',
      context: 'Placia는 여행을 준비할 때 필요한 정보와 여행 후 남기는 사진·장소 기록을 연결합니다. 여행 자료를 기기에 보관하는 구조를 바탕으로 개발하고 있으며, 앱과 함께 계정·기기 관리 서비스를 구현하고 있습니다.',
      workflow: [
        { title: '사진과 장소 정리', detail: '여행 사진을 장소와 함께 모아 지난 여행을 돌아봅니다.' },
        { title: '여행 계획 관리', detail: '일정, 체크리스트, 예산과 예약 정보를 여행 기록 안에서 관리합니다.' },
        { title: '나만의 기록 보관', detail: '기기에 남긴 여행의 기억을 살펴보고 수정합니다.' },
      ],
    },
  },
  {
    slug: 'whiskory',
    en: {
      title: 'A personal whiskey collection and tasting journal.',
      summary: 'Keep track of your bottles, record tasting notes, explore recommendations, and choose what to share across web and mobile.',
      context: 'Whiskory is for people who want to remember what they own, what they have tasted, and what they might try next. Collection management, recommendations, and optional sharing connect through a shared backend. The native app is still in development.',
      workflow: [
        { title: 'Manage a collection', detail: 'Keep a record of your whiskey bottles in a personal collection.' },
        { title: 'Record your taste', detail: 'Save tasting notes and explore recommendations for your next bottle.' },
        { title: 'Choose what to share', detail: 'Control public visibility through an image publication and review workflow under development.' },
      ],
    },
    ko: {
      title: '내 위스키 컬렉션과 취향을 기록하는 서비스',
      summary: '보유한 위스키와 시음 기록을 관리하고, 추천을 탐색하며 원하는 기록을 선택해 공유하는 웹·모바일 서비스입니다.',
      context: 'Whiskory는 어떤 위스키를 가지고 있고, 어떤 맛을 느꼈으며, 다음에 무엇을 마셔볼지 기록하는 서비스입니다. 컬렉션 관리, 추천, 선택적 공유가 같은 백엔드로 연결되며 네이티브 앱을 함께 개발하고 있습니다.',
      workflow: [
        { title: '컬렉션 관리', detail: '내가 보유한 위스키를 개인 컬렉션에 기록합니다.' },
        { title: '시음과 취향 기록', detail: '시음 노트를 남기고 다음에 마셔볼 위스키의 추천을 탐색합니다.' },
        { title: '선택적 공유', detail: '공개 범위를 정하고 이미지를 공유할 수 있도록 심사 흐름을 개발합니다.' },
      ],
    },
  },
  {
    slug: 'resol-routine',
    en: {
      title: 'Daily English practice with a clearer view of progress.',
      summary: 'A listening and reading app for Korean secondary-school learners, connecting vocabulary review and quiz history with parent reports.',
      context: 'Resol Routine brings listening, reading, and vocabulary review into a daily learning routine. Students build a record of their practice, while linked parents can review progress through reports when they have the required access. The app and its synchronization services are in development.',
      workflow: [
        { title: 'Practice each day', detail: 'Work through English listening and reading activities.' },
        { title: 'Review vocabulary', detail: 'Complete quizzes and revisit answers and personal vocabulary.' },
        { title: 'Follow progress', detail: 'Connect study history with reports for an authorized, linked parent.' },
      ],
    },
    ko: {
      title: '매일의 영어 학습과 복습을 연결하는 앱',
      summary: '중·고등학생의 듣기·읽기 학습과 단어 복습을 돕고, 퀴즈 기록을 학부모 리포트로 연결하는 영어 학습 앱입니다.',
      context: 'Resol Routine은 영어 듣기, 읽기, 단어 복습을 매일의 학습 루틴으로 연결합니다. 학생은 학습 기록을 쌓고 답안을 다시 확인하며, 연결된 학부모는 이용 권한에 따라 학습 현황을 살펴봅니다. 앱과 학습 기록의 동기화 기능을 개발하고 있습니다.',
      workflow: [
        { title: '매일 듣기·읽기', detail: '영어 듣기와 읽기 활동을 진행합니다.' },
        { title: '단어와 답안 복습', detail: '퀴즈를 풀고 답안과 개인 단어장을 다시 확인합니다.' },
        { title: '학습 현황 확인', detail: '학습 기록을 연결된 학부모가 권한에 따라 확인하는 리포트로 모읍니다.' },
      ],
    },
  },
  {
    slug: 'quant-research',
    en: {
      title: 'Financial filings prepared for systematic research.',
      summary: 'An offline research pipeline that validates SEC filing packages and extracts XBRL facts, units, and reporting periods.',
      context: 'This personal quant research project prepares financial disclosure data for further analysis. The reviewed implementation focuses on validating and preserving filing packages and extracting structured XBRL data. Trading strategies and backtests are outside the completed scope.',
      workflow: [
        { title: 'Prepare filings', detail: 'Supply SEC filing packages to the offline validation pipeline.' },
        { title: 'Extract financial data', detail: 'Read XBRL facts with their units and reporting periods.' },
        { title: 'Preserve research inputs', detail: 'Keep validated filing material as a basis for later analysis.' },
      ],
    },
    ko: {
      title: '공시 데이터를 검증하고 정리하는 투자 연구 도구',
      summary: 'SEC 공시 파일을 검증·보관하고 XBRL 재무 관측값과 단위, 보고기간을 추출하는 오프라인 연구 프로젝트입니다.',
      context: '개인 퀀트 연구를 위해 재무 공시 자료를 분석 가능한 입력으로 정리하는 프로젝트입니다. 확인한 구현은 공시 패키지의 검증·보관과 구조화된 XBRL 데이터 추출에 집중합니다. 투자 전략과 백테스트는 완료 범위에 포함하지 않습니다.',
      workflow: [
        { title: '공시 자료 준비', detail: 'SEC 공시 패키지를 오프라인 검증 파이프라인에 입력합니다.' },
        { title: '재무 정보 추출', detail: 'XBRL 관측값과 연결된 단위·보고기간을 읽어냅니다.' },
        { title: '연구 입력 보관', detail: '검증한 공시 자료를 후속 분석의 기초 자료로 남깁니다.' },
      ],
    },
  },
  {
    slug: 'pack-job',
    en: {
      title: 'A cooperative heist built around what you can carry.',
      summary: 'A Unity game project for one to four players, built around compressing objects, moving loot, and escaping police pursuit.',
      context: 'PACK JOB explores a first-person cooperative heist in which handling objects is central to play. The reviewed work covers the design and implementation impact of compression, transport, item utility, and camera perspective. The following loop describes the intended game experience.',
      workflow: [
        { title: 'Compress objects', detail: 'The design lets players shrink objects to make them easier to transport.' },
        { title: 'Move the loot', detail: 'Players coordinate carrying and deploying objects during the heist.' },
        { title: 'Get away together', detail: 'Police pursuit and useful items shape the planned escape.' },
      ],
    },
    ko: {
      title: '물건을 압축하고 운반하며 함께 탈출하는 협동 게임',
      summary: '1~4명이 물건을 압축해 옮기고 경찰의 추격을 피해 탈출하는 Unity 기반 게임 프로젝트입니다.',
      context: 'PACK JOB은 물건을 다루는 행동을 중심에 둔 1인칭 협동 강탈 게임입니다. 확인한 작업은 압축·운반·아이템의 활용과 시점 전환에 대한 설계 및 구현 영향 분석입니다. 아래 흐름은 설계한 게임의 플레이 방식입니다.',
      workflow: [
        { title: '물건 압축', detail: '물건의 크기를 줄여 운반하기 쉽게 만드는 플레이를 설계합니다.' },
        { title: '협력해서 운반', detail: '강탈 중에 물건을 나르고 펼쳐 쓰는 역할을 나눕니다.' },
        { title: '함께 탈출', detail: '경찰의 추격에 대응하고 아이템을 활용하는 탈출 과정을 구상합니다.' },
      ],
    },
  },
  {
    slug: 'resol-math',
    en: {
      title: 'A photo-based math learning prototype.',
      summary: 'An archived Flutter app exploring problem capture, additional input, and result review, with useful workflows preserved for later adaptation.',
      context: 'Resol App — Math explored a learning experience beginning with a photo of a problem. The prototype includes capture, upload, additional input, and result-screen flows. Development ended before establishing a complete, integrated solving service; source and related tests were retained for reuse.',
      workflow: [
        { title: 'Capture a problem', detail: 'The prototype starts with camera capture and an image-upload flow.' },
        { title: 'Add context', detail: 'Provide requested details and follow the processing status.' },
        { title: 'Review a result', detail: 'Result-screen and image-coordinate work are preserved with the archived source.' },
      ],
    },
    ko: {
      title: '사진 입력으로 시작하는 수학 학습 프로토타입',
      summary: '문제 촬영, 추가 정보 입력과 결과 확인 흐름을 탐색한 Flutter 앱입니다. 개발 종료 후 주요 기능을 재사용 자료로 정리했습니다.',
      context: 'Resol App — Math는 수학 문제를 사진으로 입력하는 학습 경험을 탐색했습니다. 촬영, 업로드, 추가 입력, 결과 화면의 흐름을 구현한 프로토타입으로, 완전히 통합된 풀이 서비스를 확인하기 전에 개발을 종료했습니다. 소스와 관련 테스트는 후속 작업을 위한 자료로 보관했습니다.',
      workflow: [
        { title: '문제 촬영', detail: '카메라 촬영과 이미지 업로드로 시작하는 흐름을 구현했습니다.' },
        { title: '추가 정보 입력', detail: '추가 입력과 처리 상태 조회로 풀이 요청 과정을 탐색했습니다.' },
        { title: '결과 화면 확인', detail: '결과 화면과 이미지 좌표 처리 코드를 원본 소스와 함께 보관했습니다.' },
      ],
    },
  },
];
