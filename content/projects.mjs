export const projects = [
  {
    "slug": "placia",
    "name": "Placia",
    "category": "TRAVEL & PRIVACY",
    "tone": "blue",
    "tags": [
      "PostgreSQL",
      "TypeScript",
      "Transactions"
    ],
    "kind": "case",
    "flow": [
      "Identity",
      "Device",
      "Session"
    ],
    "en": {
      "status": "In development",
      "title": "Transactional identity & device registration",
      "summary": "Keeping first-device registration consistent when requests race, expire, or repeat.",
      "overview": "Placia is a private, on-device travel photo atlas. The product organizes travel memories around photos and places. This case examines the internal backend for creating an identity, approving a first device, and issuing a session.",
      "problem": "Two accounts could compete to register the same device keys. An interrupted first login could also consume authorization without leaving a usable account and session. The important failure was a partially completed state that looked valid to the next request.",
      "decision": "Treat first login as one state transition. Identity creation, first-device approval, session issuance, and an encrypted retry response are committed together in a PostgreSQL transaction.",
      "implementation": "Device and key reservations acquire locks in a fixed order. Deferred database constraints reject incomplete transactions. An identical retry returns the existing session, so retrying does not create a second independent login result. Regression cases also cover cleanup during authorization expiry.",
      "tradeoff": "The stronger consistency boundary adds locking, database constraints, and encryption-key management. Those mechanisms become part of the behavior that integration tests need to exercise.",
      "verification": "The September 6 backend checkpoint records 241 unit and HTTP tests and 113 PostgreSQL integration tests, plus type checking, lint, build, and CI. These totals cover the complete backend suite, including registration, sessions, and internal recovery services—not each case individually.",
      "boundary": "The implemented scope includes internal identity, session, device approval, and recovery services. Public login, native recovery flows, and production encryption-key operations remain outside the reviewed completion boundary.",
      "result": "Atomic registration",
      "resultDetail": "Identity, device approval, and session issuance share a transaction boundary."
    },
    "ko": {
      "status": "개발 중",
      "title": "계정·기기 등록의 트랜잭션 설계",
      "summary": "요청이 겹치거나 중단되고 재시도돼도 첫 기기 등록의 일관성을 지키는 과정입니다.",
      "overview": "Placia는 사진과 장소를 중심으로 여행의 기억을 정리하는 온디바이스 여행 사진 아틀라스입니다. 이 사례는 계정 생성, 첫 기기 승인, 세션 발급을 담당하는 내부 백엔드를 다룹니다.",
      "problem": "서로 다른 계정이 같은 기기 키를 동시에 등록하려는 요청이 충돌할 수 있었습니다. 첫 로그인 도중 중단되면 인증 권한만 소비되고 사용할 계정과 세션은 남지 않을 수도 있었습니다. 일부만 완료된 상태가 다음 요청에서 정상으로 처리되지 않도록 해야 했습니다.",
      "decision": "첫 로그인을 하나의 상태 변경으로 처리했습니다. 계정 생성, 첫 기기 승인, 세션 발급, 암호화된 재시도 응답을 하나의 PostgreSQL 트랜잭션으로 묶었습니다.",
      "implementation": "기기와 키를 일정한 순서로 잠그고, 완성되지 않은 트랜잭션은 지연 검사하는 DB 제약으로 거부합니다. 동일한 요청을 다시 보내면 기존 세션을 반환해 별개의 로그인 결과를 만들지 않습니다. 인증 만료 중 정리 작업이 실행되는 경우도 회귀 테스트에 포함했습니다.",
      "tradeoff": "일관성을 확보하는 만큼 잠금, DB 제약, 암호화 키 관리가 복잡해집니다. 통합 테스트는 이 장치들이 실제로 함께 작동하는지까지 확인해야 합니다.",
      "verification": "9월 6일 백엔드 체크포인트에는 단위·HTTP 테스트 241건과 PostgreSQL 통합 테스트 113건, 타입 검사·린트·빌드·CI 통과가 기록돼 있습니다. 계정 등록, 세션, 내부 복구 서비스를 포함한 전체 백엔드 검증 수치이며 각 사례의 개별 테스트 수는 아닙니다.",
      "boundary": "구현 범위는 내부 계정·세션·기기 승인·복구 서비스입니다. 공개 로그인, 네이티브 복구 흐름과 운영 암호화 키 관리는 확인한 완료 범위 밖에 남아 있습니다.",
      "result": "원자적인 기기 등록",
      "resultDetail": "계정 생성, 기기 승인, 세션 발급이 하나의 트랜잭션 안에서 완료됩니다."
    }
  },
  {
    "slug": "whiskory",
    "name": "Whiskory",
    "category": "WEB & MOBILE",
    "tone": "violet",
    "tags": [
      "Next.js",
      "Firebase",
      "React Native"
    ],
    "kind": "case",
    "flow": [
      "Mobile app",
      "API boundary",
      "Service"
    ],
    "en": {
      "status": "In development",
      "title": "API isolation for web & mobile environments",
      "summary": "Connecting a native app to a test backend while preserving the web environment’s protection.",
      "overview": "Whiskory brings together a whiskey collection, tasting notes, discovery, and optional sharing. Its native app needs access to the same backend capabilities as the web app.",
      "problem": "The existing staging site required a Vercel browser login. Native API requests could not complete that browser-based access flow, so the environment could not support the mobile integration as configured.",
      "decision": "Introduce a separate mobile staging project while preserving the protected web environment. Expose a narrow set of API routes instead of opening every page in the staging deployment.",
      "implementation": "The implementation permits health, membership, and selected authentication endpoints. It checks the deployment mode, Vercel project, API origins, and Firebase project together. Inconsistent configurations return an unavailable response; other routes return 404. Each allowed endpoint retains its own authentication checks.",
      "tradeoff": "A route being reachable does not make it authorized. Deployment-level routing and endpoint-level authentication remain separate controls. The configuration must keep the mobile test environment and production resources from being mixed.",
      "verification": "The recorded checkpoint passed 15 HTTP boundary checks against a compiled local server, alongside web and mobile tests and GitHub CI. Android execution with the new configuration was also verified.",
      "boundary": "Staging API deployment, real provider sign-ins, and iOS validation remained open at the reviewed checkpoint. This case establishes an implemented and locally tested boundary, not a released mobile app.",
      "result": "A narrower API surface",
      "resultDetail": "Selected routes are reachable; endpoint authorization still applies."
    },
    "ko": {
      "status": "개발 중",
      "title": "웹·모바일 환경의 API 접근 경계 분리",
      "summary": "웹 환경의 보호를 유지하면서 네이티브 앱을 테스트 백엔드에 연결하는 과정입니다.",
      "overview": "Whiskory는 위스키 컬렉션, 시음 기록, 취향 탐색과 선택적 공유를 위한 서비스입니다. 네이티브 앱도 웹과 같은 백엔드 기능에 연결해야 합니다.",
      "problem": "기존 스테이징 사이트는 Vercel의 브라우저 로그인을 요구했습니다. 네이티브 API 요청은 이 브라우저용 절차를 완료할 수 없어, 기존 설정으로는 모바일 통합을 진행할 수 없었습니다.",
      "decision": "보호된 웹 환경을 유지하면서 모바일 전용 스테이징 프로젝트를 별도로 구성했습니다. 스테이징의 모든 페이지를 여는 대신 필요한 API 경로만 노출했습니다.",
      "implementation": "상태 확인, 멤버십, 일부 인증 API만 허용합니다. 배포 모드, Vercel 프로젝트, API 주소, Firebase 프로젝트가 함께 일치하는지 검사합니다. 설정이 어긋나면 접근을 차단하고, 허용하지 않은 경로는 404로 응답합니다. 허용된 API 내부의 인증 검사도 유지합니다.",
      "tradeoff": "경로에 도달할 수 있다는 것과 실행 권한이 있다는 것은 별개의 조건입니다. 배포 단계의 경로 제한과 API 내부의 인증을 각각 유지하며, 모바일 테스트 환경에 운영 자원이 섞이지 않도록 설정도 검증해야 합니다.",
      "verification": "기록된 체크포인트에서는 컴파일된 로컬 서버에 대한 HTTP 경계 검사 15개와 웹·모바일 테스트, GitHub CI가 통과했습니다. 새 설정으로 Android 앱이 실행되는 것도 확인했습니다.",
      "boundary": "확인한 체크포인트에서는 스테이징 API 배포, 실제 공급자 로그인, iOS 검증이 남아 있었습니다. 구현하고 로컬에서 검사한 접근 경계에 관한 사례이며, 모바일 앱의 출시 완료를 뜻하지 않습니다.",
      "result": "필요한 API만 노출",
      "resultDetail": "선택한 경로만 연결하고 각 API의 인증 조건을 그대로 유지합니다."
    }
  },
  {
    "slug": "resol-routine",
    "name": "Resol Routine",
    "category": "LEARNING & SYNC",
    "tone": "green",
    "tags": [
      "Flutter",
      "Python",
      "PostgreSQL"
    ],
    "kind": "case",
    "flow": [
      "Learning event",
      "Account scope",
      "Report"
    ],
    "en": {
      "status": "In development",
      "title": "Account-scoped synchronization & authorization",
      "summary": "Connecting answer restoration, account-scoped synchronization, and protected parent reports.",
      "overview": "Resol Routine is a daily English listening and reading practice app for Korean secondary-school learners. The backend connects learning events, vocabulary review, and parent-facing reports.",
      "problem": "A completed quiz must retain enough evidence to restore its answers and produce a consistent report. Retries must remain scoped to the correct account, and a parent report needs more than a valid login to be accessible.",
      "decision": "Validate versioned learning events and preserve complete quiz evidence. Scope synchronization and retry handling to the account, and require an active child link plus the relevant entitlement before serving a parent report.",
      "implementation": "Version 2 vocabulary-completion events require a complete answered-item list, unique item identifiers, and consistent totals, correct counts, and incorrect-item evidence. Version 1 retains its separate contract. Synchronization restores quiz evidence and personal-word changes. Report access checks authentication, the child relationship, and entitlement independently.",
      "tradeoff": "Stricter event contracts require clients to send complete, consistent evidence. Retry safety protects synchronization consistency; it does not establish that a client-reported learning result is truthful.",
      "verification": "Recorded local HTTP integration checks covered restored answers, report totals, isolation between accounts, and authenticated account deletion. Repository tests cover duplicate retries, account scope, and parent-report permissions.",
      "boundary": "Production rollout and complete device UI journeys remained pending in the reviewed documentation. These results cover implemented and locally tested data paths.",
      "result": "Account-scoped synchronization",
      "resultDetail": "Quiz evidence and retries stay tied to the account that owns them."
    },
    "ko": {
      "status": "개발 중",
      "title": "계정별 동기화와 학부모 리포트 인가",
      "summary": "답안 복원, 계정별 동기화, 권한이 필요한 학부모 리포트를 연결한 과정입니다.",
      "overview": "Resol Routine은 한국 중·고등학생을 위한 영어 듣기·읽기 학습 앱입니다. 백엔드는 학습 이벤트와 단어 복습, 학부모 리포트를 연결합니다.",
      "problem": "완료한 퀴즈는 답안을 복원하고 일관된 리포트를 만들 수 있을 만큼 충분한 기록을 남겨야 합니다. 재전송은 올바른 계정 안에서 처리돼야 하며, 학부모 리포트는 로그인 여부만으로 접근을 허용해서는 안 됩니다.",
      "decision": "버전별 학습 이벤트를 검증하고 퀴즈의 전체 답안을 보존합니다. 동기화와 재전송 처리를 계정별로 구분하며, 학부모 리포트에는 활성 자녀 연결과 이용 권한을 함께 요구합니다.",
      "implementation": "버전 2 단어 퀴즈 완료 이벤트는 응답한 전체 문항 목록, 식별자 중복과 전체·정답 수 및 오답 기록의 일치 여부를 검사합니다. 버전 1의 계약은 별도로 유지합니다. 동기화는 퀴즈 기록과 개인 단어 변경 사항을 복원하며, 리포트 접근 시 인증, 자녀 관계, 이용 권한을 각각 확인합니다.",
      "tradeoff": "이벤트 검증이 엄격할수록 클라이언트는 완전하고 일관된 기록을 보내야 합니다. 재시도 안전성은 동기화의 일관성을 위한 장치이며, 클라이언트가 보낸 학습 결과 자체의 진실성을 보장하지는 않습니다.",
      "verification": "기록된 로컬 HTTP 통합 검사에서는 답안 복원, 리포트 집계, 계정 간 데이터 분리와 인증된 계정 삭제를 확인했습니다. 저장소에는 중복 재전송, 계정 범위, 학부모 리포트 권한을 확인하는 테스트가 있습니다.",
      "boundary": "확인한 문서에서는 운영 환경 적용과 전체 기기 UI 검증이 남아 있었습니다. 이 사례는 구현한 데이터 처리 경로와 로컬 검증 범위를 다룹니다.",
      "result": "계정별로 분리한 동기화",
      "resultDetail": "퀴즈 기록과 재시도를 해당 데이터를 소유한 계정 안에서 처리합니다."
    }
  },
  {
    "slug": "quant-research",
    "name": "Quant Research",
    "category": "DATA & VERIFICATION",
    "tone": "orange",
    "tags": [
      "Python",
      "XBRL",
      "Mutation testing"
    ],
    "kind": "case",
    "flow": [
      "Filing",
      "Validation",
      "Research data"
    ],
    "en": {
      "status": "Research prototype",
      "title": "Data validation & mutation testing",
      "summary": "Replacing a misleading pass count with real execution and tests that detect injected defects.",
      "overview": "A personal Korean and U.S. quant research project. The repaired implementation is an offline pipeline that validates and preserves an SEC filing package and extracts XBRL facts, units, and reporting periods.",
      "problem": "An earlier stress runner reported 5,000 passes without calling the validators it was meant to exercise. The number looked reassuring but could not establish that the relevant safeguards worked.",
      "decision": "Replace pass-count evidence with tests that exercise the public API and CLI. Then challenge those tests by deliberately weakening safeguards and checking whether the suite detects the change.",
      "implementation": "The repaired suite runs the actual validation path, including real-file cases. Mutation checks introduce specific defects into the protection logic and require the corresponding tests to fail. A passing baseline is checked before the mutations are evaluated.",
      "tradeoff": "Narrowing the executable scope makes verification more concrete, while leaving larger research and trading features outside the current result. A useful test count needs a clearly defined behavior behind it.",
      "verification": "Archived Linux verification records show 79 tests passed without skips, including two real-file tests. All nine injected mutations were detected. These are recorded software verification results.",
      "boundary": "Mac verification remained unfinished at the reviewed checkpoint. The project has not established a working trading strategy, live trading, or historical backtest readiness.",
      "result": "9 / 9 injected defects detected",
      "resultDetail": "Recorded mutation checks challenged the tests, not just the application."
    },
    "ko": {
      "status": "연구 프로토타입",
      "title": "데이터 검증과 변이 테스트",
      "summary": "의미 없는 통과 횟수를 실제 실행과 의도적인 결함을 찾아내는 검증으로 바꾼 과정입니다.",
      "overview": "한국·미국 시장을 다루는 개인 퀀트 연구 프로젝트입니다. 개선판은 SEC 공시 패키지를 검증·보존하고 XBRL 관측값과 단위, 보고기간을 추출하는 오프라인 파이프라인입니다.",
      "problem": "기존 스트레스 테스트는 검증 대상 함수를 호출하지 않고도 5,000회 통과를 보고했습니다. 숫자만으로는 해당 보호 로직이 실제로 작동하는지 판단할 수 없었습니다.",
      "decision": "공개 API와 CLI를 직접 실행하는 테스트로 검증 근거를 바꿨습니다. 이후 보호 로직에 의도적으로 결함을 넣고, 테스트가 그 변경을 찾아내는지 확인했습니다.",
      "implementation": "개선한 테스트는 실제 파일 사례를 포함해 검증 경로를 실행합니다. 변이 검사는 보호 로직에 구체적인 결함을 주입하고 관련 테스트가 실패하는지 확인합니다. 변이를 적용하기 전에 정상 코드에서 테스트가 통과하는지도 검사합니다.",
      "tradeoff": "실행 범위를 좁히면 검증 대상이 분명해집니다. 동시에 더 큰 연구 기능과 거래 기능은 현재 결과의 범위 밖에 남습니다. 테스트 횟수는 무엇을 검증하는지 명확할 때 의미가 있습니다.",
      "verification": "보관된 Linux 검증 기록에서는 실제 파일 테스트 2개를 포함한 79개 테스트가 생략 없이 통과했고, 주입한 결함 9개를 모두 탐지했습니다. 당시 기록된 소프트웨어 검증 결과입니다.",
      "boundary": "확인한 체크포인트에서는 Mac 검증이 완료되지 않았습니다. 투자 전략의 유효성, 실거래 성과, 과거 백테스트에 사용할 준비가 완료됐음을 입증한 상태도 아닙니다.",
      "result": "주입한 결함 9개 모두 탐지",
      "resultDetail": "변이 테스트로 애플리케이션과 함께 테스트의 탐지 능력도 확인했습니다."
    }
  },
  {
    "slug": "pack-job",
    "name": "PACK JOB",
    "category": "COOPERATIVE GAME",
    "tone": "yellow",
    "tags": [
      "Unity",
      "C#",
      "Multiplayer"
    ],
    "kind": "project",
    "flow": [
      "Compress",
      "Carry",
      "Deploy"
    ],
    "en": {
      "status": "In development",
      "title": "Cooperative gameplay & interaction design",
      "summary": "A cooperative game built around compressing, carrying, and deploying objects.",
      "overview": "PACK JOB is a Unity cooperative heist game in development for one to four players. Its core design combines object compression and transport with police pursuit, capture, and escape.",
      "problem": "The project needs a clear interaction identity: items should differ in how they are handled and what they can do, so transporting them becomes part of the gameplay.",
      "decision": "I selected a first-person direction and asked for distinct handling and utility across items. A fan that slows pursuing police is one proposed experiment documented in the revised design.",
      "implementation": "The design review identified reusable compression, inventory, and host-authority foundations, then separated the changes needed for camera direction, aiming, body rotation, hands, and carried-object presentation.",
      "tradeoff": "The new direction changes multiple interacting gameplay systems. The design needs to be tested in play before a proposed item behavior can be treated as a successful mechanic.",
      "verification": "The reviewed checkpoint contains the revised design and implementation impact analysis. Those artifacts record the decisions; they do not verify that the new first-person gameplay has been implemented.",
      "boundary": "The game and revised interaction direction are still in development. No released gameplay or player outcome is claimed here.",
      "result": "First-person direction",
      "resultDetail": "Product decisions documented before the next implementation step."
    },
    "ko": {
      "status": "개발 중",
      "title": "협동 게임의 상호작용 설계",
      "summary": "물건을 압축하고 운반한 뒤 펼쳐 활용하는 협동 게임입니다.",
      "overview": "PACK JOB은 Unity로 개발 중인 1~4인 협동 강탈 게임입니다. 물건을 압축하고 운반하는 조작에 경찰의 추격, 체포, 탈옥을 결합합니다.",
      "problem": "아이템마다 운반 느낌과 활용 방식이 달라야 물건을 옮기는 과정 자체가 게임플레이가 됩니다. 프로젝트의 상호작용 방향을 명확하게 정할 필요가 있었습니다.",
      "decision": "1인칭 방향을 선택하고, 아이템별 조작감과 역할을 다르게 구성하도록 제안했습니다. 추격하는 경찰을 늦추는 선풍기는 개정 설계에 기록한 시험 후보 중 하나입니다.",
      "implementation": "설계 검토에서 압축, 인벤토리, 호스트 권한 기반의 재사용 가능성을 확인했습니다. 이어서 카메라, 조준, 몸 회전, 손과 운반 물체 표현에 필요한 변경 범위를 나눴습니다.",
      "tradeoff": "새 방향은 서로 연결된 여러 게임 시스템에 영향을 줍니다. 제안한 아이템 동작이 재미있는 메커니즘으로 이어지는지는 실제 플레이에서 검증해야 합니다.",
      "verification": "확인한 체크포인트에는 개정 설계와 구현 영향 분석이 있습니다. 결정 내용을 기록한 결과물이며, 새로운 1인칭 게임플레이가 구현됐다는 검증은 아닙니다.",
      "boundary": "게임과 개정한 상호작용 방향은 개발 중입니다. 출시된 게임플레이나 이용자 성과를 제시하는 단계는 아닙니다.",
      "result": "1인칭 중심의 방향 설정",
      "resultDetail": "다음 구현 단계에 앞서 제품 결정을 설계에 기록했습니다."
    }
  },
  {
    "slug": "resol-math",
    "name": "Resol App — Math",
    "category": "ARCHIVED EXPLORATION",
    "tone": "gray",
    "tags": [
      "Python",
      "PostgreSQL",
      "Learning tools"
    ],
    "kind": "archive",
    "flow": [
      "Explore",
      "Build",
      "Archive"
    ],
    "en": {
      "status": "Archived",
      "title": "Archived implementation & reusable code catalog",
      "summary": "A retired math application preserved as six documented feature collections for future adaptation.",
      "overview": "Resol App — Math was a math learning prototype. It is a separate project from the English learning app Resol Routine. Development has ended.",
      "problem": "Keeping a complete retired repository does not explain which parts can be adapted safely or which dependencies they still require.",
      "decision": "Group the original implementation into six feature collections with dependency maps, available tests, usage conditions, and recorded limitations. Preserve provenance instead of presenting the extracted code as a new independent library.",
      "implementation": "The catalog includes HTTP and token storage, camera upload and polling, and image-coordinate input. Original files are kept alongside dependency records and related tests. Some components still depend on the full Flutter application, so integration work is required before reuse.",
      "tradeoff": "Preserving context helps assess reuse, but a feature collection is not an independently installable package. Adoption in another active product has not been established. A separate Dart import-boundary checker in the broader archive is a standalone CLI with examples and self-tests.",
      "verification": "Available test files cover authentication and request-ID headers, HTTP 429 handling, token storage, and coordinate normalization. The archived snapshot records 25 passing tests; its analyzer still exited with 91 informational findings. Checksums preserve the source provenance.",
      "boundary": "The application is retired. The catalog is a reference for adaptation, with remaining Flutter dependencies and analyzer findings documented.",
      "result": "Six documented feature collections",
      "resultDetail": "Source, dependency maps, related tests, and adaptation limits are preserved together."
    },
    "ko": {
      "status": "개발 종료",
      "title": "종료한 구현을 재사용 후보 코드로 정리",
      "summary": "개발을 종료한 수학 앱을 여섯 개 기능 모음으로 분류하고 후속 작업을 위한 자료로 보관했습니다.",
      "overview": "Resol App — Math는 수학 학습 프로토타입입니다. 영어 학습 앱 Resol Routine과 별개의 프로젝트이며, 현재 개발을 종료했습니다.",
      "problem": "종료한 저장소를 통째로 보관하는 것만으로는 어떤 기능을 가져다 쓸 수 있는지, 어떤 의존성이 필요한지 판단하기 어렵습니다.",
      "decision": "원본 구현을 여섯 개 기능으로 분류하고 의존성 목록, 관련 테스트, 사용 조건과 확인된 한계를 함께 정리했습니다. 추출한 코드를 독립 라이브러리로 포장하지 않고 원본 이력을 유지했습니다.",
      "implementation": "HTTP·토큰 저장, 카메라 업로드·폴링, 이미지 좌표 입력 등을 기능별로 분류했습니다. 원본 파일에 의존성 기록과 관련 테스트를 연결했습니다. 일부는 전체 Flutter 앱의 의존성이 남아 있어 실제 사용 시 통합 작업이 필요합니다.",
      "tradeoff": "기능별 정리는 재사용 가능성을 판단하는 데 도움이 되지만 독립 설치 패키지와는 다릅니다. 다른 활성 제품에서 채택한 실적은 아직 확인되지 않았습니다. 더 넓은 보관 자료에는 실행 예시와 자체 테스트를 갖춘 독립 CLI인 Dart import 경계 검사 도구도 있습니다.",
      "verification": "보관된 테스트에는 인증·요청 ID 헤더, HTTP 429 처리, 토큰 저장과 좌표 정규화 검사가 있습니다. 당시 기록은 테스트 25개 통과와 분석기의 정보 수준 지적 91건으로 인한 종료 코드 1을 함께 남겼습니다. 체크섬으로 원본 이력도 보존합니다.",
      "boundary": "앱 개발은 종료했습니다. 기능 모음은 후속 구현에 맞게 수정할 참고 자료이며, 남은 Flutter 의존성과 분석기 지적 사항도 문서에 기록했습니다.",
      "result": "문서화한 기능 모음 6개",
      "resultDetail": "원본 소스, 의존성 목록, 관련 테스트와 적용 시 한계를 함께 보관합니다."
    }
  }
];
