# 광주대학교 오늘의 학식 — 수정본

광주대학교 공식 `진월광장 > 식당메뉴` 게시판의 최신 글과 엑셀 첨부파일을 읽어
날짜별 학생정식을 보여주는 바이브 코딩 연습 프로젝트입니다.

## 실행

이미 `.venv`를 만들어 사용하던 경우:

```bash
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

새 폴더에서 처음 실행하는 경우:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

브라우저에서 아래 주소를 엽니다.

```text
http://127.0.0.1:5000
```

## 이번 수정 내용

- 게시글 제목 문구에만 의존하지 않고 `bs_idx` 기준으로 최신 식당메뉴 글 탐색
- 첨부 엑셀 자동 탐색
- 게시글 제목의 주간 날짜 범위 분석
- 학생정식 영역을 찾아 날짜별 메뉴 데이터로 변환
- 날짜 탭으로 월~금 메뉴 전환
- 오늘 메뉴가 있으면 오늘을 우선 선택하고, 없으면 다음 이용 가능한 날짜 선택
- 데이터가 없거나 형식이 달라도 JavaScript `undefined.length` 오류가 나지 않도록 방어 처리
- 원본 엑셀 표 대신 실제 사용자용 메뉴 카드 표시

학교 엑셀 양식이 크게 바뀌면 `/api/latest`의 `debug_rows`를 통해 원본 셀 구조를 확인할 수 있습니다.
