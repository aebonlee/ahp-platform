# 백업 정보 - AHP Research Platform

## 백업 상세 정보

### 📅 백업 일시
- **생성일**: 2025-08-30 01:27:43
- **백업 파일**: ahp-platform-v2.2.0-20250830-0127.tar.gz

### 📊 백업 시점 상태
- **버전**: 2.2.0
- **최신 커밋**: 603bb14 - refactor: 공통 CSS 디자인 시스템 통일
- **브랜치**: main
- **상태**: Clean (uncommitted changes 없음)

### 📁 백업 내용
- ✅ 전체 소스 코드 (src/)
- ✅ 백엔드 소스 (backend/src/)
- ✅ 설정 파일 (package.json, tsconfig.json 등)
- ✅ 문서 (docs/, *.md 파일)
- ✅ 공개 자산 (public/)
- ❌ node_modules (제외)
- ❌ 빌드 결과물 (build/, dist/ 제외)
- ❌ Git 히스토리 (.git 제외)

### 🔄 복구 방법

#### 1. 백업 파일 압축 해제
```bash
tar -xzf ahp-platform-v2.2.0-20250830-0127.tar.gz -C /target/directory
```

#### 2. 의존성 재설치
```bash
# Frontend 의존성
npm install

# Backend 의존성
cd backend && npm install
```

#### 3. 빌드
```bash
# Frontend 빌드
npm run build:frontend

# Backend 빌드
npm run backend:build
```

### ⚠️ 주의사항

#### 보안 취약점
백업 시점에 다음 보안 취약점이 존재했습니다:
- xlsx 라이브러리 취약점
- react-scripts 의존성 취약점
복구 후 `npm audit fix` 실행을 권장합니다.

#### 환경 변수
다음 환경 변수 설정이 필요합니다:
- JWT_SECRET (백엔드)
- DATABASE_URL (PostgreSQL 연결)
- 기타 .env 파일 설정

### 📝 검수 보고서
상세한 프로젝트 상태는 `INSPECTION_REPORT_2025-08-30.md` 파일을 참조하세요.

### 🏷️ 태그
- 백업 유형: Full Backup
- 목적: 정기 검수 및 기점 생성
- 안정성: Stable (테스트 완료)
- 우선순위: High (최신 안정 버전)

---
*Generated at: 2025-08-30 01:27:43*
*By: Claude Code AI Assistant*