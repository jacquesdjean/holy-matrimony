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

export const Schedule: React.FC = () => {
  return (
    <Section id="schedule" background="cream" oysterShells="schedule">
      <ScheduleHeader>
        <SectionTitle>The Weekend</SectionTitle>
      </ScheduleHeader>
      <Timeline days={weddingConfig.schedule} />
    </Section>
  );
};
