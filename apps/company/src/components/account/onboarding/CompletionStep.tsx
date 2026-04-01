import confetti from "canvas-confetti";
import { ArrowRight, Rocket } from "lucide-react";
import { useEffect, useRef } from "react";

interface CompletionStepProps {
  artistName?: string;
  href: string;
}
export function CompletionStep({ artistName, href }: CompletionStepProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    // Fire confetti
    const end = Date.now() + 1500;
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"];
    (function frame() {
      void confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      void confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <div className="max-w-md w-full mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-5xl mb-5">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You&apos;re all set!
        </h1>
        <p className="text-gray-500 mb-2">
          Great job{artistName ? `, ${artistName}` : ""}! Your basic site is
          ready.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Now head to your dashboard to add portfolio, designs, events and more.
        </p>

        <a
          href={href}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-xl text-base gap-2 cursor-pointer inline-flex items-center justify-center text-white font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Rocket className="w-5 h-5" />
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
