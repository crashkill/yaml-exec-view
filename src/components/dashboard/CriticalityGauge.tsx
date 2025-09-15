import { useEffect, useRef } from "react";
import { getCriticalityColor, getCriticalityLevel } from "@/utils";
import { UI_CONFIG } from "@/constants";

interface CriticalityGaugeProps {
  value: number; // 0-100
  size?: "sm" | "md" | "lg";
  label?: string;
  showValue?: boolean;
  animated?: boolean;
  onClick?: () => void;
}

export function CriticalityGauge({ 
  value, 
  size = "md", 
  label,
  showValue = true,
  animated = true,
  onClick
}: CriticalityGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const currentValueRef = useRef(0);

  const { size: canvasSize, strokeWidth, fontSize } = UI_CONFIG.GAUGE_SIZES[size];
  const radius = (canvasSize - strokeWidth) / 2;
  const center = canvasSize / 2;

  const drawGauge = (currentValue: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "hsl(var(--muted))";
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Calculate progress
    const progress = Math.min(100, Math.max(0, currentValue)) / 100;
    const startAngle = -Math.PI / 2; // Start from top
    const endAngle = startAngle + (progress * 2 * Math.PI);

    // Get color based on value
    const color = getCriticalityColor(currentValue);

    // Draw progress arc
    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // Draw center value
    if (showValue) {
      ctx.fillStyle = "hsl(var(--foreground))";
      ctx.font = `bold ${fontSize}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(currentValue)}`, center, center);
      
      if (size !== "sm") {
        ctx.font = `${fontSize - 4}px system-ui`;
        ctx.fillStyle = "hsl(var(--muted-foreground))";
        ctx.fillText("criticidade", center, center + fontSize + 2);
      }
    }
  };

  const animateToValue = (targetValue: number) => {
    if (!animated) {
      currentValueRef.current = targetValue;
      drawGauge(targetValue);
      return;
    }

    const startValue = currentValueRef.current;
    const difference = targetValue - startValue;
    const duration = 1000; // 1 second
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (difference * easeOut);
      
      currentValueRef.current = currentValue;
      drawGauge(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animateToValue(value);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, animated]);

  useEffect(() => {
    // Redraw on size or style changes
    drawGauge(currentValueRef.current);
  }, [canvasSize, strokeWidth, fontSize, radius, center, showValue, size]);

  const criticalityLevel = getCriticalityLevel(value);
  const criticalityColor = getCriticalityColor(value);

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className={`transform transition-transform duration-300 ${
          onClick ? 'cursor-pointer hover:scale-105' : 'hover:scale-102'
        }`}
        onClick={onClick}
        title={`Criticidade: ${Math.round(value)}% (${criticalityLevel})`}
      />
      
      {label && (
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p 
            className="text-xs font-medium"
            style={{ color: criticalityColor }}
          >
            {criticalityLevel}
          </p>
        </div>
      )}
    </div>
  );
}