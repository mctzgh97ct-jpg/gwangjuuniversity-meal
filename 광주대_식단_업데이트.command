#!/bin/zsh
cd "$(dirname "$0")"

echo ""
echo "광주대학교 식단 데이터를 업데이트합니다."
echo ""

if [ ! -d ".venv" ]; then
  echo "처음 실행이라 필요한 환경을 준비합니다."
  python3 -m venv .venv || exit 1
fi

source .venv/bin/activate

python -m pip install -q -r updater-requirements.txt || exit 1
python update_menu.py
RESULT=$?

echo ""
if [ $RESULT -eq 0 ]; then
  echo "완료되었습니다."
  echo "이 폴더의 menu.json 파일을 GitHub에 업로드하면 공개 사이트가 갱신됩니다."
  open .
else
  echo "업데이트 중 오류가 발생했습니다."
fi

echo ""
read -k 1 "?아무 키나 누르면 창을 닫습니다."
echo ""
exit $RESULT
