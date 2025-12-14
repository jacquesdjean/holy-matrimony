import styled from 'styled-components';

interface VenueCardProps {
  name: string;
  role?: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  mapLink?: string;
  image: string;
  notes?: string[];
  roomBlockNote?: string;
  additionalNote?: string;
}

const Card = styled.div`
  /* Mobile-first: stacked layout */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};

  ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
  }
`;

interface ImageContainerProps {
  $imageUrl: string;
}

const ImageContainer = styled.div<ImageContainerProps>`
  /* Mobile-first */
  width: 100%;
  aspect-ratio: 16 / 9;
  background-image: url(${({ $imageUrl }) => $imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: ${({ theme }) => theme.colors.sand};

  ${({ theme }) => theme.media.tablet} {
    width: 40%;
    aspect-ratio: 4 / 3;
    flex-shrink: 0;
  }
`;

const Content = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;

  ${({ theme }) => theme.media.tablet} {
    padding: 2rem;
  }
`;

const VenueName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 0.25rem;
  /* Mobile-first */
  font-size: 1.25rem;

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const VenueRole = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.yellow};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  display: block;
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.7;
  margin-bottom: 0.75rem;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.charcoal};
  margin: 0;

  a {
    color: ${({ theme }) => theme.colors.navy};
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;

    &:active {
      opacity: 0.8;
    }

    @media (hover: hover) {
      &:hover {
        color: ${({ theme }) => theme.colors.yellow};
      }
    }
  }
`;

const PhoneLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.navy};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  min-height: ${({ theme }) => theme.touch.minTarget};
  -webkit-tap-highlight-color: transparent;
  margin-top: 0.5rem;
  width: fit-content;

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

const NotesList = styled.ul`
  background-color: ${({ theme }) => theme.colors.cream};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: 0.75rem;
`;

const NoteItem = styled.li`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.charcoal};
  padding-left: 1rem;
  position: relative;
  margin-bottom: 0.25rem;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.navy};
  }
`;

const RoomBlockNote = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.navyDark};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background-color: ${({ theme }) => theme.colors.yellowLight};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: 0.75rem;
`;

const AdditionalNote = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.muted};
  font-style: italic;
  margin-top: 0.75rem;
`;

export const VenueCard: React.FC<VenueCardProps> = ({
  name,
  role,
  description,
  address,
  phone,
  website,
  mapLink,
  image,
  notes,
  roomBlockNote,
  additionalNote,
}) => {
  return (
    <Card>
      <ImageContainer $imageUrl={image} />
      <Content>
        <VenueName>{name}</VenueName>
        {role && <VenueRole>{role}</VenueRole>}
        <Description>{description}</Description>
        {(address || website) && (
          <Details>
            {address && (
              <DetailItem>
                {mapLink ? (
                  <a href={mapLink} target="_blank" rel="noopener noreferrer">
                    {address}
                  </a>
                ) : (
                  address
                )}
              </DetailItem>
            )}
            {website && (
              <DetailItem>
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {website.replace('https://www.', '')}
                </a>
              </DetailItem>
            )}
          </Details>
        )}
        {phone && (
          <PhoneLink href={`tel:${phone.replace(/[^0-9+]/g, '')}`}>
            Call {phone}
          </PhoneLink>
        )}
        {notes && notes.length > 0 && (
          <NotesList>
            {notes.map((note, index) => (
              <NoteItem key={index}>{note}</NoteItem>
            ))}
          </NotesList>
        )}
        {roomBlockNote && <RoomBlockNote>{roomBlockNote}</RoomBlockNote>}
        {additionalNote && <AdditionalNote>{additionalNote}</AdditionalNote>}
      </Content>
    </Card>
  );
};
