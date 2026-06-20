import styled from 'styled-components';
import { Section } from './Section';
import { weddingConfig } from '../config/weddingConfig';

const ContactContent = styled.div`
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

const EmailLink = styled.a`
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
  margin-bottom: 1.5rem;
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

export const Contact: React.FC = () => {
  return (
    <Section id="contact" background="cream">
      <ContactContent>
        <SectionTitle>Questions?</SectionTitle>
        <Intro>We can't wait to celebrate with you.</Intro>
        <EmailLink href={`mailto:${weddingConfig.contact.email}`}>
          {weddingConfig.contact.email}
        </EmailLink>
      </ContactContent>
    </Section>
  );
};
