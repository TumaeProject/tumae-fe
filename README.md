# 튜매 (Tumae) - 튜터와 학생이 만나는 곳

튜터와 학생을 연결하는 매칭 플랫폼입니다. Next.js 16과 React 19를 기반으로 구축되었습니다.

## 📋 목차

- [프로젝트 소개](#프로젝트-소개)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [주요 기능](#주요-기능)
- [API 엔드포인트](#api-엔드포인트)

## 🎯 프로젝트 소개

튜매는 튜터와 학생을 연결하는 매칭 플랫폼입니다. 학생은 자신에게 맞는 튜터를 찾을 수 있고, 튜터는 학생을 찾아 수업을 진행할 수 있습니다. 또한 커뮤니티 기능을 통해 학습자들 간의 정보 공유와 소통을 지원합니다.

## 🛠 기술 스택

- **프레임워크**: Next.js 16.0.1 (App Router)
- **언어**: TypeScript 5
- **UI 라이브러리**: React 19.2.0
- **스타일링**: Tailwind CSS 4
- **패키지 매니저**: pnpm
- **린터**: ESLint 9

## 📁 프로젝트 구조

```
tumae-fe/
├── app/                          # Next.js App Router 페이지 및 API 라우트
│   ├── api/                      # API 라우트 핸들러 (백엔드 프록시)
│   │   ├── auth/                 # 인증 관련 API
│   │   │   ├── login/            # 로그인 API
│   │   │   │   └── route.ts      # POST: 로그인 요청 처리
│   │   │   ├── logout/           # 로그아웃 API
│   │   │   │   └── route.ts      # POST: 로그아웃 요청 처리
│   │   │   ├── signup/           # 회원가입 API
│   │   │   │   └── route.ts      # POST: 회원가입 요청 처리
│   │   │   ├── students/         # 학생 상세 정보 API
│   │   │   │   └── details/
│   │   │   │       └── route.ts  # GET: 학생 상세 정보 조회
│   │   │   ├── tutors/           # 튜터 상세 정보 API
│   │   │   │   └── details/
│   │   │   │       └── route.ts  # GET: 튜터 상세 정보 조회
│   │   │   ├── users/            # 사용자 정보 API
│   │   │   │   └── [user_id]/
│   │   │   │       └── route.ts  # GET: 사용자 정보 조회
│   │   │   └── withdraw/         # 회원 탈퇴 API
│   │   ├── community/            # 커뮤니티 관련 API
│   │   │   ├── posts/            # 게시글 API
│   │   │   │   ├── route.ts      # GET: 게시글 목록, POST: 게시글 작성
│   │   │   │   └── [post_id]/    # 특정 게시글 API
│   │   │   │       ├── route.ts  # GET: 게시글 조회, PUT: 수정, DELETE: 삭제
│   │   │   │       └── answers/
│   │   │   │           └── route.ts # POST: 답변 작성
│   │   │   └── answers/           # 답변 API
│   │   │       └── [answer_id]/
│   │   │           └── accept/
│   │   │               └── route.ts # POST: 답변 채택
│   │   ├── messages/             # 쪽지 관련 API
│   │   │   ├── inbox/             # 받은 쪽지함
│   │   │   │   └── route.ts      # GET: 받은 쪽지 목록
│   │   │   ├── sent/              # 보낸 쪽지함
│   │   │   │   └── route.ts      # GET: 보낸 쪽지 목록
│   │   │   ├── send/              # 쪽지 보내기
│   │   │   │   └── route.ts      # POST: 쪽지 전송
│   │   │   ├── [message_id]/     # 특정 쪽지
│   │   │   │   └── route.ts      # GET: 쪽지 조회, DELETE: 삭제
│   │   │   └── thread/            # 쪽지 스레드
│   │   ├── resume/                # 이력서 관련 API
│   │   │   ├── [tutor_id]/       # 특정 튜터의 이력서
│   │   │   │   └── route.ts      # GET: 이력서 조회
│   │   │   └── block/             # 이력서 블록 관리
│   │   │       └── [block_id]/
│   │   │           └── route.ts  # PUT: 블록 수정, DELETE: 블록 삭제
│   │   ├── students/              # 학생 목록 API
│   │   │   ├── route.ts          # GET: 학생 목록 조회
│   │   │   └── [student_id]/
│   │   │       └── route.ts      # GET: 학생 상세 정보
│   │   └── tutors/                # 튜터 목록 API
│   │       ├── route.ts          # GET: 튜터 목록 조회
│   │       ├── [tutor_id]/
│   │       │   └── route.ts      # GET: 튜터 상세 정보
│   │       └── rankings/
│   │           └── best/
│   │               └── route.ts  # GET: 베스트 튜터 랭킹
│   ├── community/                 # 커뮤니티 페이지
│   │   ├── page.tsx              # 커뮤니티 메인 페이지 (게시글 목록)
│   │   ├── [id]/                 # 게시글 상세 페이지
│   │   │   └── page.tsx          # 게시글 상세 및 답변 목록
│   │   └── write/                # 게시글 작성 페이지
│   │       └── page.tsx          # 게시글 작성 폼
│   ├── login/                     # 로그인 페이지
│   │   └── page.tsx              # 로그인 폼 컴포넌트
│   ├── messages/                  # 쪽지 페이지
│   │   ├── page.tsx              # 쪽지함 메인 페이지
│   │   └── compose/              # 쪽지 작성 페이지
│   │       └── page.tsx          # 쪽지 작성 폼
│   ├── resume/                    # 이력서 페이지
│   │   ├── page.tsx              # 이력서 조회/수정 페이지 (튜터용)
│   │   └── write/                # 이력서 작성 페이지
│   │       └── page.tsx          # 이력서 블록 작성 폼
│   ├── settings/                  # 설정 페이지
│   │   └── page.tsx              # 사용자 설정 및 프로필 수정
│   ├── signup/                    # 회원가입 페이지
│   │   ├── page.tsx              # 회원가입 메인 페이지 (역할 선택)
│   │   ├── student/              # 학생 회원가입
│   │   │   └── page.tsx          # 학생 온보딩 폼
│   │   ├── tutor/                # 튜터 회원가입
│   │   │   └── page.tsx          # 튜터 온보딩 폼
│   │   └── complete/             # 회원가입 완료 페이지
│   │       └── page.tsx          # 가입 완료 안내
│   ├── students/                  # 학생 찾기 페이지
│   │   └── page.tsx              # 학생 목록 및 필터링
│   ├── tutors/                    # 튜터 찾기 페이지
│   │   └── page.tsx              # 튜터 목록 및 필터링
│   ├── page.tsx                   # 홈 페이지 (랜딩 페이지)
│   ├── layout.tsx                 # 루트 레이아웃 (전역 설정, Header 포함)
│   └── globals.css                # 전역 스타일
├── components/                    # 재사용 가능한 React 컴포넌트
│   ├── auth/                      # 인증 관련 컴포넌트
│   │   └── LoginForm.tsx         # 로그인 폼 컴포넌트
│   ├── common/                    # 공통 컴포넌트
│   │   └── Header.tsx            # 헤더 네비게이션 컴포넌트
│   ├── signup/                    # 회원가입 관련 컴포넌트
│   │   ├── FormInput.tsx         # 폼 입력 필드 컴포넌트
│   │   ├── FormTextarea.tsx      # 텍스트 영역 컴포넌트
│   │   ├── OnboardingForm.tsx    # 온보딩 폼 래퍼 컴포넌트
│   │   ├── onboardingOptions.ts  # 온보딩 옵션 상수 데이터
│   │   ├── RegionSelector.tsx    # 지역 선택 컴포넌트
│   │   ├── RoleSelector.tsx      # 역할 선택 컴포넌트
│   │   ├── SignUpForm.tsx        # 회원가입 메인 폼 컴포넌트
│   │   ├── StudentOnboardingForm.tsx # 학생 온보딩 폼
│   │   └── TutorOnboardingForm.tsx   # 튜터 온보딩 폼
│   ├── students/                  # 학생 관련 컴포넌트
│   │   ├── studentConstants.ts   # 학생 관련 상수 데이터
│   │   ├── StudentDetailModal.tsx # 학생 상세 정보 모달
│   │   └── StudentMatchCard.tsx  # 학생 매칭 카드 컴포넌트
│   └── tutors/                    # 튜터 관련 컴포넌트
│       ├── TutorDetailModal.tsx  # 튜터 상세 정보 모달
│       └── TutorMatchCard.tsx    # 튜터 매칭 카드 컴포넌트
├── lib/                           # 유틸리티 및 헬퍼 함수
│   └── api.ts                     # API URL 생성 및 기본 설정
├── public/                        # 정적 파일 (이미지, 아이콘 등)
│   ├── header/                    # 헤더 로고
│   │   └── header_logo.svg
│   └── signup/                    # 회원가입 관련 이미지
│       ├── signup_complete.svg
│       ├── signup_illustration.svg
│       ├── signup_student.svg
│       └── signup_tutor.svg
├── package.json                   # 프로젝트 의존성 및 스크립트
├── pnpm-lock.yaml                # pnpm 잠금 파일
├── tsconfig.json                  # TypeScript 설정
├── next.config.ts                 # Next.js 설정
├── eslint.config.mjs              # ESLint 설정
├── postcss.config.mjs             # PostCSS 설정 (Tailwind CSS)
└── README.md                      # 프로젝트 문서
```

## 🚀 설치 및 실행 방법

### 필수 요구사항

- **Node.js**: 18.0.0 이상
- **pnpm**: 8.0.0 이상 (또는 npm, yarn, bun)

### 설치 단계

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd tumae-fe
   ```

2. **의존성 설치**
   ```bash
   pnpm install
   ```

3. **개발 서버 실행**
   ```bash
   pnpm dev
   ```

4. **브라우저에서 확인**
   
   개발 서버가 시작되면 [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 프로덕션 빌드

1. **프로덕션 빌드 생성**
   ```bash
   pnpm build
   ```

2. **프로덕션 서버 실행**
   ```bash
   pnpm start
   ```

### 린트 실행

```bash
pnpm lint
```

## ✨ 주요 기능

### 1. 인증 시스템
- **회원가입**: 학생/튜터 역할 선택 및 온보딩
- **로그인/로그아웃**: JWT 토큰 기반 인증
- **사용자 정보 관리**: 프로필 수정 및 회원 탈퇴

### 2. 매칭 시스템
- **학생 찾기**: 튜터가 학생을 검색하고 매칭
- **튜터 찾기**: 학생이 튜터를 검색하고 매칭
- **상세 정보 조회**: 매칭 카드 클릭 시 상세 정보 모달 표시

### 3. 커뮤니티
- **게시글 작성/수정/삭제**: 질문 및 정보 공유
- **답변 시스템**: 게시글에 답변 작성 및 채택 기능
- **게시글 목록**: 필터링 및 정렬 기능

### 4. 쪽지 시스템
- **쪽지 전송**: 사용자 간 1:1 메시지 전송
- **받은 쪽지함**: 수신한 쪽지 목록 조회
- **보낸 쪽지함**: 발신한 쪽지 목록 조회

### 5. 이력서 관리 (튜터 전용)
- **이력서 작성**: 프로젝트, 경력, 자격증 등 블록 단위 작성
- **이력서 수정/삭제**: 블록별 수정 및 삭제
- **이력서 조회**: 공개 이력서 조회

### 6. 설정
- **프로필 수정**: 사용자 정보 및 프로필 사진 수정
- **계정 관리**: 비밀번호 변경 등

## 🔌 API 엔드포인트

### 인증 API
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/signup` - 회원가입

### 사용자 API
- `GET /api/auth/users/[user_id]` - 사용자 정보 조회
- `GET /api/auth/students/details` - 학생 상세 정보
- `GET /api/auth/tutors/details` - 튜터 상세 정보

### 학생/튜터 API
- `GET /api/students` - 학생 목록 조회
- `GET /api/students/[student_id]` - 학생 상세 정보
- `GET /api/tutors` - 튜터 목록 조회
- `GET /api/tutors/[tutor_id]` - 튜터 상세 정보
- `GET /api/tutors/rankings/best` - 베스트 튜터 랭킹

### 커뮤니티 API
- `GET /api/community/posts` - 게시글 목록
- `POST /api/community/posts` - 게시글 작성
- `GET /api/community/posts/[post_id]` - 게시글 조회
- `PUT /api/community/posts/[post_id]` - 게시글 수정
- `DELETE /api/community/posts/[post_id]` - 게시글 삭제
- `POST /api/community/posts/[post_id]/answers` - 답변 작성
- `POST /api/community/answers/[answer_id]/accept` - 답변 채택

### 쪽지 API
- `GET /api/messages/inbox` - 받은 쪽지 목록
- `GET /api/messages/sent` - 보낸 쪽지 목록
- `POST /api/messages/send` - 쪽지 전송
- `GET /api/messages/[message_id]` - 쪽지 조회
- `DELETE /api/messages/[message_id]` - 쪽지 삭제
- `GET /api/messages/thread` - 쪽지 스레드 조회

### 이력서 API
- `GET /api/resume/[tutor_id]` - 이력서 조회
- `PUT /api/resume/block/[block_id]` - 이력서 블록 수정
- `DELETE /api/resume/block/[block_id]` - 이력서 블록 삭제

## 📝 주요 파일 설명

### `lib/api.ts`
- API 기본 URL 설정 및 엔드포인트 URL 생성 유틸리티 함수
- 기본 API 서버 URL: `https://tumae-jeonga.onrender.com` (환경 변수 설정 불필요)

### `app/layout.tsx`
- Next.js 루트 레이아웃 컴포넌트
- 전역 스타일 및 폰트 설정
- Header 컴포넌트 포함

### `components/common/Header.tsx`
- 전역 네비게이션 헤더 컴포넌트
- 로그인 상태 관리 및 사용자 메뉴
- 로그아웃 기능 포함

### `app/page.tsx`
- 홈 페이지 (랜딩 페이지)
- 서비스 소개 및 주요 기능 안내
- 학생 찾기/튜터 찾기/커뮤니티 링크 제공

## 🐛 문제 해결

### 포트 3000이 이미 사용 중인 경우
```bash
# 다른 포트로 실행
pnpm dev -- -p 3001
```

### 의존성 설치 오류
```bash
# node_modules 및 잠금 파일 삭제 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 빌드 오류
```bash
# .next 폴더 삭제 후 재빌드
rm -rf .next
pnpm build
```

**참고**: 이 프로젝트는 백엔드 API 서버(`https://tumae-jeonga.onrender.com`)와 통신합니다. 백엔드 서버가 실행 중이어야 모든 기능이 정상적으로 작동합니다.
