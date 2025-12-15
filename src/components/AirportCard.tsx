import styled from 'styled-components';

interface AirportCardProps {
  code: string;
  name: string;
  distance: string;
  driveTime: string;
  recommended?: boolean;
}

const Card = styled.div<{ $recommended: boolean }>`
  /* Mobile-first: horizontal layout */
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.sand};
  position: relative;

  ${({ theme }) => theme.media.tablet} {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
`;

const RecommendedBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  color: ${({ theme }) => theme.colors.navy};
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  ${({ theme }) => theme.media.tablet} {
    top: 0.75rem;
    right: 1rem;
    font-size: 0.6875rem;
  }
`;

const AirportCode = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.navy};
  min-width: 60px;

  ${({ theme }) => theme.media.tablet} {
    font-size: 2rem;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AirportName = styled.span`
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.charcoal};
`;

const TravelInfo = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 0.25rem;
`;

export const AirportCard: React.FC<AirportCardProps> = ({
  code,
  name,
  distance,
  driveTime,
  recommended = false,
}) => {
  return (
    <Card $recommended={recommended}>
      {recommended && <RecommendedBadge>Recommended</RecommendedBadge>}
      <AirportCode>{code}</AirportCode>
      <Details>
        <AirportName>{name}</AirportName>
        <TravelInfo>{distance} · {driveTime}</TravelInfo>
      </Details>
    </Card>
  );
};
