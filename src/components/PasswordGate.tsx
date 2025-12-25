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
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
`;

const sealGlow = keyframes`
  0%, 100% {
    box-shadow: 0 4px 15px rgba(212, 165, 116, 0.4), 0 0 20px rgba(244, 211, 94, 0.2);
  }
  50% {
    box-shadow: 0 4px 20px rgba(212, 165, 116, 0.6), 0 0 30px rgba(244, 211, 94, 0.3);
  }
`;

const sealBreak = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
`;

const flapOpen = keyframes`
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(-170deg);
  }
`;

const letterEmerge = keyframes`
  0% {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-180px) scale(1.3);
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
  background: radial-gradient(ellipse at 50% 30%, #1e3a5f 0%, #152a45 60%, #0d1a2d 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  overflow: hidden;

  ${({ $isUnlocked }) =>
    $isUnlocked &&
    css`
      animation: ${fadeOut} 1s ease-out forwards;
      animation-delay: 1.8s;
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
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: ${twinkle} ${({ $delay }) => 2 + $delay}s ease-in-out infinite;
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
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const EnvelopeScene = styled.div`
  perspective: 800px;
`;

const EnvelopeContainer = styled.div<{ $isShaking: boolean; $isOpening: boolean }>`
  animation: ${({ $isOpening }) => ($isOpening ? 'none' : float)} 4s ease-in-out infinite;

  ${({ $isShaking }) =>
    $isShaking &&
    css`
      animation: ${shake} 0.5s ease-in-out;
    `}
`;

const Envelope = styled.div`
  position: relative;
  width: 280px;
  height: 180px;
  transform-style: preserve-3d;

  @media (min-width: 768px) {
    width: 340px;
    height: 220px;
  }
`;

const EnvelopeBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #f8f6f2 0%, #ebe7e0 100%);
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
`;

const EnvelopeFront = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(180deg, #f5f2ed 0%, #e8e4dc 100%);
  border-radius: 0 0 8px 8px;
  z-index: 5;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.08);
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

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      animation: ${flapOpen} 0.8s ease-out forwards;
    `}
`;

const FlapOuter = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #ebe7e0 0%, #ddd8cf 100%);
  clip-path: polygon(0 0, 50% 100%, 100% 0);
  backface-visibility: hidden;
`;

const FlapInner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1e3a5f 0%, #2a4a6e 100%);
  clip-path: polygon(0 0, 50% 100%, 100% 0);
  transform: rotateX(180deg);
  backface-visibility: hidden;
`;

const Letter = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  height: 70%;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  z-index: 2;
  padding: 1rem;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      animation: ${letterEmerge} 1.2s ease-out forwards;
      animation-delay: 0.4s;
    `}
`;

const LetterNames = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.25rem;
  color: #1e3a5f;
  font-weight: 400;
  letter-spacing: 0.08em;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const LetterDate = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  color: #8b7355;
  letter-spacing: 0.15em;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 0.75rem;
  }
`;

const WaxSeal = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(ellipse at 35% 35%, #d4a574 0%, #b8834a 50%, #8b6340 100%);
  border-radius: 50%;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ $isOpen }) => ($isOpen ? sealBreak : sealGlow)} ${({ $isOpen }) => ($isOpen ? '0.5s' : '2.5s')} ${({ $isOpen }) => ($isOpen ? 'ease-out forwards' : 'ease-in-out infinite')};

  @media (min-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

const SealText = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.1rem;
  color: #faf8f5;
  font-weight: 500;
  letter-spacing: 0.02em;

  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

const FormSection = styled.div`
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 50;
`;

const PasswordInput = styled.input<{ $hasError: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${({ $hasError }) => ($hasError ? '#ff7070' : 'rgba(255, 255, 255, 0.25)')};
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #fff;
  letter-spacing: 0.25em;
  text-align: center;
  width: 280px;
  outline: none;
  text-transform: uppercase;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.1em;
    text-transform: none;
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? '#ff7070' : 'rgba(244, 211, 94, 0.7)')};
    background: rgba(255, 255, 255, 0.15);
  }

  @media (min-width: 768px) {
    width: 320px;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #F4D35E 0%, #d4b445 100%);
  border: none;
  border-radius: 8px;
  padding: 1rem 2.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e3a5f;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 2s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(244, 211, 94, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorText = styled.p`
  color: #ff8080;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
`;

const Hint = styled.p`
  color: rgba(255, 255, 255, 0.35);
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  margin-top: 1.5rem;
  letter-spacing: 0.05em;
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
  width: 8px;
  height: 8px;
  background: ${({ $color }) => $color};
  animation: ${confettiFall} ${({ $duration }) => $duration}s linear forwards;
  animation-delay: ${({ $delay }) => $delay}s;
`;

// Generate background stars
const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 3,
}));

// Generate confetti
const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  color: ['#F4D35E', '#fff', '#E8C84A', '#C9B1BC', '#ffd700'][Math.floor(Math.random() * 5)],
  delay: Math.random() * 0.5,
  duration: Math.random() * 2 + 2.5,
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
            <Envelope>
              <EnvelopeBack />
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
