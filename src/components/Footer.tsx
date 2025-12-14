import styled from 'styled-components';
import { weddingConfig } from '../config/weddingConfig';

const FooterWrapper = styled.footer`
  position: relative;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  /* Safe area padding for notched devices */
  padding-bottom: calc(2rem + env(safe-area-inset-bottom));

  ${({ theme }) => theme.media.tablet} {
    min-height: 60vh;
  }
`;

const FooterBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.navy},
    ${({ theme }) => theme.colors.navyDark}
  );
  z-index: 0;

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

const ImagePlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.muted};
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const FooterContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem 1rem;

  ${({ theme }) => theme.media.tablet} {
    padding: 3rem;
  }
`;

const ClosingText = styled.p`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  color: ${({ theme }) => theme.colors.mauve};
  /* Mobile-first */
  font-size: 1.5rem;

  ${({ theme }) => theme.media.tablet} {
    font-size: 2rem;
  }

  ${({ theme }) => theme.media.desktop} {
    font-size: 2.5rem;
  }
`;

const DateText = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.yellow};
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  font-size: 1rem;

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.125rem;
  }
`;

export const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterBackground>
        <ImagePlaceholder>[{weddingConfig.images.closing}]</ImagePlaceholder>
      </FooterBackground>
      <FooterContent>
        <ClosingText>{weddingConfig.copy.closing}</ClosingText>
        <DateText>{weddingConfig.date.short}</DateText>
      </FooterContent>
    </FooterWrapper>
  );
};
