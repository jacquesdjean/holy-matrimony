import { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

const CORRECT_PASSWORD = 'JEANVOSKO2026';
const STORAGE_KEY = 'wedding-access-granted';

interface PasswordGateProps {
  children: React.ReactNode;
}

// Particle type for confetti
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
  duration: number;
}

// Keyframe animations
const gentleFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotateY(0deg) rotateX(5deg);
  }
  25% {
    transform: translateY(-8px) rotateY(2deg) rotateX(3deg);
  }
  50% {
    transform: translateY(-15px) rotateY(0deg) rotateX(7deg);
  }
  75% {
    transform: translateY(-8px) rotateY(-2deg) rotateX(4deg);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(244, 211, 94, 0.3), 0 0 40px rgba(244, 211, 94, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(244, 211, 94, 0.5), 0 0 60px rgba(244, 211, 94, 0.2);
  }
`;

const sealCrack = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    opacity: 1;
    filter: brightness(1);
  }
  30% {
    transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
    filter: brightness(1.5);
  }
  60% {
    transform: translate(-50%, -50%) scale(1.3) rotate(-3deg);
    opacity: 0.8;
    filter: brightness(2);
  }
  100% {
    transform: translate(-50%, -50%) scale(2) rotate(10deg);
    opacity: 0;
    filter: brightness(3);
  }
`;

const flapOpen = keyframes`
  0% {
    transform: rotateX(0deg);
  }
  40% {
    transform: rotateX(-10deg);
  }
  100% {
    transform: rotateX(-180deg);
  }
`;

const letterRise = keyframes`
  0% {
    transform: translateX(-50%) translateY(0) scale(1);
    opacity: 1;
  }
  30% {
    transform: translateX(-50%) translateY(-50px) scale(1);
    opacity: 1;
  }
  60% {
    transform: translateX(-50%) translateY(-120px) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-200px) scale(1.5);
    opacity: 0;
  }
`;

const goldenBurst = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const particleFall = keyframes`
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
`;

const twinkle = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0) rotateZ(0deg);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-8px) rotateZ(-1deg);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(8px) rotateZ(1deg);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const starFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
`;

// Styled components
const GateWrapper = styled.div<{ $isUnlocked: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background: radial-gradient(ellipse at center, #1e3a5f 0%, #152a45 50%, #0d1f33 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  overflow: hidden;

  ${({ $isUnlocked }) =>
    $isUnlocked &&
    css`
      animation: ${fadeOut} 1.2s ease-out forwards;
      animation-delay: 2s;
    `}
`;

const StarsBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Star = styled.div<{ $top: string; $left: string; $delay: number; $size: number }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background: radial-gradient(circle, rgba(244, 211, 94, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: ${twinkle} ${({ $delay }) => 2 + $delay}s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const ContentWrapper = styled.div<{ $isVisible: boolean }>`
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : 'none')} 0.8s ease-out;
`;

const EnvelopeScene = styled.div`
  perspective: 1200px;
  perspective-origin: center center;
`;

const EnvelopeContainer = styled.div<{ $isShaking: boolean; $isOpening: boolean }>`
  position: relative;
  transform-style: preserve-3d;
  animation: ${gentleFloat} 6s ease-in-out infinite;

  ${({ $isShaking }) =>
    $isShaking &&
    css`
      animation: ${shake} 0.6s ease-in-out;
    `}

  ${({ $isOpening }) =>
    $isOpening &&
    css`
      animation: none;
    `}
`;

const Envelope = styled.div`
  width: 300px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;

  @media (min-width: 768px) {
    width: 380px;
    height: 250px;
  }
`;

const EnvelopeBody = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg, #fdfcfa 0%, #f5f2ed 30%, #ebe7e0 70%, #e0dbd3 100%);
  border-radius: 12px;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.4),
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(0,0,0,0.04) 0%, transparent 100%);
  }
`;

const EnvelopeLining = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  height: 45%;
  background: linear-gradient(180deg, #1e3a5f 0%, #2d4a6f 100%);
  border-radius: 8px 8px 0 0;
  opacity: 0.15;
`;

const EnvelopeFlap = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 55%;
  transform-origin: top center;
  transform-style: preserve-3d;
  z-index: 10;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      animation: ${flapOpen} 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    `}
`;

const FlapFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #f0ece5 0%, #e8e4dc 50%, #ddd8cf 100%);
  clip-path: polygon(0 0, 50% 100%, 100% 0);
  backface-visibility: hidden;
  border-radius: 12px 12px 0 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
    clip-path: polygon(0 0, 50% 100%, 100% 0);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  }
`;

const FlapBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, #1e3a5f 0%, #2d4a6f 100%);
  clip-path: polygon(0 0, 50% 100%, 100% 0);
  transform: rotateX(180deg);
  backface-visibility: hidden;
`;

const WaxSeal = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  background:
    radial-gradient(ellipse at 30% 30%, #d4a574 0%, #c49464 20%, #a67c52 50%, #8b6440 80%, #6d4c32 100%);
  border-radius: 50%;
  z-index: 25;
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 3px 6px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulseGlow} 3s ease-in-out infinite;
  cursor: default;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      animation: ${sealCrack} 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    `}

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }

  @media (min-width: 768px) {
    width: 85px;
    height: 85px;
  }
`;

const SealMonogram = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.5rem;
  color: #faf8f5;
  font-weight: 400;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const GoldenBurst = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(244, 211, 94, 0.8) 0%, rgba(244, 211, 94, 0.4) 30%, transparent 70%);
  border-radius: 50%;
  z-index: 24;
  pointer-events: none;

  ${({ $isActive }) =>
    $isActive &&
    css`
      animation: ${goldenBurst} 1s ease-out forwards;
    `}
`;

const Letter = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  width: 88%;
  height: 65%;
  background: linear-gradient(180deg, #ffffff 0%, #fdfcfa 50%, #f8f6f2 100%);
  border-radius: 6px;
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  z-index: 5;
  padding: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid rgba(30, 58, 95, 0.1);
    border-radius: 4px;
    pointer-events: none;
  }

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      animation: ${letterRise} 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      animation-delay: 0.5s;
    `}
`;

const LetterDecoration = styled.div`
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #F4D35E, transparent);
`;

const LetterText = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.4rem;
  color: #1e3a5f;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const LetterDate = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  color: #8b7355;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
`;

const LetterFlourish = styled.div`
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(139, 115, 85, 0.5), transparent);
  margin-top: 0.5rem;
`;

const Title = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 300;
  font-size: 1.75rem;
  color: #f5f3f0;
  letter-spacing: 0.2em;
  margin-bottom: 3rem;
  text-align: center;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(244, 211, 94, 0.6), transparent);
  }

  @media (min-width: 768px) {
    font-size: 2rem;
    letter-spacing: 0.25em;
  }
`;

const PasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  position: relative;
  z-index: 100;
`;

const PasswordInput = styled.input<{ $hasError: boolean }>`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${({ $hasError }) => ($hasError ? 'rgba(255, 107, 107, 0.8)' : 'rgba(250, 248, 245, 0.2)')};
  border-radius: 12px;
  padding: 1.25rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #faf8f5;
  letter-spacing: 0.3em;
  text-align: center;
  width: 300px;
  outline: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(250, 248, 245, 0.4);
    letter-spacing: 0.15em;
    text-transform: none;
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? 'rgba(255, 107, 107, 0.8)' : 'rgba(244, 211, 94, 0.6)')};
    background: rgba(255, 255, 255, 0.12);
    box-shadow:
      0 0 30px rgba(244, 211, 94, 0.15),
      inset 0 0 20px rgba(244, 211, 94, 0.05);
  }

  @media (min-width: 768px) {
    width: 340px;
    font-size: 1.125rem;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #F4D35E 0%, #E8C84A 50%, #d4b445 100%);
  border: none;
  border-radius: 12px;
  padding: 1.125rem 3.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e3a5f;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 220px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(244, 211, 94, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 2.5s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 35px rgba(244, 211, 94, 0.4);
  }

  &:active {
    transform: translateY(-1px) scale(1);
  }
`;

const ErrorMessage = styled.p`
  color: #ff8a8a;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  margin-top: 0.75rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const Hint = styled.p`
  color: rgba(250, 248, 245, 0.4);
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  margin-top: 2rem;
  text-align: center;
  max-width: 280px;
  line-height: 1.6;
  letter-spacing: 0.05em;
`;

const ConfettiContainer = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ConfettiPiece = styled.div<{
  $x: number;
  $size: number;
  $color: string;
  $rotation: number;
  $delay: number;
  $duration: number;
}>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: -20px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size * 0.6}px;
  background: ${({ $color }) => $color};
  transform: rotate(${({ $rotation }) => $rotation}deg);
  animation: ${particleFall} ${({ $duration }) => $duration}s linear forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  border-radius: 2px;
`;

const AmbientParticle = styled.div<{ $top: string; $left: string; $delay: number }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: 4px;
  height: 4px;
  background: rgba(244, 211, 94, 0.6);
  border-radius: 50%;
  animation: ${starFloat} ${({ $delay }) => 4 + $delay * 2}s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  box-shadow: 0 0 10px rgba(244, 211, 94, 0.4);
`;

// Generate stars
const generateStars = () => {
  const stars = [];
  for (let i = 0; i < 50; i++) {
    stars.push({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 3,
      size: Math.random() * 3 + 1,
    });
  }
  return stars;
};

// Generate ambient particles
const generateAmbientParticles = () => {
  const particles = [];
  for (let i = 0; i < 15; i++) {
    particles.push({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
    });
  }
  return particles;
};

// Generate confetti
const generateConfetti = (): Particle[] => {
  const colors = ['#F4D35E', '#E8C84A', '#faf8f5', '#C9B1BC', '#ffffff', '#FFD700'];
  const particles: Particle[] = [];

  for (let i = 0; i < 60; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: 0,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      delay: Math.random() * 0.8,
      duration: Math.random() * 2 + 3,
    });
  }

  return particles;
};

const stars = generateStars();
const ambientParticles = generateAmbientParticles();

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confetti] = useState<Particle[]>(generateConfetti());
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if already authenticated
  useEffect(() => {
    const isGranted = sessionStorage.getItem(STORAGE_KEY);
    if (isGranted === 'true') {
      setShowContent(true);
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (password.toUpperCase() === CORRECT_PASSWORD) {
      setHasError(false);
      setIsOpening(true);

      // Start confetti immediately
      setShowConfetti(true);

      // Delay the unlock to allow animation to play
      setTimeout(() => {
        setIsUnlocked(true);
        sessionStorage.setItem(STORAGE_KEY, 'true');
      }, 1200);

      // Show content after animations complete
      setTimeout(() => {
        setShowContent(true);
      }, 3200);
    } else {
      setHasError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      inputRef.current?.focus();
    }
  }, [password]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (hasError) setHasError(false);
  }, [hasError]);

  if (showContent) {
    return <ContentWrapper $isVisible={true}>{children}</ContentWrapper>;
  }

  return (
    <>
      <GateWrapper $isUnlocked={isUnlocked}>
        <StarsBackground>
          {stars.map((star) => (
            <Star
              key={star.id}
              $top={star.top}
              $left={star.left}
              $delay={star.delay}
              $size={star.size}
            />
          ))}
          {ambientParticles.map((particle) => (
            <AmbientParticle
              key={`ambient-${particle.id}`}
              $top={particle.top}
              $left={particle.left}
              $delay={particle.delay}
            />
          ))}
        </StarsBackground>

        <ConfettiContainer $isActive={showConfetti}>
          {confetti.map((piece) => (
            <ConfettiPiece
              key={piece.id}
              $x={piece.x}
              $size={piece.size}
              $color={piece.color}
              $rotation={piece.rotation}
              $delay={piece.delay}
              $duration={piece.duration}
            />
          ))}
        </ConfettiContainer>

        <Title>You're Invited</Title>

        <EnvelopeScene>
          <EnvelopeContainer $isShaking={isShaking} $isOpening={isOpening}>
            <Envelope>
              <EnvelopeBody>
                <EnvelopeLining />
              </EnvelopeBody>
              <Letter $isOpen={isOpening}>
                <LetterDecoration />
                <LetterText>Jacques & Caroline</LetterText>
                <LetterFlourish />
                <LetterDate>September 26, 2026</LetterDate>
              </Letter>
              <EnvelopeFlap $isOpen={isOpening}>
                <FlapFront />
                <FlapBack />
              </EnvelopeFlap>
              <GoldenBurst $isActive={isOpening} />
              <WaxSeal $isOpen={isOpening}>
                <SealMonogram>J&C</SealMonogram>
              </WaxSeal>
            </Envelope>
          </EnvelopeContainer>
        </EnvelopeScene>

        <PasswordSection>
          <form onSubmit={handleSubmit}>
            <PasswordInput
              ref={inputRef}
              type="text"
              value={password}
              onChange={handleInputChange}
              placeholder="Enter password"
              $hasError={hasError}
              autoComplete="off"
              autoCapitalize="characters"
            />
            {hasError && <ErrorMessage>Incorrect password. Please try again.</ErrorMessage>}
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
              <SubmitButton type="submit">Open Invitation</SubmitButton>
            </div>
          </form>
        </PasswordSection>

        <Hint>
          Check your invitation for the password
        </Hint>
      </GateWrapper>
      <ContentWrapper $isVisible={false}>{children}</ContentWrapper>
    </>
  );
};
