import styled from 'styled-components';
import { weddingConfig } from '../config/weddingConfig';

const HeroWrapper = styled.section`
  position: relative;
  min-height: 100svh; /* Use svh for mobile browser chrome */
  min-height: 100vh; /* Fallback */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  padding: 2rem 1rem;
`;

interface HeroBackgroundProps {
  $imageUrl: string;
}

const HeroBackground = styled.div<HeroBackgroundProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${({ $imageUrl }) => $imageUrl});
  background-size: cover;
  /* Mobile-first: shift focal point to center both subjects */
  background-position: 45% center;
  background-repeat: no-repeat;
  z-index: 0;

  /* Extra small phones need more adjustment */
  @media (max-width: 380px) {
    background-position: 42% center;
  }

  ${({ theme }) => theme.media.tablet} {
    background-position: center;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.overlay};
  }
`;


const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  padding: ${({ theme }) => theme.spacing.md};
  max-width: 100%;
`;

const CoupleName = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.yellow};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  /* Mobile-first: base size */
  font-size: 2.5rem;
  line-height: 1.1;

  ${({ theme }) => theme.media.tablet} {
    font-size: 3.5rem;
    letter-spacing: 0.15em;
  }

  ${({ theme }) => theme.media.desktop} {
    font-size: 4.5rem;
  }
`;

const DateLocation = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.offWhite};
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  /* Mobile-first */
  font-size: 1rem;
  margin-top: 1rem;

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.125rem;
    letter-spacing: 0.2em;
  }

  ${({ theme }) => theme.media.desktop} {
    font-size: 1.25rem;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  opacity: 0.8;
  color: ${({ theme }) => theme.colors.offWhite};
  /* CSS animation - better performance */
  animation: bounce 2s infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }
`;

const ScrollText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

const ScrollArrow = styled.div`
  width: 20px;
  height: 20px;
  border-right: 2px solid ${({ theme }) => theme.colors.offWhite};
  border-bottom: 2px solid ${({ theme }) => theme.colors.offWhite};
  transform: rotate(45deg);
  opacity: 0.8;
`;

export const Hero: React.FC = () => {
  return (
    <HeroWrapper id="home">
      <HeroBackground $imageUrl={weddingConfig.images.hero} />
      <HeroContent>
        <CoupleName>{weddingConfig.couple.name}</CoupleName>
        <DateLocation>
          {weddingConfig.date.short} · {weddingConfig.location.city}, {weddingConfig.location.state}
        </DateLocation>
      </HeroContent>
      <ScrollIndicator>
        <ScrollText>Scroll</ScrollText>
        <ScrollArrow />
      </ScrollIndicator>
    </HeroWrapper>
  );
};
