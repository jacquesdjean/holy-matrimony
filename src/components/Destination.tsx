import styled from 'styled-components';
import { Section } from './Section';
import { weddingConfig } from '../config/weddingConfig';

const DestinationHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  ${({ theme }) => theme.media.tablet} {
    margin-bottom: 2rem;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.navy};
`;

const ContentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  ${({ theme }) => theme.media.tablet} {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
`;

const HighlightsCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;

  ${({ theme }) => theme.media.tablet} {
    padding: 2rem;
  }
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 1rem;
  font-size: 1.25rem;

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5rem;
  }
`;

const HighlightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const HighlightItem = styled.li`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.charcoal};
  padding: 0.75rem 0;
  padding-left: 1.5rem;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.sand};
  line-height: 1.5;

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 1.1rem;
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.yellow};
    border-radius: 50%;
  }
`;

const ThingsToDoCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;

  ${({ theme }) => theme.media.tablet} {
    padding: 2rem;
  }
`;

const ThingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ThingItem = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.cream};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ThingName = styled.h4`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.navy};
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const ThingDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
`;

export const Destination: React.FC = () => {
  const { destination } = weddingConfig;

  return (
    <Section id="destination" background="cream">
      <DestinationHeader>
        <SectionTitle>About Apalachicola</SectionTitle>
      </DestinationHeader>

      <ContentGrid>
        <HighlightsCard>
          <CardTitle>What to Expect</CardTitle>
          <HighlightsList>
            {destination.highlights.map((highlight, index) => (
              <HighlightItem key={index}>{highlight}</HighlightItem>
            ))}
          </HighlightsList>
        </HighlightsCard>

        <ThingsToDoCard>
          <CardTitle>Things to Do</CardTitle>
          <ThingsList>
            {destination.thingsToDo.map((thing, index) => (
              <ThingItem key={index}>
                <ThingName>{thing.name}</ThingName>
                <ThingDescription>{thing.description}</ThingDescription>
              </ThingItem>
            ))}
          </ThingsList>
        </ThingsToDoCard>
      </ContentGrid>
    </Section>
  );
};
