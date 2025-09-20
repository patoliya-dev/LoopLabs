import os
import io
import tempfile
import logging
from typing import Optional, Union
from fastapi import HTTPException
from TTS.api import TTS
import torch
import torchaudio
from pydub import AudioSegment
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TTSService:
    """
    A reusable Text-to-Speech service that provides high-quality, natural-sounding audio generation.
    Supports multiple languages and voice models optimized for different use cases.
    """
    
    def __init__(self):
        self.models = {}
        self.default_model = None
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize TTS models with natural-sounding voices"""
        try:
            # Use GPU if available for faster processing
            device = "cuda" if torch.cuda.is_available() else "cpu"
            logger.info(f"Using device: {device}")
            
            # High-quality English model - VITS is more natural than Tacotron2
            self.models['en'] = TTS(
                model_name="tts_models/en/ljspeech/vits", 
                progress_bar=False, 
                gpu=torch.cuda.is_available()
            )
            
            # Multilingual model for other languages
            self.models['multilingual'] = TTS(
                model_name="tts_models/multilingual/multi-dataset/xtts_v2",
                progress_bar=False,
                gpu=torch.cuda.is_available()
            )
            
            self.default_model = self.models['en']
            logger.info("TTS models initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize TTS models: {e}")
            # Fallback to simpler model if advanced models fail
            try:
                self.models['en'] = TTS(
                    model_name="tts_models/en/ljspeech/tacotron2-DDC",
                    progress_bar=False,
                    gpu=False
                )
                self.default_model = self.models['en']
                logger.info("Fallback TTS model initialized")
            except Exception as fallback_error:
                logger.error(f"Failed to initialize fallback model: {fallback_error}")
                raise HTTPException(status_code=500, detail="Failed to initialize TTS service")
    
    def text_to_audio_bytes(
        self, 
        text: str, 
        language: str = "en",
        voice_speed: float = 1.0,
        format: str = "mp3"
    ) -> bytes:
        """
        Convert text to audio bytes for streaming.
        
        Args:
            text: The text to convert to speech
            language: Language code (en, es, fr, de, etc.)
            voice_speed: Speech speed (0.5 to 2.0, where 1.0 is normal)
            format: Output format ('mp3', 'wav', 'ogg')
        
        Returns:
            Audio data as bytes
        """
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        try:
            # Select appropriate model
            model = self._get_model_for_language(language)
            
            # Generate audio to temporary file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_path = temp_file.name
                
                # Generate TTS
                if language == "en" or model == self.models['en']:
                    model.tts_to_file(text=text, file_path=temp_path)
                else:
                    # For multilingual model, we might need speaker info
                    model.tts_to_file(
                        text=text,
                        file_path=temp_path,
                        language=language
                    )
                
                # Load and process audio
                audio_bytes = self._process_audio_file(temp_path, voice_speed, format)
                
                # Clean up temporary file
                os.unlink(temp_path)
                
                return audio_bytes
                
        except Exception as e:
            logger.error(f"TTS generation failed: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to generate speech: {str(e)}")
    
    def _get_model_for_language(self, language: str) -> TTS:
        """Get the appropriate TTS model for the given language"""
        if language == "en":
            return self.models['en']
        else:
            # Use multilingual model for non-English languages
            return self.models.get('multilingual', self.models['en'])
    
    def _process_audio_file(
        self, 
        file_path: str, 
        speed: float, 
        output_format: str
    ) -> bytes:
        """
        Process audio file to adjust speed and convert format.
        
        Args:
            file_path: Path to the audio file
            speed: Speed adjustment factor
            output_format: Desired output format
        
        Returns:
            Processed audio as bytes
        """
        try:
            # Load audio with pydub
            audio = AudioSegment.from_wav(file_path)
            
            # Adjust speed while preserving pitch
            if speed != 1.0:
                # Speed up/slow down audio
                audio = audio._spawn(audio.raw_data, overrides={
                    "frame_rate": int(audio.frame_rate * speed)
                })
                # Resample to original frame rate to maintain pitch
                audio = audio.set_frame_rate(audio.frame_rate)
            
            # Normalize audio levels for consistent volume
            audio = audio.normalize()
            
            # Apply light compression for better quality
            audio = audio.compress_dynamic_range()
            
            # Convert to desired format
            buffer = io.BytesIO()
            
            if output_format.lower() == "mp3":
                audio.export(buffer, format="mp3", bitrate="128k")
            elif output_format.lower() == "ogg":
                audio.export(buffer, format="ogg", codec="libvorbis")
            else:  # Default to WAV
                audio.export(buffer, format="wav")
            
            return buffer.getvalue()
            
        except Exception as e:
            logger.error(f"Audio processing failed: {e}")
            # Fallback: return original file as bytes
            with open(file_path, 'rb') as f:
                return f.read()
    
    def get_supported_languages(self) -> list:
        """Return list of supported languages"""
        return [
            "en",  # English
            "es",  # Spanish  
            "fr",  # French
            "de",  # German
            "it",  # Italian
            "pt",  # Portuguese
            "ru",  # Russian
            "zh",  # Chinese
            "ja",  # Japanese
            "ko",  # Korean
        ]
    
    def health_check(self) -> dict:
        """Check if TTS service is healthy"""
        try:
            # Try a simple TTS operation
            test_text = "Health check"
            with tempfile.NamedTemporaryFile(suffix=".wav") as temp_file:
                self.default_model.tts_to_file(text=test_text, file_path=temp_file.name)
                return {"status": "healthy", "models_loaded": len(self.models)}
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {"status": "unhealthy", "error": str(e)}

# Global TTS service instance
tts_service = TTSService()