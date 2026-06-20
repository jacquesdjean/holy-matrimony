import styled from 'styled-components';
import { Section } from './Section';
import { weddingConfig } from '../config/weddingConfig';

const RsvpContent = styled.div`
  text-align: center;
  max-width: 100%;
  margin: 0 auto;

  ${({ theme }) => theme.media.tablet} {
    max-width: 500px;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.navy};
`;

const Intro = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1.5rem;
  line-height: 1.7;

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.25rem;
  }
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.navy};
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  min-height: ${({ theme }) => theme.touch.minButton};
  min-width: 200px;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }

  @media (hover: hover) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.navyDark};
    }
  }
`;

const Divider = styled.div`
  width: 60px;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.sand};
  margin: 2.5rem auto;

  ${({ theme }) => theme.media.tablet} {
    margin: 3rem auto;
  }
`;

const GiftNote = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1.5rem;
  line-height: 1.7;

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.25rem;
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.navy};
  border: 1px solid ${({ theme }) => theme.colors.navy};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  min-height: ${({ theme }) => theme.touch.minButton};
  min-width: 200px;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }

  @media (hover: hover) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.navy};
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

export const Rsvp: React.FC = () => {
  const { rsvp, registry, copy } = weddingConfig;

  return (
    <Section id="rsvp" background="white">
      <RsvpContent>
        <SectionTitle>RSVP</SectionTitle>
        <Intro>
          If you haven't already, please let us know you're coming by {rsvp.deadline}.
        </Intro>
        <PrimaryButton
          href={rsvp.formLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          RSVP Here
        </PrimaryButton>

        <Divider />

        <GiftNote>{copy.giftNote}</GiftNote>
        <SecondaryButton
          href={registry.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Our Registry
        </SecondaryButton>
      </RsvpContent>
    </Section>
  );
};
