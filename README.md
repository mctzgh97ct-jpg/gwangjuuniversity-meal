# 광주대학교 오늘의 학식 — 공유용 안정 버전

이 버전은 공개 사이트가 광주대학교 홈페이지를 직접 크롤링하지 않습니다.

구조:
1. 내 Mac에서 `광주대_식단_업데이트.command`를 실행
2. 광주대학교 공식 식단을 읽어 `menu.json` 생성
3. GitHub에 `menu.json`을 업로드
4. GitHub Pages가 학생정식/푸드단품을 공개

## 처음 한 번: 식단 데이터 만들기

1. 이 폴더를 Mac에 둡니다.
2. `광주대_식단_업데이트.command`를 더블클릭합니다.
3. 보안 경고가 뜨면 Finder에서 파일을 우클릭 → 열기.
4. 성공하면 같은 폴더의 `menu.json`이 최신 식단으로 바뀝니다.

## GitHub에 올릴 파일

공개 저장소 최상단에 다음 파일을 올립니다.

- index.html
- style.css
- app.js
- menu.json
- .nojekyll

`update_menu.py`, `.command`, `updater-requirements.txt`, `.venv`는 공개 사이트 실행에는 필요하지 않습니다.
관리용으로 저장소에 함께 보관해도 되지만 `.venv`는 올리지 마세요.

## GitHub Pages 켜기

Repository → Settings → Pages

- Source: Deploy from a branch
- Branch: main
- Folder: /(root)
- Save

잠시 뒤 `https://사용자이름.github.io/저장소이름/` 형태의 공개 주소가 생깁니다.

## 이후 매주 업데이트

1. `광주대_식단_업데이트.command` 더블클릭
2. 새로 생성된 `menu.json` 하나만 GitHub에 업로드
3. Commit changes
4. 잠시 뒤 같은 GitHub Pages 주소에 새 메뉴가 반영됩니다.

Render는 이 버전에서는 필요하지 않습니다.
