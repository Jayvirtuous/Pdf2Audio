
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Download, SkipBack, SkipForward } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  audioUrl: string;
  fileName: string;
}

const AudioPlayer = ({ audioUrl, fileName }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.8]);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      console.log('Audio loaded, duration:', audio.duration);
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
      setIsLoading(false);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    
    const handleLoadStart = () => {
      console.log('Audio loading started');
      setIsLoading(true);
    };
    
    const handleCanPlay = () => {
      console.log('Audio can play');
      setIsLoading(false);
    };
    
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      toast({
        title: "Audio Error",
        description: "There was an error loading the audio file",
        variant: "destructive",
      });
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    // Set initial volume
    audio.volume = volume[0];

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, volume, toast]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Play/pause error:', error);
      toast({
        title: "Playback Error",
        description: "Unable to play audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    setVolume(value);
    audio.volume = value[0];
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(duration, audio.currentTime + 10);
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    try {
      console.log('Starting download for:', audioUrl);
      
      // Create a temporary anchor element for download
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = fileName;
      link.style.display = 'none';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `${fileName} is being downloaded`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the file",
        variant: "destructive",
      });
    }
  };

  const progressPercentage = duration && isFinite(duration) ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {isLoading && (
        <div className="text-center text-gray-600">
          Loading audio...
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[progressPercentage]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
          disabled={isLoading || !duration}
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={skipBackward}
          disabled={isLoading}
          aria-label="Skip backward 10 seconds"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={togglePlayPause}
          size="icon"
          className="h-12 w-12 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleStop}
          disabled={isLoading}
          aria-label="Stop"
        >
          <Square className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={skipForward}
          disabled={isLoading}
          aria-label="Skip forward 10 seconds"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 w-16">Volume:</span>
        <Slider
          value={volume}
          onValueChange={handleVolumeChange}
          max={1}
          step={0.1}
          className="flex-1"
        />
        <span className="text-sm text-gray-600 w-8">{Math.round(volume[0] * 100)}%</span>
      </div>

      {/* Download Button */}
      <Button
        onClick={handleDownload}
        variant="outline"
        className="w-full"
        disabled={isLoading}
      >
        <Download className="h-4 w-4 mr-2" />
        Download {fileName}
      </Button>
    </div>
  );
};

export default AudioPlayer;
