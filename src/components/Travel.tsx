import styled from 'styled-components';
import { Section } from './Section';
import { AirportCard } from './AirportCard';
import { DrivingRoute } from './DrivingRoute';
import { weddingConfig } from '../config/weddingConfig';

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.navy};
`;

const Subtitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 1rem;
  margin-top: 2rem;
  font-size: 1.25rem;
  text-align: center;

  &:first-of-type {
    margin-top: 0;
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5rem;
  }
`;

const AirportsGrid = styled.div`
  /* Mobile-first: stacked and centered */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  /* Make cards full width within centered container */
  > * {
    width: 100%;
    max-width: 400px;
  }

  ${({ theme }) => theme.media.tablet} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    max-width: 600px;
    margin: 0 auto 1rem;

    > * {
      width: auto;
      max-width: none;
    }
  }
`;

const Note = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.muted};
  font-style: italic;
  text-align: center;
`;

const ShuttleSection = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: center;
  overflow: hidden;
  position: relative;

  ${({ theme }) => theme.media.tablet} {
    padding: 2rem;
  }
`;

const ShuttleTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ShuttleIcon = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.navy};

  svg {
    width: 1.25rem;
    height: 1.25rem;

    ${({ theme }) => theme.media.tablet} {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
`;

const ShuttleTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  color: ${({ theme }) => theme.colors.navy};
  font-size: 1.25rem;
  margin: 0;

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5rem;
  }
`;

const ShuttleInfo = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1rem;
`;

const ShuttleReturn = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1rem;
`;

const ShuttleNote = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.muted};
  font-style: italic;
`;

const ShuttleEmailLink = styled.a`
  color: ${({ theme }) => theme.colors.navy};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: underline;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.8;
  }

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.navyDark};
    }
  }
`;

export const Travel: React.FC = () => {
  const { airports, shuttles, drivingFromTexas } = weddingConfig.travel;

  return (
    <Section id="travel" background="cream" oysterShells="travel">
      <SectionTitle>Travel</SectionTitle>

      <Subtitle>Getting There by Air</Subtitle>
      <AirportsGrid>
        {airports.map((airport) => (
          <AirportCard
            key={airport.code}
            code={airport.code}
            name={airport.name}
            distance={airport.distance}
            driveTime={airport.driveTime}
            recommended={airport.recommended}
          />
        ))}
      </AirportsGrid>
      <Note>Rental cars are available at both airports, and we're offering shuttles from each. Tallahassee (TLH) is the closer, easier option; Panama City (ECP) works well too with a slightly longer drive.</Note>

      <ShuttleSection>
        <ShuttleTitleWrapper>
          <ShuttleIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6v6m8-6v6M2 12h20M4 18v2m16-2v2" />
              <rect x="3" y="6" width="18" height="12" rx="2" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
            </svg>
          </ShuttleIcon>
          <ShuttleTitle>Shuttle Service</ShuttleTitle>
        </ShuttleTitleWrapper>
        <ShuttleInfo>We're renting a sprinter van for the weekend and offering pre-reserved rides between the airports — Tallahassee (TLH) and Panama City (ECP) — and the Gibson Inn for guests without a car.</ShuttleInfo>
        <ShuttleReturn>{shuttles.returnTime}</ShuttleReturn>
        <ShuttleNote>
          Email{' '}
          <ShuttleEmailLink href={`mailto:${weddingConfig.contact.email}`}>
            {weddingConfig.contact.email}
          </ShuttleEmailLink>{' '}
          with your flight times and pickup or departure needs, and we'll save you a seat.
        </ShuttleNote>
      </ShuttleSection>

      <DrivingRoute
        intro={drivingFromTexas.intro}
        stopover={drivingFromTexas.stopover}
        driveTimes={drivingFromTexas.driveTimes}
      />
    </Section>
  );
};
