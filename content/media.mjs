export const projectMedia = [
  {
    project: 'placia',
    images: [
      {
        src: 'assets/screens/placia-atlas.webp', width: 1320, height: 2868,
        en: { title: 'Travel memories on the map', alt: 'Placia Atlas screen with sample travel clusters across Korea, Japan, and Taiwan.', caption: 'iOS simulator capture with fixed sample data. The Atlas groups travel memories by location.' },
        ko: { title: '지도 위에 모인 여행의 기억', alt: '한국·일본·대만의 샘플 여행 기록이 모여 있는 Placia Atlas 화면.', caption: '고정 샘플 데이터로 실행한 iOS 시뮬레이터 화면입니다. 여행의 기억을 장소별로 모아 보여줍니다.' },
      },
      {
        src: 'assets/screens/placia-capsules.webp', width: 1320, height: 2868,
        en: { title: 'A collection of trips', alt: 'Placia Capsules screen showing sample trips to Tokyo, Jeju, and Taipei.', caption: 'The same fixture session groups sample photos into travel capsules, with dates and review status.' },
        ko: { title: '여행별로 정리한 캡슐', alt: '도쿄·제주·타이베이의 샘플 여행을 보여주는 Placia Capsules 화면.', caption: '같은 샘플 실행에서 사진을 여행 캡슐로 묶고 기간과 검토 상태를 보여주는 화면입니다.' },
      },
    ],
  },
  {
    project: 'whiskory',
    images: [
      {
        src: 'assets/screens/whiskory-collection.png', width: 1265, height: 1039,
        en: { title: 'The whiskey collection workspace', alt: 'Whiskory web app with collection filters, journal and recommendation navigation, and a signed-out empty collection.', caption: 'Local web capture from September 5, 2026. This signed-out empty state shows collection controls; the development badge remains visible.' },
        ko: { title: '위스키 컬렉션 작업 공간', alt: '컬렉션 필터, 시음 기록과 추천 메뉴를 갖춘 Whiskory 웹 앱의 로그인 전 빈 화면.', caption: '2026년 9월 5일의 로컬 웹 캡처입니다. 로그인 전 빈 컬렉션의 조작 요소를 보여주며 개발 환경 배지가 포함돼 있습니다.' },
      },
    ],
  },
];

export const publicAssets = ['style.css', 'script.js', 'assets/favicon.svg', ...projectMedia.flatMap((item) => item.images.map((image) => image.src))];
