export const capabilities = [
  { project: 'placia', anchor: 'session-rotation', en: { title: 'Authentication & session lifecycle', detail: 'Refresh-token rotation, reuse detection, session-family revocation, and expiry checks.' }, ko: { title: '인증과 세션 생명주기', detail: '갱신 토큰 교체, 재사용 탐지, 세션 계열 폐기와 만료 조건을 다룹니다.' } },
  { project: 'placia', anchor: 'implementation', en: { title: 'Transactions & concurrency', detail: 'Atomic registration, ordered locks, database constraints, and concurrent request tests.' }, ko: { title: '트랜잭션과 동시성 제어', detail: '등록 절차의 원자성, 잠금 순서, DB 제약과 동시 요청을 검증합니다.' } },
  { project: 'resol-routine', anchor: 'report-authorization', en: { title: 'Authorization & data isolation', detail: 'Account ownership, active relationships, feature entitlements, and access revocation.' }, ko: { title: '인가와 데이터 접근 분리', detail: '계정 소유권, 유효한 가족 관계, 기능 이용 권한과 접근 폐기를 확인합니다.' } },
  { project: 'resol-routine', anchor: 'event-ingestion', en: { title: 'Idempotency & event processing', detail: 'Account/device-scoped event keys, immutable replays, and aggregation after commit.' }, ko: { title: '멱등성과 이벤트 처리', detail: '계정·기기별 이벤트 키, 재전송 데이터의 불변성과 커밋 후 집계를 다룹니다.' } },
  { project: 'whiskory', anchor: 'recommendation-quota', en: { title: 'API security & resource controls', detail: 'Route allowlists, environment isolation, transactional quotas, and privacy rechecks.' }, ko: { title: 'API 보안과 자원 사용 제어', detail: '허용 경로, 환경 분리, 트랜잭션 기반 할당량과 공개 권한 재검사를 구현합니다.' } },
  { project: 'quant-research', anchor: 'implementation', en: { title: 'Validation & test reliability', detail: 'Strict data contracts, real API/CLI execution, and mutation tests that challenge safeguards.' }, ko: { title: '입력 검증과 테스트 신뢰성', detail: '명확한 데이터 계약, 실제 API·CLI 실행과 변이 테스트로 보호 로직을 확인합니다.' } },
];

export const investigations = [
  {
    project: 'placia', id: 'session-rotation',
    en: {
      title: 'Refresh-token rotation and replay containment',
      scenario: 'A previously used refresh token must not continue a session or leave its newer descendants usable.',
      solution: 'Store purpose-separated token digests and rotate refresh tokens inside a PostgreSQL transaction. Reuse revokes the session family. Lock ordering and database-time checks account for expiry while requests wait.',
      check: 'PostgreSQL integration cases cover 12 concurrent refreshes, descendant revocation, unrelated-session isolation, and absolute expiry. Strict replay rejection can also end a session when legitimate refresh requests overlap.',
    },
    ko: {
      title: '갱신 토큰 교체와 재사용 영향 제한',
      scenario: '이미 사용한 갱신 토큰으로 세션을 연장하거나 이후 발급된 세션을 계속 사용할 수 없도록 해야 합니다.',
      solution: '토큰 원문 대신 용도를 구분한 다이제스트를 저장하고 PostgreSQL 트랜잭션에서 토큰을 교체합니다. 이전 토큰을 다시 쓰면 같은 세션 계열을 폐기합니다. 잠금 순서와 DB 시간을 기준으로 대기 중 만료도 반영합니다.',
      check: 'PostgreSQL 통합 테스트는 동시 갱신 12건, 후속 세션 폐기, 다른 세션과의 분리, 최대 수명을 검증합니다. 재사용을 엄격히 거부하므로 정상 갱신 요청이 겹쳐도 해당 세션이 종료될 수 있습니다.',
    },
  },
  {
    project: 'placia', id: 'encrypted-retry',
    en: {
      title: 'Encrypted retry responses bound to approval state',
      scenario: 'Retrying an authentication request must not expose credentials issued under a different approval state or restore a revoked session.',
      solution: 'Encrypt replies with AES-256-GCM, fresh nonces, and authenticated request bindings. Separate pending and approved request digests. Exact approved retries can recover only an existing live session.',
      check: 'Tests modify request bindings and ciphertext bytes, race 12 approved retries, and reject restoration after rotation, logout, revocation, or account blocking. This is server-side encryption; production key operations remain a separate concern.',
    },
    ko: {
      title: '승인 상태에 연결한 암호화 재시도 응답',
      scenario: '인증 재시도가 다른 승인 상태에서 발급된 자격 증명을 노출하거나 폐기된 세션을 복원해서는 안 됩니다.',
      solution: '매번 새로운 nonce를 사용하는 AES-256-GCM으로 응답을 암호화하고 요청과의 연결 정보도 인증합니다. 승인 전후 요청의 다이제스트를 구분하며, 동일한 승인 요청에만 유효한 기존 세션을 반환합니다.',
      check: '요청 연결 정보와 암호문 바이트의 변조, 승인 요청 12건의 동시 재시도, 토큰 교체·로그아웃·폐기·계정 차단 이후의 복원 거부를 검사합니다. 서버 측 암호화이며 운영 암호화 키 관리는 별도의 작업입니다.',
    },
  },
  {
    project: 'placia', id: 'recovery-chain',
    en: {
      title: 'Recovery-root rotation with a verified chain',
      scenario: 'Recovery-key replacement must have one valid successor and must stop the former root from approving a new device.',
      solution: 'Require the next generation, the exact previous envelope hash, and the current root’s signature. Update the root and opaque recovery envelope in one transaction, preventing conflicting successors from both committing.',
      check: 'Service integration tests enroll and rotate records, simulate device loss, reject the old root, and approve a new device with the current root. Client-side decryption and physical-device recovery are outside these server tests.',
    },
    ko: {
      title: '서명 연결을 검증하는 복구 키 교체',
      scenario: '복구 키를 교체할 때는 유효한 다음 상태가 하나만 확정되고, 이전 키로 새 기기를 승인할 수 없어야 합니다.',
      solution: '세대가 정확히 하나 증가하는지, 직전 복구 자료의 해시와 현재 키의 서명이 일치하는지 확인합니다. 복구 키와 서버가 해독하지 않는 암호문 자료를 같은 트랜잭션에서 갱신해 상충하는 교체가 동시에 확정되지 않도록 합니다.',
      check: '서비스 통합 테스트에서 등록·교체 후 기기 분실을 모사하고, 이전 키의 승인은 거부하면서 현재 키로 새 기기를 승인합니다. 클라이언트 복호화와 실제 기기 복구는 이 서버 테스트의 범위 밖입니다.',
    },
  },
  {
    project: 'whiskory', id: 'recommendation-quota',
    en: {
      title: 'Transactional quotas for concurrent AI requests',
      scenario: 'Three overlapping recommendation requests must not bypass a two-attempt daily limit or leave usage reservations unfinished.',
      solution: 'Reserve usage in a Firestore transaction before invoking the provider and settle the reservation after completion. A failure after provider invocation still counts as an attempt; a failure before invocation releases the reservation.',
      check: 'Recorded staging requests returned two successes and one HTTP 429, with two charged attempts and zero pending reservations. Regression tests also verify that usage belonging to another AI feature is preserved.',
    },
    ko: {
      title: '동시 AI 요청의 사용량을 트랜잭션으로 제어',
      scenario: '추천 요청 세 건이 겹쳐도 하루 두 번의 시도 제한을 넘지 않고 미완료 예약이 남지 않아야 합니다.',
      solution: 'AI 공급자 호출 전에 Firestore 트랜잭션으로 사용량을 예약하고 완료 후 정산합니다. 공급자 호출 이후의 실패는 시도에 포함하며, 호출 전 실패에만 예약을 반환해 비용 계산 기준을 명확히 했습니다.',
      check: '기록된 스테이징 동시 요청에서는 두 건이 성공하고 한 건이 HTTP 429로 차단됐습니다. 사용량은 두 번, 남은 예약은 0개였으며 다른 AI 기능의 사용량을 보존하는 회귀 테스트도 있습니다.',
    },
  },
  {
    project: 'whiskory', id: 'privacy-consistency',
    en: {
      title: 'Consistent visibility checks inside a write transaction',
      scenario: 'Public pages and image-reporting endpoints were reading different profile representations. A privacy change could also occur between initial lookup and report submission.',
      solution: 'Use the canonical user document and the same public profile and bottle filters. Recheck those conditions inside the report transaction so a change to private visibility prevents the write.',
      check: 'Regression tests cover absent or stale mirror records, private or deleted bottles, and privacy withdrawal during submission. An identical report retry retains one report instead of increasing the count.',
    },
    ko: {
      title: '공개 권한을 저장 트랜잭션 안에서 재확인',
      scenario: '공개 화면과 이미지 신고 API가 서로 다른 프로필 자료를 참고했습니다. 최초 조회와 신고 저장 사이에 공개 설정이 바뀌는 상황도 처리해야 했습니다.',
      solution: '기준 사용자 문서와 동일한 공개 프로필·바틀 필터를 사용하도록 통일했습니다. 신고 저장 트랜잭션 안에서도 조건을 다시 검사해, 처리 중 비공개로 전환되면 저장을 거부합니다.',
      check: '복제 프로필이 없거나 오래된 경우, 비공개·삭제된 바틀, 제출 도중 공개 철회를 회귀 테스트로 확인합니다. 같은 신고를 재전송해도 신고 수가 중복 증가하지 않는 동작을 유지했습니다.',
    },
  },
  {
    project: 'whiskory', id: 'moderation-resilience',
    en: {
      title: 'Moderation workflows resilient to malformed display data',
      scenario: 'A malformed bottle name could interrupt the review queue or block action on an existing image report.',
      solution: 'Use a bounded fallback label for existing requests while preserving ownership, image identity, consent, and moderation-state validation. New publication requests still require a valid name. Keep the stored source value unchanged.',
      check: 'Regression tests cover pagination past affected records, review and withdrawal of existing requests, and removal of reported images. Separate tests continue to reject malformed new publication requests.',
    },
    ko: {
      title: '표시 데이터 오류에도 유지되는 관리자 심사',
      scenario: '잘못된 바틀 이름 하나로 심사 목록이 중단되거나 기존 이미지 신고의 제재가 막힐 수 있었습니다.',
      solution: '기존 요청에는 길이를 제한한 안전한 대체 이름을 표시하되 소유자, 이미지 식별, 동의와 심사 상태 검증을 유지합니다. 새 공개 요청에는 계속 유효한 이름을 요구하고, 저장된 원래 값은 변경하지 않습니다.',
      check: '문제가 있는 항목 이후의 페이지 조회, 기존 요청의 심사와 철회, 신고 이미지 제거를 회귀 테스트로 확인합니다. 잘못된 신규 공개 요청은 계속 거부하는지 별도로 검사합니다.',
    },
  },
  {
    project: 'resol-routine', id: 'event-ingestion',
    en: {
      title: 'Idempotent event ingestion and commit-aware aggregation',
      scenario: 'Offline retries can duplicate study events, replace earlier evidence, or suppress a legitimate submission from another device.',
      solution: 'Scope uniqueness to the authenticated student, device, and event key. Preserve the original payload on replay. Trigger aggregation only after the database transaction commits.',
      check: 'Repository tests cover matching keys across accounts and devices, modified replay payloads, duplicate-only batches, and forced rollback. Rollback must not dispatch aggregation. Recorded local checks used an in-memory queue.',
    },
    ko: {
      title: '멱등한 이벤트 수집과 커밋 이후 집계',
      scenario: '오프라인 재전송으로 학습 기록이 중복되거나 기존 답안이 바뀌고, 다른 기기의 정상 제출이 누락될 수 있습니다.',
      solution: '인증된 학생·기기·이벤트 키의 조합에 DB 고유 제약을 적용합니다. 재전송은 최초 내용을 덮어쓰지 않으며, 집계는 데이터베이스 트랜잭션이 커밋된 후 시작합니다.',
      check: '계정·기기 간 같은 키, 내용을 바꾼 재전송, 중복만 있는 요청과 강제 롤백을 테스트합니다. 롤백 시에는 집계를 요청하지 않아야 합니다. 기록된 로컬 검증은 메모리 기반 큐에서 수행됐습니다.',
    },
  },
  {
    project: 'resol-routine', id: 'report-authorization',
    en: {
      title: 'Relationship-aware authorization for parent reports',
      scenario: 'A subscription must not grant access to an unrelated student’s learning history.',
      solution: 'Check the authenticated parent’s active child relationship before resolving the CHILD_REPORTS entitlement. Access requires both the relationship and the feature; neither is sufficient on its own.',
      check: 'Tests cover a linked parent with the feature, a linked parent without it, and an unrelated subscriber. Further cases verify subscription expiry and the removal of entitlement sources after unlinking.',
    },
    ko: {
      title: '가족 연결과 이용 권한을 함께 확인하는 인가',
      scenario: '구독 중이라는 이유로 관계없는 학생의 학습 기록을 조회할 수 있어서는 안 됩니다.',
      solution: '인증된 부모와 해당 학생의 가족 연결이 유효한지 먼저 확인하고 CHILD_REPORTS 기능 권한을 검사합니다. 두 조건을 모두 만족해야 접근을 허용합니다.',
      check: '정상 연결과 기능 권한이 있는 부모, 연결은 있지만 권한이 없는 부모, 구독 중이지만 연결되지 않은 부모를 나눠 검사합니다. 구독 만료와 가족 연결 해제에 따른 권한 변경도 테스트합니다.',
    },
  },
  {
    project: 'resol-routine', id: 'account-deletion',
    en: {
      title: 'Account deletion with token revocation and child preservation',
      scenario: 'Deleting a parent account must remove its access without deleting the linked child’s account or leaving usable credentials behind.',
      solution: 'Require authentication and an active refresh token owned by the same account. Delete the account’s tokens and family links through database relationships. Retain only the role in the anonymized deletion audit.',
      check: 'Tests reject a mismatched token, preserve the child account, reject old access and refresh tokens, and permit registration with the freed email address.',
    },
    ko: {
      title: '접근 폐기와 자녀 보존을 포함한 계정 삭제',
      scenario: '부모 계정을 삭제할 때 해당 계정의 접근을 없애면서 연결된 자녀 계정은 보존하고, 사용할 수 있는 인증 정보가 남지 않도록 해야 합니다.',
      solution: '로그인 인증과 함께 같은 계정에 속한 활성 갱신 토큰을 요구합니다. DB 관계를 통해 계정의 토큰과 가족 연결을 삭제하며, 익명화한 삭제 감사 기록에는 역할만 남깁니다.',
      check: '잘못된 토큰의 거부, 자녀 계정 보존, 기존 접근·갱신 토큰의 거부와 삭제한 이메일의 재사용을 테스트합니다.',
    },
  },
];

export const projectFocus = {
  placia: { en: ['Atomic state transitions', 'Session rotation & replay defense', 'Encrypted recovery boundaries'], ko: ['원자적인 상태 변경', '세션 교체와 재사용 방어', '암호화 복구의 검증 경계'] },
  whiskory: { en: ['API environment isolation', 'Transactional usage quotas', 'Privacy-aware moderation'], ko: ['API 환경 분리', '트랜잭션 기반 사용량 제한', '공개 권한을 반영한 심사'] },
  'resol-routine': { en: ['Account/device idempotency', 'Relationship-based authorization', 'Deletion & access revocation'], ko: ['계정·기기별 멱등성', '관계 기반 인가', '계정 삭제와 접근 폐기'] },
  'quant-research': { en: ['Real API & CLI verification', 'Strict financial-data validation', 'Mutation testing'], ko: ['실제 API·CLI 검증', '금융 데이터 유효성 검사', '변이 테스트'] },
  'pack-job': { en: ['First-person interaction design', 'Item handling & utility', 'Implementation impact analysis'], ko: ['1인칭 상호작용 설계', '아이템 조작감과 역할', '구현 영향 분석'] },
  'resol-math': { en: ['Math learning prototype', 'Archived backend source', 'Preserved development records'], ko: ['수학 학습 프로토타입', '백엔드 소스 보관', '개발 기록 보존'] },
};
