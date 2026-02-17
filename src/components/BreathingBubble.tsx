import { useEffect, useState } from "react";

type Phase = "inhale" | "hold" | "exhale";

interface BreathingBubbleProps {
  isActive: boolean;
}

const PHASE_DURATION = 4000;
const PHASES: Phase[] = ["inhale", "hold", "exhale"];
const PHASE_LABELS: Record<Phase, string> = {
  inhale: "Breathe in...",
  hold: "Hold...",
  exhale: "Breathe out...",
};

const BreathingBubble = ({ isActive }: BreathingBubbleProps) => {
  const [phase, setPhase] = useState<Phase>("inhale");

  useEffect(() => {
    if (!isActive) {
      setPhase("inhale");
      return;
    }

    let index = 0;
    setPhase(PHASES[0]);

    const interval = setInterval(() => {
      index = (index + 1) % 3;
      setPhase(PHASES[index]);
    }, PHASE_DURATION);

    return () => clearInterval(interval);
  }, [isActive]);

  const scaleClass = phase === "inhale"
    ? "scale-[1.3]"
    : phase === "hold"
      ? "scale-[1.3]"
      : "scale-100";

  const gradientClass = phase === "inhale"
    ? "bubble-gradient-inhale"
    : phase === "hold"
      ? "bubble-gradient-hold"
      : "bubble-gradient-exhale";

  const pulseClass = phase === "hold" ? "animate-pulse" : "";

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={`
          relative w-[200px] h-[200px] rounded-full
          ${gradientClass} bubble-shadow
          ${scaleClass} ${pulseClass}
          transition-transform duration-[4000ms] ease-in-out
          flex items-center justify-center
        `}
      >
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm" />
        
        <span className="relative z-10 text-primary-foreground text-lg font-medium tracking-wide select-none">
          {isActive ? PHASE_LABELS[phase] : "Ready"}
        </span>
      </div>
    </div>
  );
};

export default BreathingBubble;
