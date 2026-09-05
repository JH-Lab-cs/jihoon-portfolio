export const walkthroughs = [
  {
    project: 'placia',
    en: {
      invariant: 'At registration commit, an approved first device must belong to a complete identity and usable session. A retry must not create a second independent login result.',
      steps: [
        { title: 'Serialize conflicting device claims', detail: 'Acquire device and key reservations in a fixed order inside the PostgreSQL transaction. Requests claiming the same keys must resolve against the same stored state.' },
        { title: 'Create the complete registration state', detail: 'Create the identity, approve the first device, and issue the session within that transaction. Deferred constraints validate the relationships at commit so an incomplete state cannot become the next request’s starting point.' },
        { title: 'Preserve a bound retry response', detail: 'Store an encrypted exchange response with the registration. Its authenticated bindings tie it to the original request; returning it requires an identical retry and a still-valid session.' },
        { title: 'Commit together or roll back', detail: 'Complete the registration as one unit. A lost network response can be retried without registering again; expired authorization and revoked sessions must not be revived through the retry path.' },
      ],
      checks: [
        ['Two identities claim the same device keys', 'Resolve the competing claims without allowing the keys to belong to both identities.'],
        ['The original response is lost and the same request repeats', 'Return the existing valid session through the bound retry response.'],
        ['Authorization expires or the session is revoked', 'Reject an invalid retry and preserve a consistent registration state.'],
      ],
      scope: 'The reviewed PostgreSQL integration tests cover registration races, retries, expiry cleanup, and session invalidation. The full-suite totals below also include other backend services.',
    },
    ko: {
      invariant: '등록이 커밋되는 시점에는 승인된 첫 기기가 완성된 계정과 사용 가능한 세션에 연결돼야 합니다. 같은 요청의 재전송으로 별개의 로그인 결과가 생겨서는 안 됩니다.',
      steps: [
        { title: '같은 기기를 선점하는 요청 정렬', detail: 'PostgreSQL 트랜잭션 안에서 기기와 키 예약을 일정한 순서로 잠급니다. 같은 키를 등록하려는 요청들이 동일한 저장 상태를 기준으로 충돌을 처리하도록 합니다.' },
        { title: '계정·기기·세션을 함께 생성', detail: '계정 생성, 첫 기기 승인과 세션 발급을 같은 트랜잭션에서 처리합니다. 지연 검사하는 DB 제약은 커밋 시점에 관계를 검증해, 일부만 완료된 상태가 다음 요청의 출발점이 되지 않게 합니다.' },
        { title: '원래 요청에 묶인 응답 보관', detail: '암호화한 교환 응답도 등록 상태와 함께 저장합니다. 인증된 결합 정보로 원래 요청에 연결하고, 동일한 재시도이면서 세션이 여전히 유효할 때만 반환합니다.' },
        { title: '전체 커밋 또는 롤백', detail: '등록 작업을 하나의 단위로 완료합니다. 네트워크에서 응답이 유실돼도 다시 등록할 필요가 없고, 만료된 승인이나 폐기된 세션은 재시도로 되살릴 수 없도록 합니다.' },
      ],
      checks: [
        ['서로 다른 계정이 같은 기기 키를 요청', '경합을 처리하면서 같은 키가 두 계정에 소속되는 상태를 차단합니다.'],
        ['최초 응답 유실 후 같은 요청을 재전송', '요청에 연결된 재시도 응답으로 기존의 유효한 세션을 반환합니다.'],
        ['승인이 만료되거나 세션이 폐기된 상태', '유효하지 않은 재시도를 거부하고 등록 상태의 일관성을 유지합니다.'],
      ],
      scope: '확인한 PostgreSQL 통합 테스트는 등록 경합, 재시도, 만료 시 정리와 세션 무효화를 다룹니다. 아래의 전체 테스트 수에는 다른 백엔드 서비스 검증도 포함됩니다.',
    },
  },
  {
    project: 'whiskory',
    en: {
      invariant: 'A native client can reach the intended staging APIs without gaining access to unrelated web routes or bypassing an endpoint’s own authorization.',
      steps: [
        { title: 'Separate the mobile staging entry point', detail: 'Keep the existing browser-protected web project and configure a dedicated mobile staging project. The native client uses that API origin instead of depending on an interactive browser login.' },
        { title: 'Validate the environment as one configuration', detail: 'Check deployment mode, Vercel project identity, allowed origins, and Firebase project together. Conflicting values stop the request rather than allowing a partly configured environment to use the wrong resources.' },
        { title: 'Allow only the required routes', detail: 'Permit health, membership, and selected authentication endpoints. Requests outside the allowlist receive 404, including unrelated pages that the native app does not need.' },
        { title: 'Apply authorization at the endpoint', detail: 'Forward an allowed request into the existing handler, where authentication and authorization still apply. Route reachability and permission to read or change data remain separate decisions.' },
      ],
      checks: [
        ['A native request targets an allowed API', 'The route reaches its handler without the web project’s interactive login flow.'],
        ['A request targets a page outside the allowlist', 'Return 404 rather than exposing the surrounding web application.'],
        ['Deployment or Firebase project settings conflict', 'Fail closed instead of using a mixed staging/production configuration.'],
      ],
      scope: 'Fifteen HTTP boundary checks ran against a compiled local server. Android execution was recorded; deployed staging, real provider sign-in, and iOS validation were still pending at this checkpoint.',
    },
    ko: {
      invariant: '네이티브 앱은 필요한 스테이징 API에 연결하되, 관계없는 웹 경로나 API 자체의 권한 검사를 우회할 수 없어야 합니다.',
      steps: [
        { title: '모바일 스테이징 진입점 분리', detail: '브라우저 로그인으로 보호된 웹 프로젝트를 유지하고 모바일 스테이징을 별도로 구성합니다. 네이티브 앱은 대화형 브라우저 로그인에 의존하지 않는 API 주소를 사용합니다.' },
        { title: '환경 설정을 한 묶음으로 검증', detail: '배포 모드, Vercel 프로젝트 식별, 허용 주소와 Firebase 프로젝트를 함께 검사합니다. 값이 충돌하면 요청을 중단해 불완전한 설정이 잘못된 환경의 자원에 연결되지 않게 합니다.' },
        { title: '필요한 경로만 통과', detail: '상태 확인, 멤버십, 일부 인증 API만 허용합니다. 네이티브 앱에 필요 없는 페이지를 포함해 허용 목록 밖의 요청에는 404를 반환합니다.' },
        { title: 'API 안에서 권한 재검사', detail: '허용된 요청은 기존 핸들러로 전달하고 인증·인가 검사를 그대로 적용합니다. 경로에 연결되는 것과 데이터를 읽거나 바꿀 권한을 별도로 판단합니다.' },
      ],
      checks: [
        ['네이티브 앱이 허용된 API에 요청', '웹 프로젝트의 대화형 로그인 없이 해당 핸들러까지 연결합니다.'],
        ['허용 목록 밖의 페이지에 요청', '주변 웹 애플리케이션을 노출하는 대신 404를 반환합니다.'],
        ['배포 또는 Firebase 프로젝트 설정 불일치', '스테이징과 운영 설정이 섞인 상태로 진행하지 않고 차단합니다.'],
      ],
      scope: '컴파일된 로컬 서버에서 HTTP 경계 검사 15개를 실행했습니다. Android 실행 기록이 있으며, 해당 체크포인트에서는 스테이징 배포·실제 공급자 로그인·iOS 검증이 남아 있었습니다.',
    },
  },
  {
    project: 'resol-routine',
    en: {
      invariant: 'A retried study event preserves the first accepted answers, remains isolated to its student and device, and triggers aggregation only after a successful commit.',
      steps: [
        { title: 'Validate the version 2 quiz contract', detail: 'For version 2 vocabulary-completion events, validate the full answered-item list, unique item IDs, and consistency between totals, correct counts, and incorrect-item evidence. Version 1 retains its separate contract.' },
        { title: 'Keep retries within their account and device', detail: 'Use the database uniqueness boundary (student_id, device_id, idempotency_key). A replay cannot overwrite the original payload; another student or device can submit its own event with the same key.' },
        { title: 'Commit before requesting aggregation', detail: 'Persist the accepted event and dispatch aggregation only after the transaction commits. If the transaction rolls back, there must be no aggregation job for an event that does not exist.' },
        { title: 'Restore evidence and authorize reports', detail: 'Synchronization restores quiz answers and personal-word changes. Parent reports separately require the authenticated parent’s active child relationship and the CHILD_REPORTS entitlement.' },
      ],
      checks: [
        ['The same device repeats an event with changed answers', 'Keep the original accepted answers rather than replacing the learning evidence.'],
        ['A different student or device uses the same event key', 'Treat it in its own scope instead of suppressing a legitimate submission.'],
        ['The database transaction is forced to roll back', 'Do not dispatch aggregation for the uncommitted event.'],
      ],
      scope: 'Repository tests cover these replay and rollback cases. Recorded local HTTP checks also inspect answer restoration and report totals. The local queue was in memory; distributed queue behavior was not established.',
    },
    ko: {
      invariant: '재전송한 학습 이벤트는 최초 답안을 유지하고 학생·기기별로 분리돼야 합니다. 집계는 저장이 성공적으로 커밋된 뒤에만 시작해야 합니다.',
      steps: [
        { title: '버전 2 퀴즈 계약 검증', detail: '버전 2 단어 퀴즈 완료 이벤트에서 응답한 전체 문항 목록, 식별자 중복과 전체·정답 수 및 오답 기록의 일치 여부를 검사합니다. 버전 1의 계약은 별도로 유지합니다.' },
        { title: '학생·기기별로 재전송 구분', detail: 'DB에서 (student_id, device_id, idempotency_key) 조합을 고유하게 유지합니다. 재전송은 최초 내용을 덮어쓰지 않으며, 다른 학생이나 기기는 같은 키로 자신의 이벤트를 제출할 수 있습니다.' },
        { title: '커밋 이후에만 집계 요청', detail: '이벤트를 저장하고 트랜잭션 커밋 이후에 집계를 요청합니다. 롤백됐다면 존재하지 않는 이벤트를 집계하는 작업도 시작하지 않아야 합니다.' },
        { title: '답안 복원과 리포트 접근 제어', detail: '동기화로 퀴즈 답안과 개인 단어 변경을 복원합니다. 학부모 리포트는 별도로 부모 인증, 활성 자녀 연결과 CHILD_REPORTS 기능 권한을 모두 검사합니다.' },
      ],
      checks: [
        ['같은 기기가 답안을 바꿔 동일 이벤트 재전송', '학습 근거가 교체되지 않도록 최초에 수락한 답안을 유지합니다.'],
        ['다른 학생이나 기기가 같은 이벤트 키 사용', '별개의 범위로 처리해 정상 제출을 중복으로 누락하지 않습니다.'],
        ['DB 트랜잭션을 강제로 롤백', '커밋되지 않은 이벤트의 집계를 요청하지 않습니다.'],
      ],
      scope: '저장소 테스트로 재전송과 롤백 조건을 검사하며, 로컬 HTTP 기록은 답안 복원과 리포트 집계도 확인합니다. 로컬 큐는 메모리 기반이었으므로 분산 큐의 동작까지 검증한 결과는 아닙니다.',
    },
  },
  {
    project: 'quant-research',
    en: {
      invariant: 'A test result must exercise the actual validation path and fail when a targeted safeguard is deliberately broken.',
      steps: [
        { title: 'Trace what the old runner executed', detail: 'Review the runner behind the 5,000-pass report. It did not call the validators it claimed to exercise, so its counter could rise without testing the relevant behavior.' },
        { title: 'Exercise the public API and CLI', detail: 'Run the real validation entry points, including cases that read actual files. This ties the result to executable input handling rather than a success counter detached from the implementation.' },
        { title: 'Establish a passing baseline', detail: 'Run the repaired suite against the unchanged implementation before injecting defects. A baseline failure cannot be counted as evidence that a mutation was detected.' },
        { title: 'Challenge the safeguards', detail: 'Introduce nine defined mutations into protection logic and check that the corresponding tests fail. Record both the baseline and mutation outcomes so the checks can be distinguished.' },
      ],
      checks: [
        ['The normal implementation runs through API and CLI tests', 'The archived Linux suite passes 79 tests without skips, including two real-file cases.'],
        ['A defined defect is injected into a safeguard', 'The relevant tests fail; all nine recorded mutations were detected.'],
        ['Validation receives real files', 'Run the two recorded file-based cases through the actual validation path without skipping them.'],
      ],
      scope: 'These are archived Linux verification results from the research repair. Mac verification was incomplete, and no trading performance or backtest result is established by these checks.',
    },
    ko: {
      invariant: '검증 결과는 실제 데이터 검사 경로를 실행한 것이어야 하며, 특정 보호 로직을 의도적으로 망가뜨리면 테스트가 실패해야 합니다.',
      steps: [
        { title: '기존 실행기가 무엇을 호출하는지 추적', detail: '5,000회 통과 보고를 만든 실행기를 확인했습니다. 대상 검증 함수를 호출하지 않아 실제 동작을 검사하지 않고도 통과 횟수가 증가할 수 있었습니다.' },
        { title: '실제 API와 CLI 진입점 실행', detail: '실제 파일을 읽는 사례를 포함해 공개 API와 CLI의 검증 진입점을 실행합니다. 구현과 분리된 성공 카운터 대신 실행 가능한 입력 처리에 결과를 연결했습니다.' },
        { title: '정상 코드의 통과 여부 먼저 확인', detail: '결함을 주입하기 전에 수정하지 않은 구현에서 개선된 테스트가 통과하는지 검사합니다. 원래부터 실패하던 테스트를 결함 탐지 근거로 세지 않기 위한 단계입니다.' },
        { title: '보호 로직에 결함을 넣어 탐지 확인', detail: '정의한 변이 9개를 보호 로직에 적용하고 해당 테스트가 실패하는지 검사합니다. 정상 코드와 변이 코드의 결과를 구분해 기록했습니다.' },
      ],
      checks: [
        ['정상 구현을 API·CLI 테스트로 실행', '보관된 Linux 결과에서 실제 파일 사례 2개를 포함한 79개 테스트가 생략 없이 통과했습니다.'],
        ['보호 로직에 정의한 결함 주입', '관련 테스트가 실패해야 하며, 기록된 변이 9개를 모두 탐지했습니다.'],
        ['검증 경로에 실제 파일 입력', '기록된 파일 기반 사례 2개를 생략하지 않고 실제 검사 경로로 실행합니다.'],
      ],
      scope: '연구 도구 개선 당시 보관한 Linux 실행 기록입니다. Mac 검증은 미완료였으며 이 검사로 투자 성과나 백테스트 결과를 입증하지는 않습니다.',
    },
  },
];
