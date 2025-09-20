# LoopLabs

## When opening a new terminal for python, this is the most important command
source venv/bin/activate

## For installing any package
pip install -r requirements.txt
pip freeze > requirements.txt

## Execute python
uvicorn main:app --reload

## Install whisper
cd my_project
git clone https://github.com/ggerganov/whisper.cpp whisper
cd whisper
make

./models/download-ggml-model.sh small
