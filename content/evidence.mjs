export const implementationEvidence = [
  {
    project: 'placia',
    en: {
      context: 'Identity-exchange implementation and PostgreSQL integration tests. File names refer to the reviewed backend checkpoint.',
      references: [
        { path: 'backend/src/auth/email-exchange.ts', detail: 'Validates and copies the request before creating registration state. An identical retry restores the encrypted response bound to the original request.' },
        { path: 'backend/migrations/003_identity_exchange.sql', detail: 'Locks identity and device-key claims, acquires device-key locks in sorted order, and rechecks validity using database time after a lock wait.' },
        { path: 'backend/test/integration/email-exchange.ts', detail: 'Exercises competing key claims, deferred constraints, expiry cleanup, and full rollback when encrypted-response storage fails.' },
      ],
      boundary: 'The registration and retry path is backed by database integration tests. Operational key rotation and the public/native login journey remain separate work.',
    },
    ko: {
      context: '계정 교환 구현과 PostgreSQL 통합 테스트를 대조했습니다. 파일 경로는 확인한 백엔드 체크포인트 기준입니다.',
      references: [
        { path: 'backend/src/auth/email-exchange.ts', detail: '등록 상태를 만들기 전에 요청을 검증하고 복사합니다. 동일한 재시도는 원래 요청에 결합한 암호화 응답을 복구합니다.' },
        { path: 'backend/migrations/003_identity_exchange.sql', detail: '계정과 기기 키의 선점 상태를 잠그고 기기 키는 정렬된 순서로 잠급니다. 잠금 대기 후에는 DB 시간으로 유효성을 다시 판단합니다.' },
        { path: 'backend/test/integration/email-exchange.ts', detail: '같은 키의 경합, 지연 제약, 만료 시 정리와 암호화 응답 저장 실패 시 전체 롤백을 검사합니다.' },
      ],
      boundary: '등록과 재시도 경로는 DB 통합 테스트로 확인했습니다. 운영 키 교체와 공개·네이티브 로그인 과정은 별도의 완료 범위입니다.',
    },
  },
  {
    project: 'whiskory',
    en: {
      context: 'Mobile staging checkpoint, reviewed alongside its compiled-server HTTP verification script.',
      references: [
        { path: 'src/lib/mobileStagingDeployment.ts', detail: 'Compares deployment mode, Vercel project, API origin, and Firebase configuration as one environment. Missing required settings do not grant access.' },
        { path: 'src/proxy.ts', detail: 'Checks both HTTP method and route in mobile staging. Pages outside the allowlist return 404 before reaching the web application.' },
        { path: 'scripts/verifyMobileStagingBoundary.mjs', detail: 'Starts the compiled Next.js server under three configurations and checks 15 HTTP responses, including appropriate 401/503 responses on allowed routes, blocked 404s, and existing web behavior.' },
      ],
      boundary: 'These HTTP results verify the boundary under known configurations. They do not represent successful authentication with a live identity provider.',
    },
    ko: {
      context: '모바일 스테이징 체크포인트의 구현을 컴파일된 서버에 대한 HTTP 검증 스크립트와 함께 확인했습니다.',
      references: [
        { path: 'src/lib/mobileStagingDeployment.ts', detail: '배포 모드, Vercel 프로젝트, API 주소와 Firebase 설정을 한 환경으로 비교합니다. 필수 설정이 없으면 접근을 허용하지 않습니다.' },
        { path: 'src/proxy.ts', detail: '모바일 스테이징에서 HTTP 메서드와 경로를 함께 검사합니다. 허용 목록 밖의 페이지는 웹 앱에 도달하기 전에 404로 차단합니다.' },
        { path: 'scripts/verifyMobileStagingBoundary.mjs', detail: '세 가지 설정으로 컴파일된 Next.js 서버를 실행하고 HTTP 응답 15개를 확인합니다. 허용 경로의 적절한 401/503, 비허용 404와 기존 웹 동작을 구분합니다.' },
      ],
      boundary: 'HTTP 결과는 정해진 설정에서 접근 경계를 확인한 것입니다. 실제 인증 공급자를 통한 로그인 성공을 나타내는 결과는 아닙니다.',
    },
  },
  {
    project: 'resol-routine',
    en: {
      context: 'Event ingestion, transaction lifecycle, and parent-report tests were inspected together to trace data ownership from upload through reporting.',
      references: [
        { path: 'backend/app/services/sync_service.py', detail: 'Uses student, device, and event key to detect duplicates and retains the original accepted payload.' },
        { path: 'backend/app/db/session.py', detail: 'Dispatches scheduled aggregation after commit succeeds and clears scheduled work on rollback. Enqueue failures after commit are logged; this is not a transactional outbox.' },
        { path: 'backend/tests/test_sync_event_ingestion.py', detail: 'Checks the same key across different students and devices, changed retry payloads, duplicate-only batches, and forced commit failures without aggregation.' },
        { path: 'backend/tests/test_parent_report_vocab_v2.py', detail: 'Checks authorization withdrawal and verifies that parent reports omit answered-item IDs, incorrect-item IDs, and personal vocabulary text.' },
      ],
      boundary: 'The reviewed reports expose aggregated study information. Personal-word changes do not count as report activity. Durable queue delivery is not established by the local checks.',
    },
    ko: {
      context: '업로드부터 리포트까지 데이터 소유권을 추적하기 위해 이벤트 수집, 트랜잭션 수명주기와 학부모 리포트 테스트를 함께 확인했습니다.',
      references: [
        { path: 'backend/app/services/sync_service.py', detail: '학생·기기·이벤트 키로 중복을 판단하고 최초에 수락한 내용을 유지합니다.' },
        { path: 'backend/app/db/session.py', detail: '커밋 성공 후 예약한 집계를 실행하고 롤백 시 예약을 제거합니다. 커밋 후 큐 전달 실패는 로그로 남기며, 트랜잭션 아웃박스로 구현한 것은 아닙니다.' },
        { path: 'backend/tests/test_sync_event_ingestion.py', detail: '서로 다른 학생·기기의 같은 키, 변경된 재전송 내용, 중복만 있는 요청과 강제 커밋 실패 시 집계가 시작되지 않는지 검사합니다.' },
        { path: 'backend/tests/test_parent_report_vocab_v2.py', detail: '권한 철회와 함께 학부모 리포트에 응답 문항 ID·오답 ID·개인 단어 텍스트가 포함되지 않는지 확인합니다.' },
      ],
      boundary: '확인한 리포트는 집계된 학습 정보를 제공합니다. 개인 단어 변경은 리포트 활동에 포함하지 않으며, 로컬 검증으로 큐의 영속적 전달까지 보장한 것은 아닙니다.',
    },
  },
  {
    project: 'quant-research',
    en: {
      context: 'References are from the archived v10.66 research repair. The execution results belong to its recorded Linux environment.',
      references: [
        { path: 'mutation_check.py', detail: 'First checks that each target test passes on the normal implementation. Injects one safeguard defect at a time in a temporary copy and does not count an unrelated process error as detection.' },
        { path: 'tests/test_pipeline.py', detail: 'Executes the actual Python API and subprocess CLI, checking repeat-run idempotency, recomputed results, and rejection of tampered output.' },
        { path: 'tests/test_real.py', detail: 'Uses an externally supplied fixture package for two real-file cases. Verifies hashes, parsing, and reruns while explicitly rejecting a claim of backtest readiness.' },
      ],
      boundary: 'The recorded run included both real-file cases and detected all nine defined mutations. Running these cases again requires the corresponding external fixture package.',
    },
    ko: {
      context: '보관된 v10.66 연구 도구 개선판의 파일을 참조합니다. 실행 결과는 당시 기록한 Linux 환경 기준입니다.',
      references: [
        { path: 'mutation_check.py', detail: '정상 구현에서 대상 테스트의 통과를 먼저 확인합니다. 임시 복사본에 보호 로직 결함을 하나씩 넣고, 무관한 프로세스 오류는 탐지 성공으로 세지 않습니다.' },
        { path: 'tests/test_pipeline.py', detail: '실제 Python API와 별도 프로세스의 CLI를 실행하며 재실행의 멱등성, 결과 재계산과 변조된 출력의 거부를 검사합니다.' },
        { path: 'tests/test_real.py', detail: '외부 샘플 패키지를 제공하면 실제 파일 사례 두 개를 실행합니다. 해시·파싱·재실행을 확인하며 백테스트 준비 완료라는 주장도 명시적으로 거부합니다.' },
      ],
      boundary: '기록된 실행은 실제 파일 사례 두 개를 포함했고 정의한 변이 아홉 개를 모두 탐지했습니다. 같은 사례를 재실행하려면 해당 외부 샘플 패키지가 필요합니다.',
    },
  },
];
