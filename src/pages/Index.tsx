import { useState, useEffect, useCallback } from "react";
import BreathingBubble from "@/components/BreathingBubble";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Play, RefreshCw } from "lucide-react";
import { getUserId } from "../lib/auth";
import { saveBreathingSession } from "../lib/db";

const TOTAL_SECONDS = 120; // 2 minutes

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => prev - 1);
      }, 1000);
    } else if (remaining === 0) {
      setIsActive(false);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, remaining]);

  const handleComplete = async () => {
    const userId = getUserId();
    if (userId) {
      setIsSaving(true);
      try {
        await saveBreathingSession(userId, {
          duration_seconds: TOTAL_SECONDS,
          logged_at: new Date().toISOString(),
        });
        setIsCompleted(true);
      } catch (error) {
        console.error("Failed to save session:", error);
        setIsCompleted(true); // Still show complete even if save fails for UX
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setRemaining(TOTAL_SECONDS);
    setIsCompleted(false);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-success" strokeWidth={3} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Breathe In, Breathe Out</h1>
          <p className="text-muted-foreground mt-2">Your 2-minute session is complete. How do you feel?</p>
        </div>
        <Button onClick={handleReset} variant="outline" className="rounded-full px-8">
          Start New Session
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {isActive ? "Focus on your breath" : "Take a Moment"}
        </h1>
        <div className="text-5xl font-mono font-medium text-primary/80 tracking-tighter tabular-nums">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      <BreathingBubble isActive={isActive} />

      <div className="flex items-center gap-4">
        {!isActive ? (
          <Button
            size="lg"
            onClick={() => setIsActive(true)}
            className="rounded-full h-16 px-10 text-lg font-semibold shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1 group"
          >
            <Play className="mr-2 h-6 w-6 fill-current"/>
            {remaining < TOTAL_SECONDS ? "Resume" : "Start Session"}
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setIsActive(false)}
            className="rounded-full h-16 px-10 text-lg font-semibold"
          >
            Pause
          </Button>
        )}

        {remaining < TOTAL_SECONDS && !isActive && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-16 w-16 rounded-full hover:bg-muted"
          >
            <RefreshCw className="h-6 w-6"/>
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground max-w-xs text-center italic">
        "The breath is the bridge which connects life to consciousness."
      </p>
    </div>
  );
};

export default Index;
