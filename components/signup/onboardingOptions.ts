export const SUBJECT_OPTIONS = [
  "React",
  "React Native",
  "Spring",
  "데이터베이스",
  "안드로이드 앱",
  "iOS 앱",
  "Python",
  "C 언어",
  "아두이노/라즈베리파이",
  "JAVA",
  "웹 기초",
  "블록코딩",
];

/**
 * 프론트엔드 옵션 문자열을 DB의 실제 과목 ID로 매핑
 * DB 테이블 기준:
 * 1: 웹 개발
 * 2: 안드로이드 앱
 * 3: IOS 앱
 * 4: React Native
 * 5: 파이썬
 * 6: JAVA / Spring
 * 7: C언어
 * 8: HTML/CSS/Java Script
 * 9: 데이터베이스
 * 10: 아두이노/라즈베리파이
 * 11: 블록코딩
 */
export const SUBJECT_ID_MAP: Record<string, number> = {
  "웹 기초": 1, // 웹 개발
  "React": 8, // HTML/CSS/Java Script
  "안드로이드 앱": 2,
  "iOS 앱": 3,
  "React Native": 4,
  "Python": 5, // 파이썬
  "JAVA": 6, // JAVA / Spring
  "Spring": 6, // JAVA / Spring
  "C 언어": 7, // C언어
  "데이터베이스": 9, // 데이터베이스
  "아두이노/라즈베리파이": 10,
  "블록코딩": 11,
};

export const PURPOSE_OPTIONS = ["취미/자기개발", "취업준비", "공모전/프로젝트", "학업관련", "기타"];

/**
 * 프론트엔드 옵션 문자열을 DB의 실제 목적 ID로 매핑
 * DB 테이블 기준:
 * 1: 취미/자기개발
 * 2: 취업 준비
 * 3: 공모전/프로젝트
 * 4: 학업관련
 * 5: 기타
 */
export const PURPOSE_ID_MAP: Record<string, number> = {
  "취미/자기개발": 1,
  "취업준비": 2, // 취업 준비
  "공모전/프로젝트": 3, // 공모전/프로젝트
  "학업관련": 4,
  "기타": 5,
};

export const LEVEL_OPTIONS = ["관련 지식 없음", "기초 언어만 앎", "기본 활용 가능", "실무 활용 가능", "기타"];

/**
 * 프론트엔드 옵션 문자열을 DB의 실제 레벨 ID로 매핑
 * DB 테이블 기준:
 * 1: 관련지식 없음
 * 2: 기본 언어만 안다
 * 3: 어느정도 활용 가능
 * 4: 실무활용 가능
 * 5: 기타
 */
export const LEVEL_ID_MAP: Record<string, number> = {
  "관련 지식 없음": 1, // 관련지식 없음
  "기초 언어만 앎": 2, // 기본 언어만 안다
  "기본 활용 가능": 3, // 어느정도 활용 가능
  "실무 활용 가능": 4, // 실무활용 가능
  "기타": 5,
};

export const METHOD_OPTIONS = ["개인 과외", "그룹 과외", "온라인 과외", "무관"];

/**
 * 프론트엔드 옵션 문자열을 DB의 실제 수업 방식 ID로 매핑
 * DB 테이블 기준 (lesson_types):
 * 1: 개인과외
 * 2: 그룹과외
 * 3: 온라인 과외
 * 4: 무관
 */
export const LESSON_TYPE_ID_MAP: Record<string, number> = {
  "개인 과외": 1, // 개인과외
  "그룹 과외": 2, // 그룹과외
  "온라인 과외": 3, // 온라인 과외
  "무관": 4,
};

export const DAY_OPTIONS = ["월", "화", "수", "목", "금", "토", "일"];

export const TIME_OPTIONS = ["이른 오전(05~07시)", "오전(08~ 11시)", "오후(12~14시)", "늦은 오후(15~17시)", "저녁(18~20시)", "밤(21~23시)"];

/**
 * 프론트엔드 옵션 문자열을 DB의 실제 시간대 ID로 매핑
 * DB 테이블 기준 (time_band):
 * 1: 이른 오전
 * 2: 오전
 * 3: 오후
 * 4: 늦은 오후
 * 5: 저녁
 * 6: 늦은 저녁
 */
export const TIME_BAND_ID_MAP: Record<string, number> = {
  "이른 오전(05~07시)": 1, // 이른 오전
  "오전(08~ 11시)": 2, // 오전
  "오후(12~14시)": 3, // 오후
  "늦은 오후(15~17시)": 4, // 늦은 오후
  "저녁(18~20시)": 5, // 저녁
  "밤(21~23시)": 6, // 늦은 저녁
};
