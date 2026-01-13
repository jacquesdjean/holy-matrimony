import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Section } from './Section';
import { weddingConfig } from '../config/weddingConfig';

const WelcomeContent = styled.div`
  text-align: center;
  /* Mobile-first: full width */
  max-width: 100%;
  margin: 0 auto 2rem;

  ${({ theme }) => theme.media.tablet} {
    max-width: 700px;
    margin-bottom: 3rem;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.navy};

  ${({ theme }) => theme.media.tablet} {
    margin-bottom: 1.5rem;
  }
`;

const WelcomeText = styled.p`
  /* Mobile-first: base size */
  font-size: 1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.muted};

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.125rem;
  }
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const SliderTrack = styled.div<{ $currentIndex: number; $totalSlides: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${({ $currentIndex }) => -$currentIndex * 100}%);
`;

const Slide = styled.div`
  min-width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;

  ${({ theme }) => theme.media.tablet} {
    aspect-ratio: 21 / 9;
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SliderDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.navy : theme.colors.sand};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  padding: 0;
  min-height: auto;

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.navy : theme.colors.muted};
  }
`;

const SliderButton = styled.button<{ $direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $direction }) => ($direction === 'prev' ? 'left: 1rem;' : 'right: 1rem;')}
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 10;
  color: ${({ theme }) => theme.colors.navy};
  font-size: 1.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${({ theme }) => theme.media.tablet} {
    width: 48px;
    height: 48px;
    min-height: 48px;
  }
`;

export const Welcome: React.FC = () => {
  const images = weddingConfig.images.town;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [goToNext, isPaused]);

  return (
    <Section id="welcome" background="white">
      <WelcomeContent>
        <SectionTitle>Welcome to Apalachicola</SectionTitle>
        <WelcomeText>{weddingConfig.copy.welcome}</WelcomeText>
      </WelcomeContent>
      <SliderContainer
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <SliderTrack $currentIndex={currentIndex} $totalSlides={images.length}>
          {images.map((image, index) => (
            <Slide key={index}>
              <SlideImage src={image} alt={`Apalachicola ${index + 1}`} loading="eager" />
            </Slide>
          ))}
        </SliderTrack>
        <SliderButton $direction="prev" onClick={goToPrev} aria-label="Previous slide">
          &#8249;
        </SliderButton>
        <SliderButton $direction="next" onClick={goToNext} aria-label="Next slide">
          &#8250;
        </SliderButton>
      </SliderContainer>
      <SliderDots>
        {images.map((_, index) => (
          <Dot
            key={index}
            $active={index === currentIndex}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </SliderDots>
    </Section>
  );
};
