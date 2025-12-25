import styled from 'styled-components';
import { Section } from './Section';
import { Timeline } from './Timeline';
import { weddingConfig } from '../config/weddingConfig';

const ScheduleHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  ${({ theme }) => theme.media.tablet} {
    margin-bottom: 3rem;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.navy};
`;

const ScheduleNote = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-style: italic;
  max-width: 100%;
  margin: 0 auto;

  ${({ theme }) => theme.media.tablet} {
    max-width: 500px;
  }
`;

export const Schedule: React.FC = () => {
  return (
    <Section id="schedule" background="cream" oysterShells="schedule">
      <ScheduleHeader>
        <SectionTitle>The Weekend</SectionTitle>
        <ScheduleNote>{weddingConfig.copy.scheduleNote}</ScheduleNote>
      </ScheduleHeader>
      <Timeline days={weddingConfig.schedule} />
    </Section>
  );
};
