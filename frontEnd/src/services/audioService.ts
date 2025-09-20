import type { AudioRecordingState, AudioPlaybackState } from "../types/chat";

type AudioEventHandler = (
  state: AudioRecordingState | AudioPlaybackState
) => void;

class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingState: AudioRecordingState = {
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0,
  };
  private playbackState: AudioPlaybackState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    messageId: "",
  };
  private currentAudio: HTMLAudioElement | null = null;
  private animationFrame: number | null = null;
  private recordingStartTime: number = 0;
  private onRecordingStateChange?: AudioEventHandler;
  private onPlaybackStateChange?: AudioEventHandler;

  // Set event handlers
  setRecordingStateHandler(handler: AudioEventHandler): void {
    this.onRecordingStateChange = handler;
  }

  setPlaybackStateHandler(handler: AudioEventHandler): void {
    this.onPlaybackStateChange = handler;
  }

  // Request microphone permissions
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      return false;
    }
  }

  // Start recording
  async startRecording(): Promise<void> {
    try {
      if (this.recordingState.isRecording) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      this.audioChunks = [];
      this.recordingStartTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        this.updateRecordingState({
          isRecording: false,
          isPaused: false,
          duration: 0,
          audioLevel: 0,
        });
      };

      this.mediaRecorder.start(100); // Collect data every 100ms

      this.updateRecordingState({
        isRecording: true,
        isPaused: false,
        duration: 0,
        audioLevel: 0,
      });

      this.startRecordingTimer();
      this.startAudioLevelMonitoring(stream);
    } catch (error) {
      console.error("Error starting recording:", error);
      throw new Error("Failed to start recording");
    }
  }

  // Stop recording
  async stopRecording(): Promise<Blob | null> {
    if (!this.mediaRecorder || !this.recordingState.isRecording) {
      return null;
    }

    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        this.audioChunks = [];

        this.updateRecordingState({
          isRecording: false,
          isPaused: false,
          duration: 0,
          audioLevel: 0,
        });

        resolve(audioBlob);
      };

      this.mediaRecorder!.stop();
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    });
  }

  // Record voice and return audio blob for backend submission
  async recordVoiceForChat(): Promise<{
    audioBlob: Blob;
    duration: number;
  } | null> {
    try {
      // Start recording
      await this.startRecording();

      // Return a promise that resolves when recording is manually stopped
      return new Promise((resolve) => {
        const checkRecording = () => {
          if (!this.recordingState.isRecording) {
            // Recording was stopped, get the audio blob
            if (this.audioChunks.length > 0) {
              const audioBlob = new Blob(this.audioChunks, {
                type: "audio/webm;codecs=opus",
              });
              const duration = this.recordingState.duration;
              resolve({ audioBlob, duration });
            } else {
              resolve(null);
            }
          } else {
            // Check again in 100ms
            setTimeout(checkRecording, 100);
          }
        };

        // Start checking
        setTimeout(checkRecording, 100);
      });
    } catch (error) {
      console.error("Error recording voice for chat:", error);
      throw new Error("Failed to record voice");
    }
  }

  // Pause recording
  pauseRecording(): void {
    if (this.mediaRecorder && this.recordingState.isRecording) {
      this.mediaRecorder.pause();
      this.updateRecordingState({
        ...this.recordingState,
        isPaused: true,
      });
    }
  }

  // Resume recording
  resumeRecording(): void {
    if (this.mediaRecorder && this.recordingState.isPaused) {
      this.mediaRecorder.resume();
      this.updateRecordingState({
        ...this.recordingState,
        isPaused: false,
      });
    }
  }

  // Play audio from URL
  async playAudio(audioUrl: string, messageId: string): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stopAudio();

      this.currentAudio = new Audio(audioUrl);

      this.currentAudio.addEventListener("loadedmetadata", () => {
        this.updatePlaybackState({
          isPlaying: false,
          currentTime: 0,
          duration: this.currentAudio?.duration || 0,
          messageId,
        });
      });

      this.currentAudio.addEventListener("timeupdate", () => {
        this.updatePlaybackState({
          isPlaying: !this.currentAudio?.paused || false,
          currentTime: this.currentAudio?.currentTime || 0,
          duration: this.currentAudio?.duration || 0,
          messageId,
        });
      });

      this.currentAudio.addEventListener("ended", () => {
        this.updatePlaybackState({
          isPlaying: false,
          currentTime: 0,
          duration: this.currentAudio?.duration || 0,
          messageId,
        });
      });

      this.currentAudio.addEventListener("error", (error) => {
        console.error("Audio playback error:", error);
        this.stopAudio();
      });

      await this.currentAudio.play();

      this.updatePlaybackState({
        isPlaying: true,
        currentTime: 0,
        duration: this.currentAudio.duration,
        messageId,
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      throw new Error("Failed to play audio");
    }
  }

  // Stop audio playback
  stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;

      this.updatePlaybackState({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        messageId: "",
      });
    }
  }

  // Pause audio playback
  pauseAudio(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
    }
  }

  // Resume audio playback
  resumeAudio(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play();
    }
  }

  // Get current recording state
  getRecordingState(): AudioRecordingState {
    return { ...this.recordingState };
  }

  // Get current playback state
  getPlaybackState(): AudioPlaybackState {
    return { ...this.playbackState };
  }

  // Private methods
  private updateRecordingState(newState: AudioRecordingState): void {
    this.recordingState = { ...newState };
    this.onRecordingStateChange?.(this.recordingState);
  }

  private updatePlaybackState(newState: AudioPlaybackState): void {
    this.playbackState = { ...newState };
    this.onPlaybackStateChange?.(this.playbackState);
  }

  private startRecordingTimer(): void {
    const updateTimer = () => {
      if (this.recordingState.isRecording && !this.recordingState.isPaused) {
        const duration = (Date.now() - this.recordingStartTime) / 1000;
        this.updateRecordingState({
          ...this.recordingState,
          duration,
        });
      }

      if (this.recordingState.isRecording) {
        this.animationFrame = requestAnimationFrame(updateTimer);
      }
    };

    this.animationFrame = requestAnimationFrame(updateTimer);
  }

  private startAudioLevelMonitoring(stream: MediaStream): void {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      microphone.connect(analyser);
      analyser.fftSize = 256;

      const updateLevel = () => {
        if (this.recordingState.isRecording) {
          analyser.getByteFrequencyData(dataArray);
          const average =
            dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          const level = average / 255; // Normalize to 0-1

          this.updateRecordingState({
            ...this.recordingState,
            audioLevel: level,
          });

          requestAnimationFrame(updateLevel);
        }
      };

      updateLevel();
    } catch (error) {
      console.error("Error setting up audio level monitoring:", error);
    }
  }

  // Cleanup
  cleanup(): void {
    this.stopRecording();
    this.stopAudio();
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

export const audioService = new AudioService();
