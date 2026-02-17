import { useState, useEffect, useCallback } from "react";
import BreathingBubble from "@/components/BreathingBubble";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const TOTAL_SECONDS = 120;

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type Stage = "idle" | "active" | "complete";

const Index = () => {
  const [stage, setStage] = useState<Stage>("idle");
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);

  const handleBegin = useCallback(() => {
    setStage("active");
    setRemaining(TOTAL_SECONDS);
  }, []);

  const handleDone = useCallback(() => {
    setStage("complete");
  }, []);

  const handleSkip = useCallback(() => {
    setStage("complete");
  }, []);

  const handleReset = useCallback(() => {
    setStage("idle");
    setRemaining(TOTAL_SECONDS);
  }, []);

  useEffect(() => {
    if (stage !== "active") return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setStage("complete");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="breathing-bg min-h-screen flex flex-col items-center justify-center px-6 select-none">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          Breathing Reset
        </h1>
        <p className="text-muted-foreground text-base">
          2-minute nervous system regulation
        </p>
      </div>

      {/* Bubble */}
      <div className="mb-10">
        <BreathingBubble isActive={stage === "active"} />
      </div>

      {/* Timer / Status */}
      <div className="mb-10 text-center">
        {stage === "active" && (
          <p className="text-4xl font-light tracking-widest text-foreground tabular-nums">
            {formatTime(remaining)}
          </p>
        )}
        {stage === "complete" && (
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-7 h-7 text-primary-foreground" />
            </div>
            <p className="text-lg text-foreground font-medium">
              Well done. You're centered.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {stage === "idle" && (
          <>
            <Button onClick={handleBegin} size="lg" className="px-10 rounded-full text-base">
              Begin
            </Button>
            <Button onClick={handleSkip} variant="ghost" size="lg" className="rounded-full text-muted-foreground">
              Skip
            </Button>
          </>
        )}
        {stage === "active" && (
          <>
            <Button onClick={handleDone} size="lg" className="px-10 rounded-full text-base">
              Done
            </Button>
            <Button onClick={handleSkip} variant="ghost" size="lg" className="rounded-full text-muted-foreground">
              Skip
            </Button>
          </>
        )}
        {stage === "complete" && (
          <Button onClick={handleReset} variant="ghost" size="lg" className="rounded-full text-muted-foreground">
            Start again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;
