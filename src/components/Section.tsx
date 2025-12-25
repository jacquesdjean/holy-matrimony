import styled from 'styled-components';
import { OysterShellBackground } from './OysterShellBackground';

interface SectionProps {
  id?: string;
  background?: 'white' | 'cream' | 'sand' | 'navy';
  children: React.ReactNode;
  fullWidth?: boolean;
  oysterShells?: 'schedule' | 'travel';
}

const SectionWrapper = styled.section<{ $background: string }>`
  /* Mobile-first: base padding */
  padding: 3rem 1rem;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme, $background }) => {
    switch ($background) {
      case 'cream':
        return theme.colors.cream;
      case 'sand':
        return theme.colors.sand;
      case 'navy':
        return theme.colors.navy;
      default:
        return theme.colors.white;
    }
  }};

  ${({ theme }) => theme.media.tablet} {
    padding: 4rem 2rem;
  }

  ${({ theme }) => theme.media.desktop} {
    padding: 6rem 4rem;
  }
`;

const SectionContent = styled.div<{ $fullWidth: boolean }>`
  /* Mobile-first: full width */
  max-width: ${({ $fullWidth }) => ($fullWidth ? 'none' : '100%')};
  margin: 0 auto;

  ${({ theme }) => theme.media.tablet} {
    max-width: ${({ theme, $fullWidth }) => ($fullWidth ? 'none' : theme.maxWidth.tablet)};
  }

  ${({ theme }) => theme.media.desktop} {
    max-width: ${({ theme, $fullWidth }) => ($fullWidth ? 'none' : theme.maxWidth.desktop)};
  }
`;

export const Section: React.FC<SectionProps> = ({
  id,
  background = 'white',
  children,
  fullWidth = false,
  oysterShells,
}) => {
  return (
    <SectionWrapper id={id} $background={background}>
      {oysterShells && <OysterShellBackground variant={oysterShells} />}
      <SectionContent $fullWidth={fullWidth}>{children}</SectionContent>
    </SectionWrapper>
  );
};
