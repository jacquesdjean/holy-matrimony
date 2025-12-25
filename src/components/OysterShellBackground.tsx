import styled from 'styled-components';

// Oyster shell SVG paths for variety
const oysterShells = [
  // Shell 1 - classic rounded oyster
  `M25 5 C10 5 2 15 2 25 C2 40 15 48 25 48 C35 48 48 40 48 25 C48 15 40 5 25 5 Z M25 10 C35 10 42 18 42 25 C42 35 32 42 25 42 C18 42 8 35 8 25 C8 18 15 10 25 10 Z M15 20 Q25 15 35 25 M12 28 Q25 22 38 30 M14 35 Q25 30 36 38`,
  // Shell 2 - elongated oyster
  `M10 25 C10 10 20 2 35 2 C50 2 55 15 55 25 C55 40 45 50 30 50 C15 50 10 40 10 25 Z M18 20 Q30 15 45 22 M15 28 Q32 20 48 30 M17 36 Q30 28 45 38`,
  // Shell 3 - fan-shaped
  `M25 45 C5 45 2 30 2 20 C2 10 10 2 25 2 C40 2 48 10 48 20 C48 30 45 45 25 45 Z M25 8 L25 40 M15 12 Q25 25 35 12 M10 20 Q25 35 40 20 M8 30 Q25 42 42 30`,
];

interface ShellProps {
  $size: number;
  $rotation: number;
  $top: string;
  $left?: string;
  $right?: string;
  $opacity: number;
}

const Shell = styled.svg<ShellProps>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left || 'auto'};
  right: ${({ $right }) => $right || 'auto'};
  transform: rotate(${({ $rotation }) => $rotation}deg);
  opacity: ${({ $opacity }) => $opacity};
  pointer-events: none;
  z-index: 0;
`;

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

interface OysterShellBackgroundProps {
  variant?: 'schedule' | 'travel';
}

export const OysterShellBackground: React.FC<OysterShellBackgroundProps> = ({ variant = 'schedule' }) => {
  // Different shell arrangements for different sections
  const shellConfigs = variant === 'schedule' ? [
    { path: oysterShells[0], size: 80, rotation: -15, top: '5%', left: '-20px', opacity: 0.08 },
    { path: oysterShells[1], size: 60, rotation: 25, top: '15%', right: '-15px', opacity: 0.06 },
    { path: oysterShells[2], size: 45, rotation: -30, top: '35%', left: '-10px', opacity: 0.05 },
    { path: oysterShells[0], size: 70, rotation: 180, top: '55%', right: '-25px', opacity: 0.07 },
    { path: oysterShells[1], size: 55, rotation: 45, top: '75%', left: '-18px', opacity: 0.06 },
    { path: oysterShells[2], size: 65, rotation: -60, top: '90%', right: '-20px', opacity: 0.05 },
  ] : [
    { path: oysterShells[1], size: 75, rotation: 10, top: '3%', right: '-22px', opacity: 0.07 },
    { path: oysterShells[2], size: 50, rotation: -20, top: '12%', left: '-15px', opacity: 0.05 },
    { path: oysterShells[0], size: 65, rotation: 35, top: '28%', right: '-18px', opacity: 0.06 },
    { path: oysterShells[1], size: 55, rotation: -45, top: '45%', left: '-12px', opacity: 0.07 },
    { path: oysterShells[2], size: 70, rotation: 15, top: '62%', right: '-25px', opacity: 0.05 },
    { path: oysterShells[0], size: 48, rotation: -80, top: '78%', left: '-14px', opacity: 0.06 },
    { path: oysterShells[1], size: 60, rotation: 120, top: '92%', right: '-16px', opacity: 0.05 },
  ];

  return (
    <BackgroundWrapper>
      {shellConfigs.map((config, index) => (
        <Shell
          key={index}
          viewBox="0 0 60 55"
          $size={config.size}
          $rotation={config.rotation}
          $top={config.top}
          $left={config.left}
          $right={config.right}
          $opacity={config.opacity}
        >
          <path
            d={config.path}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Shell>
      ))}
    </BackgroundWrapper>
  );
};
