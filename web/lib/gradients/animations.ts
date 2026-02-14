// CSS Animation keyframes for gradient effects

export const gradientAnimations = {
    shift: `
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,
    rotate: `
    @keyframes gradient-rotate {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `,
    pulse: `
    @keyframes gradient-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.02); }
    }
  `,
    wave: `
    @keyframes gradient-wave {
      0% { background-size: 100% 100%; }
      50% { background-size: 200% 200%; }
      100% { background-size: 100% 100%; }
    }
  `,
};

export type AnimationType = keyof typeof gradientAnimations;

export function getAnimationStyle(
    type: AnimationType,
    duration: number,
    easing: string = 'ease-in-out'
): React.CSSProperties {
    const animationName = `gradient-${type}`;

    return {
        animation: `${animationName} ${duration}s ${easing} infinite`,
        backgroundSize: type === 'shift' ? '200% 200%' : undefined,
    };
}

export function injectAnimationKeyframes(): void {
    if (typeof document === 'undefined') return;

    const styleId = 'gradient-animations-style';
    if (document.getElementById(styleId)) return;

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = Object.values(gradientAnimations).join('\n');
    document.head.appendChild(styleElement);
}
