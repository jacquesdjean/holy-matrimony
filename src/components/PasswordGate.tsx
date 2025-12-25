import { useState, useEffect, useRef } from 'react';
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
  50% {
    transform: translateY(-20px) rotate(2deg);
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

const envelopeOpen = keyframes`
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(180deg);
  }
`;

const letterSlide = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-100px);
    opacity: 1;
  }
  100% {
    transform: translateY(-200px) scale(3);
    opacity: 0;
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
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
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
  background: linear-gradient(135deg, #1e3a5f 0%, #152a45 50%, #1e3a5f 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  ${({ $isUnlocked }) =>
    $isUnlocked &&
    css`
      animation: ${fadeOut} 1s ease-out forwards;
      animation-delay: 1.5s;
    `}
`;

const ContentWrapper = styled.div<{ $isVisible: boolean }>`
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : 'none')} 0.5s ease-out;
`;

const EnvelopeContainer = styled.div<{ $isShaking: boolean; $isOpening: boolean }>`
  position: relative;
  perspective: 1000px;
  animation: ${float} 4s ease-in-out infinite;

  ${({ $isShaking }) =>
    $isShaking &&
    css`
      animation: ${shake} 0.5s ease-in-out;
    `}

  ${({ $isOpening }) =>
    $isOpening &&
    css`
      animation: none;
    `}
`;

const Envelope = styled.div`
  width: 280px;
  height: 180px;
  position: relative;

  @media (min-width: 768px) {
    width: 340px;
    height: 220px;
  }
`;

const EnvelopeBody = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #faf8f5 0%, #e8e4de 100%);
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 5px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to top, rgba(0,0,0,0.03) 0%, transparent 100%);
  }
`;

const EnvelopeFlap = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  transform-origin: top center;
  transform-style: preserve-3d;
  z-index: 10;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      animation: ${envelopeOpen} 0.8s ease-out forwards;
    `}
`;

const FlapFront = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 140px solid transparent;
  border-right: 140px solid transparent;
  border-top: 90px solid #e8e4de;
  transform: rotateX(0deg);
  backface-visibility: hidden;

  @media (min-width: 768px) {
    border-left: 170px solid transparent;
    border-right: 170px solid transparent;
    border-top: 110px solid #e8e4de;
  }

  &::after {
    content: '';
    position: absolute;
    top: -90px;
    left: -140px;
    width: 280px;
    height: 90px;
    background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 50%);
    clip-path: polygon(50% 100%, 0 0, 100% 0);

    @media (min-width: 768px) {
      top: -110px;
      left: -170px;
      width: 340px;
      height: 110px;
    }
  }
`;

const FlapBack = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 140px solid transparent;
  border-right: 140px solid transparent;
  border-top: 90px solid #d4cfc7;
  transform: rotateX(180deg);
  backface-visibility: hidden;

  @media (min-width: 768px) {
    border-left: 170px solid transparent;
    border-right: 170px solid transparent;
    border-top: 110px solid #d4cfc7;
  }
`;

const WaxSeal = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 30% 30%, #C9B1BC 0%, #B8A0AA 50%, #a08999 100%);
  border-radius: 50%;
  z-index: 20;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      opacity: 0;
      transform: translate(-50%, -50%) scale(1.5);
      transition: all 0.3s ease;
    `}

  &::before {
    content: 'J&C';
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.25rem;
    color: #faf8f5;
    font-weight: 300;
    letter-spacing: 0.05em;
  }

  @media (min-width: 768px) {
    width: 70px;
    height: 70px;

    &::before {
      font-size: 1.5rem;
    }
  }
`;

const Letter = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  height: 60%;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  z-index: 5;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      animation: ${letterSlide} 1.2s ease-in-out forwards;
      animation-delay: 0.3s;
    `}
`;

const LetterText = styled.span`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.25rem;
  color: #1e3a5f;
  font-weight: 300;
  letter-spacing: 0.1em;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const LetterDate = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #6b6b6b;
  letter-spacing: 0.15em;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Title = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 300;
  font-size: 1.5rem;
  color: #faf8f5;
  letter-spacing: 0.15em;
  margin-bottom: 2.5rem;
  text-align: center;
  text-transform: uppercase;
  opacity: 0.9;

  @media (min-width: 768px) {
    font-size: 1.75rem;
    letter-spacing: 0.2em;
  }
`;

const PasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2.5rem;
`;

const PasswordInput = styled.input<{ $hasError: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid ${({ $hasError }) => ($hasError ? '#ff6b6b' : 'rgba(250, 248, 245, 0.3)')};
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #faf8f5;
  letter-spacing: 0.25em;
  text-align: center;
  width: 280px;
  outline: none;
  transition: all 0.3s ease;
  text-transform: uppercase;

  &::placeholder {
    color: rgba(250, 248, 245, 0.5);
    letter-spacing: 0.15em;
    text-transform: none;
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? '#ff6b6b' : '#F4D35E')};
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 20px rgba(244, 211, 94, 0.2);
  }

  @media (min-width: 768px) {
    width: 320px;
    font-size: 1.125rem;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #F4D35E 0%, #E8C84A 100%);
  border: none;
  border-radius: 8px;
  padding: 1rem 3rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e3a5f;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(244, 211, 94, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  opacity: 0.9;
`;

const Hint = styled.p`
  color: rgba(250, 248, 245, 0.5);
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  margin-top: 1.5rem;
  text-align: center;
  max-width: 280px;
  line-height: 1.5;
`;

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if already authenticated
  useEffect(() => {
    const isGranted = sessionStorage.getItem(STORAGE_KEY);
    if (isGranted === 'true') {
      setShowContent(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.toUpperCase() === CORRECT_PASSWORD) {
      setHasError(false);
      setIsOpening(true);

      // Delay the unlock to allow animation to play
      setTimeout(() => {
        setIsUnlocked(true);
        sessionStorage.setItem(STORAGE_KEY, 'true');
      }, 800);

      // Show content after animations complete
      setTimeout(() => {
        setShowContent(true);
      }, 2500);
    } else {
      setHasError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (hasError) setHasError(false);
  };

  if (showContent) {
    return <ContentWrapper $isVisible={true}>{children}</ContentWrapper>;
  }

  return (
    <>
      <GateWrapper $isUnlocked={isUnlocked}>
        <Title>You're Invited</Title>

        <EnvelopeContainer $isShaking={isShaking} $isOpening={isOpening}>
          <Envelope>
            <EnvelopeBody />
            <Letter $isOpen={isOpening}>
              <LetterText>Jacques & Caroline</LetterText>
              <LetterDate>September 26, 2026</LetterDate>
            </Letter>
            <EnvelopeFlap $isOpen={isOpening}>
              <FlapFront />
              <FlapBack />
            </EnvelopeFlap>
            <WaxSeal $isOpen={isOpening} />
          </Envelope>
        </EnvelopeContainer>

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
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
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
