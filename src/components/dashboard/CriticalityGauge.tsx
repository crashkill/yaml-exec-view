import { useEffect, useRef } from "react";

interface CriticalityGaugeProps {
  value: number; // 0-100
  size?: "sm" | "md" | "lg";
  label?: string;
  showValue?: boolean;
}

export function CriticalityGauge({ 
  value, 
  size = "md", 
  label,
  showValue = true 
}: CriticalityGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dimensions = {
    sm: { size: 80, strokeWidth: 6, fontSize: 12 },
    md: { size: 120, strokeWidth: 8, fontSize: 14 },
    lg: { size: 200, strokeWidth: 12, fontSize: 18 },
  };

  const { size: canvasSize, strokeWidth, fontSize } = dimensions[size];
  const radius = (canvasSize - strokeWidth) / 2;
  const center = canvasSize / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Calculate progress
    const progress = Math.min(100, Math.max(0, value)) / 100;
    const startAngle = -Math.PI / 2; // Start from top
    const endAngle = startAngle + (progress * 2 * Math.PI);

    // Determine color based on value
    let color: string;
    if (value <= 33) {
      color = "#22c55e"; // Green
    } else if (value <= 66) {
      color = "#f59e0b"; // Yellow
    } else {
      color = "#ef4444"; // Red
    }

    // Draw progress arc
    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // Draw center value
    if (showValue) {
      ctx.fillStyle = "#374151";
      ctx.font = `bold ${fontSize}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(value)}`, center, center);
      
      if (size !== "sm") {
        ctx.font = `${fontSize - 4}px system-ui`;
        ctx.fillStyle = "#6b7280";
        ctx.fillText("criticidade", center, center + fontSize + 2);
      }
    }
  }, [value, canvasSize, strokeWidth, fontSize, radius, center, showValue, size]);

  const getCriticalityLabel = () => {
    if (value <= 33) return "Baixa";
    if (value <= 66) return "Média";
    return "Alta";
  };

  const getCriticalityColor = () => {
    if (value <= 33) return "text-critical-low";
    if (value <= 66) return "text-critical-medium";
    return "text-critical-high";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="transform hover:scale-105 transition-transform duration-300"
      />
      
      {label && (
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className={`text-xs font-medium ${getCriticalityColor()}`}>
            {getCriticalityLabel()}
          </p>
        </div>
      )}
    </div>
  );
}