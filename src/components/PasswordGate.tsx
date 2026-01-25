import { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

const CORRECT_PASSWORD = 'JEANVOSKO2026';
const STORAGE_KEY = 'wedding-access-granted';

interface PasswordGateProps {
  children: React.ReactNode;
}

// Keyframe animations
const float = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(0.5deg);
  }
  50% {
    transform: translateY(-10px) rotate(0deg);
  }
  75% {
    transform: translateY(-5px) rotate(-0.5deg);
  }
`;

const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.008);
  }
`;

const shadowPulse = keyframes`
  0%, 100% {
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.25),
      0 10px 20px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow:
      0 35px 60px rgba(0, 0, 0, 0.3),
      0 15px 25px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
`;

const paperShimmer = keyframes`
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
`;

const flapHint = keyframes`
  0%, 100% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(-2deg);
  }
`;

const sealGlow = keyframes`
  0%, 100% {
    box-shadow: 0 3px 12px rgba(180, 140, 100, 0.35), 0 0 15px rgba(200, 160, 110, 0.15);
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
  50% {
    box-shadow: 0 5px 20px rgba(180, 140, 100, 0.55), 0 0 28px rgba(200, 160, 110, 0.25);
    transform: translate(-50%, -50%) scale(1.03) rotate(2deg);
  }
`;

const sealBreak = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    opacity: 1;
  }
  30% {
    transform: translate(-50%, -50%) scale(1.15) rotate(5deg);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(0) rotate(15deg);
    opacity: 0;
  }
`;

const flapOpen = keyframes`
  0% {
    transform: rotateX(0deg);
  }
  40% {
    transform: rotateX(-100deg);
  }
  70% {
    transform: rotateX(-160deg);
  }
  100% {
    transform: rotateX(-175deg);
  }
`;

const letterEmerge = keyframes`
  0% {
    transform: translateX(-50%) translateY(0) scale(1);
    opacity: 1;
  }
  60% {
    transform: translateX(-50%) translateY(-120px) scale(1.15);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-180px) scale(1.25);
    opacity: 0;
  }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; visibility: hidden; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.8; }
`;

const confettiFall = keyframes`
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0.3;
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
  background: linear-gradient(180deg, #1a3152 0%, #152a45 40%, #0f1f33 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  overflow: hidden;

  ${({ $isUnlocked }) =>
    $isUnlocked &&
    css`
      animation: ${fadeOut} 1.2s ease-out forwards;
      animation-delay: 1.6s;
    `}
`;

const Stars = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Star = styled.div<{ $x: number; $y: number; $size: number; $delay: number }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: ${twinkle} ${({ $delay }) => 3 + $delay}s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const ContentWrapper = styled.div<{ $isVisible: boolean }>`
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : 'none')} 0.6s ease-out;
`;

const Title = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 300;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.25em;
  margin-bottom: 2.5rem;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 3rem;
  }
`;

const EnvelopeScene = styled.div`
  perspective: 1000px;
`;

const EnvelopeContainer = styled.div<{ $isShaking: boolean; $isOpening: boolean }>`
  animation: ${({ $isOpening }) => ($isOpening ? 'none' : float)} 4s ease-in-out infinite;

  ${({ $isShaking }) =>
    $isShaking &&
    css`
      animation: ${shake} 0.5s ease-in-out;
    `}
`;

const Envelope = styled.div<{ $isOpening?: boolean }>`
  position: relative;
  width: 260px;
  height: 170px;
  transform-style: preserve-3d;
  animation: ${({ $isOpening }) => ($isOpening ? 'none' : breathe)} 3s ease-in-out infinite;
  will-change: transform;

  @media (min-width: 768px) {
    width: 320px;
    height: 210px;
  }
`;

const EnvelopeBack = styled.div<{ $isOpening?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0) 100%
    ),
    linear-gradient(180deg, #faf8f5 0%, #f0ede8 100%);
  background-size: 200% 200%, 100% 100%;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.12);
  animation: ${({ $isOpening }) => ($isOpening ? 'none' : paperShimmer)} 6s ease-in-out infinite;
`;

const EnvelopeFront = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 58%;
  background: linear-gradient(180deg, #f7f5f2 0%, #ebe8e2 100%);
  border-radius: 0 0 4px 4px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-top: none;
  z-index: 5;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
  }
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
  will-change: transform;
  animation: ${({ $isOpen }) => ($isOpen ? flapOpen : flapHint)}
    ${({ $isOpen }) => ($isOpen ? '1s cubic-bezier(0.4, 0, 0.2, 1) forwards' : '4s ease-in-out infinite')};
`;

const FlapOuter = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #f0ede8 0%, #e4e0d9 100%);
  clip-path: polygon(0 0, 50% 100%, 100% 0);
  backface-visibility: hidden;
  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.1));
`;

const FlapInner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1a3152 0%, #243d5c 100%);
  clip-path: polygon(0 0, 50% 100%, 100% 0);
  transform: rotateX(180deg);
  backface-visibility: hidden;
`;

const Letter = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  width: 82%;
  height: 72%;
  background: linear-gradient(180deg, #ffffff 0%, #fdfcfb 100%);
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  z-index: 2;
  padding: 1rem;
  will-change: transform, opacity;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      animation: ${letterEmerge} 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      animation-delay: 0.5s;
    `}
`;

const LetterNames = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.15rem;
  color: #1a3152;
  font-weight: 400;
  letter-spacing: 0.06em;

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const LetterDate = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  color: #9a8b7a;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 0.7rem;
  }
`;

const WaxSeal = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 54px;
  height: 54px;
  background: radial-gradient(ellipse at 30% 30%, #c49a6c 0%, #a67c52 40%, #8b6340 100%);
  border-radius: 50%;
  border: 1px solid rgba(139, 99, 64, 0.3);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  will-change: transform, opacity;
  animation: ${({ $isOpen }) => ($isOpen ? sealBreak : sealGlow)}
    ${({ $isOpen }) => ($isOpen ? '0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards' : '2.5s ease-in-out infinite')};

  @media (min-width: 768px) {
    width: 62px;
    height: 62px;
  }
`;

const SealText = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  color: #faf8f5;
  font-weight: 500;
  letter-spacing: 0.02em;

  @media (min-width: 768px) {
    font-size: 1.15rem;
  }
`;

const FormSection = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 50;

  @media (min-width: 768px) {
    margin-top: 3.5rem;
  }
`;

const PasswordInput = styled.input<{ $hasError: boolean }>`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${({ $hasError }) => ($hasError ? 'rgba(255, 120, 120, 0.6)' : 'rgba(255, 255, 255, 0.18)')};
  border-radius: 6px;
  padding: 0.9rem 1.25rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #fff;
  letter-spacing: 0.2em;
  text-align: center;
  width: 240px;
  outline: none;
  text-transform: uppercase;
  transition: all 0.25s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.08em;
    text-transform: none;
    font-size: 0.85rem;
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? 'rgba(255, 120, 120, 0.6)' : 'rgba(244, 211, 94, 0.5)')};
    background: rgba(255, 255, 255, 0.12);
  }

  @media (min-width: 768px) {
    width: 280px;
    padding: 1rem 1.5rem;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #e8c84a 0%, #d4b445 100%);
  border: none;
  border-radius: 6px;
  padding: 0.85rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: #1a3152;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 2.5s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(244, 211, 94, 0.25);
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    padding: 0.9rem 2.25rem;
    font-size: 0.75rem;
  }
`;

const ErrorText = styled.p`
  color: rgba(255, 130, 130, 0.9);
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const Hint = styled.p`
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  margin-top: 2rem;
  letter-spacing: 0.04em;
`;

const ConfettiContainer = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
`;

const Confetti = styled.div<{ $x: number; $color: string; $delay: number; $duration: number }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: 0;
  width: 6px;
  height: 6px;
  background: ${({ $color }) => $color};
  border-radius: 1px;
  opacity: 0.85;
  animation: ${confettiFall} ${({ $duration }) => $duration}s linear forwards;
  animation-delay: ${({ $delay }) => $delay}s;
`;

// Generate background stars - fewer, more subtle
const stars = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5,
  delay: Math.random() * 4,
}));

// Generate confetti - more elegant, fewer pieces
const confettiPieces = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  color: ['#e8c84a', '#fff', '#d4b445', '#f5f2ed', '#c9b1bc'][Math.floor(Math.random() * 5)],
  delay: Math.random() * 0.4,
  duration: Math.random() * 2 + 3,
}));

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setShowContent(true);
      // Ensure we start at the top
      window.scrollTo(0, 0);
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (password.toUpperCase() === CORRECT_PASSWORD) {
      setHasError(false);
      setIsOpening(true);
      setShowConfetti(true);

      setTimeout(() => {
        setIsUnlocked(true);
        sessionStorage.setItem(STORAGE_KEY, 'true');
      }, 1000);

      setTimeout(() => {
        setShowContent(true);
        // Scroll to top when revealing content
        window.scrollTo(0, 0);
      }, 2800);
    } else {
      setHasError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      inputRef.current?.focus();
    }
  }, [password]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (hasError) setHasError(false);
  }, [hasError]);

  if (showContent) {
    return <ContentWrapper $isVisible>{children}</ContentWrapper>;
  }

  return (
    <>
      <GateWrapper $isUnlocked={isUnlocked}>
        <Stars>
          {stars.map((s) => (
            <Star key={s.id} $x={s.x} $y={s.y} $size={s.size} $delay={s.delay} />
          ))}
        </Stars>

        <ConfettiContainer $active={showConfetti}>
          {confettiPieces.map((c) => (
            <Confetti key={c.id} $x={c.x} $color={c.color} $delay={c.delay} $duration={c.duration} />
          ))}
        </ConfettiContainer>

        <Title>You're Invited</Title>

        <EnvelopeScene>
          <EnvelopeContainer $isShaking={isShaking} $isOpening={isOpening}>
            <Envelope $isOpening={isOpening}>
              <EnvelopeBack $isOpening={isOpening} />
              <Letter $isOpen={isOpening}>
                <LetterNames>Jacques & Caroline</LetterNames>
                <LetterDate>September 26, 2026</LetterDate>
              </Letter>
              <EnvelopeFront />
              <EnvelopeFlap $isOpen={isOpening}>
                <FlapOuter />
                <FlapInner />
              </EnvelopeFlap>
              <WaxSeal $isOpen={isOpening}>
                <SealText>J&C</SealText>
              </WaxSeal>
            </Envelope>
          </EnvelopeContainer>
        </EnvelopeScene>

        <FormSection>
          <form onSubmit={handleSubmit}>
            <PasswordInput
              ref={inputRef}
              type="text"
              value={password}
              onChange={handleChange}
              placeholder="Enter password"
              $hasError={hasError}
              autoComplete="off"
              autoCapitalize="characters"
            />
            {hasError && <ErrorText>Incorrect password</ErrorText>}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
              <SubmitButton type="submit">Open Invitation</SubmitButton>
            </div>
          </form>
        </FormSection>

        <Hint>Check your invitation for the password</Hint>
      </GateWrapper>
      <ContentWrapper $isVisible={false}>{children}</ContentWrapper>
    </>
  );
};
