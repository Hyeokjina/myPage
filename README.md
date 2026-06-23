# 인천 여행지 소개

인천을 중심으로 국내 주요 여행지를 소개하는 **순수 HTML/CSS/JS 정적 웹사이트**입니다.  
백엔드 없이 `localStorage`만으로 즐겨찾기, 여행 플래너, 후기 등 다양한 기능을 구현했습니다.

---

## 페이지 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 메인 홈 — 검색, 대표 여행지, 인기 지역, 여행 팁, 숙소 세일, 최근 본 여행지 |
| `about.html` | 인천 소개 — 차이나타운, 송도, 월미도 등 명소 상세 정보 |
| `regions.html` | 인기 지역 목록 — 테마 필터(역사·자연·해변·도시) |
| `seoul.html` | 서울 — 경복궁, N서울타워, 명동, 홍대 등 |
| `busan.html` | 부산 — 해운대, 감천문화마을, 자갈치시장 등 |
| `jeju.html` | 제주 — 한라산, 성산일출봉, 협재해수욕장 등 |
| `gangwon.html` | 강원 — 설악산, 정동진, 춘천 의암호 등 |
| `gyeongju.html` | 경주 — 불국사, 첨성대, 동궁과 월지 등 |
| `lodging.html` | 숙소 세일 — 지역·가격 필터, 정렬, 즐겨찾기 |
| `reviews.html` | 여행 후기 — 작성·수정·삭제, 별점, 좋아요, 검색, 데이터 백업 |
| `planner.html` | 여행 플래너 — 일정 관리, D-day, 진행률, 체크리스트 |
| `contact.html` | 문의하기 — 실시간 유효성 검사, 글자수 카운터 |
| `404.html` | 404 에러 페이지 |

---

## 주요 기능

### 공통
- **다크모드** — OS 설정 자동 연동 + 수동 토글, 새로고침 후에도 유지
- **반응형 레이아웃** — 모바일 하단 탭바, 햄버거 메뉴
- **스크롤 애니메이션** — 카드가 화면에 들어올 때 부드럽게 등장
- **스크롤 진행률 바** — 상단에 읽기 진행도 표시
- **이미지 라이트박스** — 카드 이미지 클릭 시 전체화면 확대
- **페이지 공유** — Web Share API 활용 (지원 브라우저에서만 표시)
- **맨 위로 버튼** — 일정 스크롤 이상 시 노출

### 홈 (index.html)
- **검색 + 자동완성** — 여행지/숙소 이름 입력 시 후보 목록 표시
- **즐겨찾기** — 하트 버튼으로 찜, 헤더 배지에 개수 표시, 모달에서 목록 관리
- **최근 본 여행지** — 방문한 페이지 자동 기록, 뒤로가기 후에도 정상 표시

### 숙소 (lodging.html)
- 지역·가격대 필터 + 가격순 정렬
- 카드별 즐겨찾기(찜) + 헤더 배지 및 모달

### 후기 (reviews.html)
- 별점·지역·키워드 필터, 최신순/별점순 정렬
- 후기 작성·수정·삭제·좋아요
- JSON 파일로 데이터 내보내기/가져오기

### 여행 플래너 (planner.html)
- 여행 플랜 생성·수정·삭제 (이름, 날짜 범위)
- D-day 배지 및 일정 완료율 진행 바
- 일정 카드 — 날짜·시간·장소·카테고리·메모, 드래그로 순서 변경
- 날짜별 타임라인 그룹핑
- 준비물 체크리스트 (기본 항목 제공, 직접 추가 가능)
- 일정 클립보드 복사 / 인쇄

---

## 데이터 저장 방식

백엔드 없이 브라우저 **`localStorage`** 에만 저장합니다.

| 키 | 저장 내용 |
|----|-----------|
| `incheon_favorites` | 즐겨찾기 목록 |
| `recently_viewed` | 최근 본 여행지 (최대 5개) |
| `travel_plans` | 여행 플랜 목록 |
| `travel_schedules` | 플랜별 일정 |
| `travel_checklists` | 플랜별 체크리스트 |
| `travel_reviews` | 여행 후기 목록 |
| `review_liked_ids` | 좋아요 누른 후기 ID |
| `dark` | 다크모드 설정값 |

---

## 기술 스택

- **HTML5 / CSS3 / Vanilla JavaScript (ES6+)**
- **Pretendard Variable** — 웹폰트 (CDN)
- 별도 프레임워크, 빌드 도구, 백엔드 없음

---

## 파일 구조

```
mypage/
├── index.html
├── about.html
├── regions.html
├── seoul.html / busan.html / jeju.html / gangwon.html / gyeongju.html
├── lodging.html
├── reviews.html
├── planner.html
├── contact.html
├── 404.html
├── css/
│   ├── common.css       # 공통 스타일 (헤더, 푸터, 다크모드, 모달 등)
│   ├── index.css
│   ├── about.css
│   ├── region-detail.css
│   ├── regions.css
│   ├── lodging.css
│   ├── reviews.css
│   ├── planner.css
│   └── contact.css
├── js/
│   ├── common.js        # 공통 동작 (다크모드, 네비, 라이트박스, 최근 본 여행지 등)
│   ├── index.js
│   ├── about.js
│   ├── region-detail.js
│   ├── regions.js
│   ├── lodging.js
│   ├── reviews.js
│   ├── planner.js
│   └── contact.js
├── images/              # 여행지 이미지
└── icon/                # 로고, SNS, 검색 아이콘
```
