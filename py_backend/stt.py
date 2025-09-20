import subprocess
from pathlib import Path

WHISPER_CPP_DIR = Path(__file__).parent / "whisper.cpp"
WHISPER_BINARY = WHISPER_CPP_DIR / "build/bin/whisper-cli"  # <-- use whisper-cli
MODEL_PATH = WHISPER_CPP_DIR / "models/ggml-small.bin"

def speech_to_text(audio_file: str) -> str:
    """
    Convert audio to text using whisper.cpp small model.
    :param audio_file: Path to .wav or .mp3 file
    :return: Transcribed text
    """
    audio_file_path = Path(audio_file)
    if not audio_file_path.exists():
        raise FileNotFoundError(f"{audio_file} not found")
    
    cmd = [
    str(WHISPER_BINARY),
    "-m", str(MODEL_PATH),
    "-f", str(audio_file_path),
    "-otxt",           # write plain text file
    "--no-timestamps"  # 🚨 add this line to suppress timestamps
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        # whisper-cli prints transcription to stdout
        transcription = result.stdout.strip()
        return transcription
    except subprocess.CalledProcessError as e:
        print("Whisper subprocess error:", e.stderr)
        return ""
