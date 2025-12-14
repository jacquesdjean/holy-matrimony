import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../config/weddingConfig';

const Nav = styled.nav<{ $scrolled: boolean; $menuOpen: boolean }>`
  /* Mobile: not sticky to save screen real estate */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem;
  background-color: ${({ $menuOpen, theme }) =>
    $menuOpen ? theme.colors.white : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.normal};

  ${({ theme }) => theme.media.tablet} {
    /* Tablet+: sticky nav */
    position: fixed;
    padding: 1rem 2rem;
    background-color: ${({ $scrolled, $menuOpen, theme }) =>
      $scrolled || $menuOpen ? theme.colors.white : 'transparent'};
    box-shadow: ${({ $scrolled, theme }) => ($scrolled ? theme.shadows.md : 'none')};
  }
`;

const NavContent = styled.div`
  max-width: ${({ theme }) => theme.maxWidth.wide};
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.a<{ $scrolled: boolean }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.fontWeights.light};
  letter-spacing: 0.1em;
  color: ${({ $scrolled, theme }) =>
    $scrolled ? theme.colors.navy : theme.colors.white};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  text-shadow: ${({ $scrolled }) => ($scrolled ? 'none' : '0 1px 10px rgba(0, 0, 0, 0.3)')};
  -webkit-tap-highlight-color: transparent;
  /* Minimum touch target */
  min-height: ${({ theme }) => theme.touch.minTarget};
  display: flex;
  align-items: center;

  &:active {
    opacity: 0.8;
  }

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.yellow};
    }
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5rem;
  }
`;

/* Mobile: horizontal scrolling nav links */
const NavLinks = styled.ul<{ $menuOpen: boolean; $scrolled: boolean }>`
  /* Mobile: hidden by default, show as dropdown */
  display: ${({ $menuOpen }) => ($menuOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  gap: 0;

  ${({ theme }) => theme.media.tablet} {
    /* Tablet+: horizontal nav */
    display: flex;
    flex-direction: row;
    position: static;
    background-color: transparent;
    padding: 0;
    box-shadow: none;
    gap: 1.5rem;
  }
`;

const NavLink = styled.a<{ $scrolled: boolean; $inMenu?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $scrolled, $inMenu, theme }) =>
    $scrolled || $inMenu ? theme.colors.navy : theme.colors.white};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  text-shadow: ${({ $scrolled, $inMenu }) =>
    $scrolled || $inMenu ? 'none' : '0 1px 10px rgba(0, 0, 0, 0.3)'};
  -webkit-tap-highlight-color: transparent;
  /* Minimum touch target for mobile */
  min-height: ${({ theme }) => theme.touch.minTarget};
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0.5rem;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.yellow};
    transform: scaleX(0);
    transition: transform ${({ theme }) => theme.transitions.fast};
  }

  &:active {
    opacity: 0.8;
  }

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.yellow};

      &::after {
        transform: scaleX(1);
      }
    }
  }

  ${({ theme }) => theme.media.tablet} {
    padding: 0.5rem 0;
  }
`;

const MenuButton = styled.button<{ $scrolled: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  /* Minimum touch target */
  min-width: ${({ theme }) => theme.touch.minTarget};
  min-height: ${({ theme }) => theme.touch.minTarget};

  &:active {
    opacity: 0.8;
  }

  ${({ theme }) => theme.media.tablet} {
    display: none;
  }

  span {
    display: block;
    width: 24px;
    height: 2px;
    background-color: ${({ $scrolled, theme }) =>
      $scrolled ? theme.colors.navy : theme.colors.white};
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;

const navItems = [
  { label: 'Welcome', href: '#welcome' },
  { label: 'Weekend', href: '#schedule' },
  { label: 'Venues', href: '#venues' },
  { label: 'Travel', href: '#travel' },
  { label: 'Stay', href: '#lodging' },
  { label: 'Contact', href: '#contact' },
];

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <Nav $scrolled={scrolled} $menuOpen={menuOpen}>
      <NavContent>
        <Logo href="#home" $scrolled={scrolled || menuOpen}>
          {weddingConfig.couple.navName}
        </Logo>
        <MenuButton
          $scrolled={scrolled || menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </MenuButton>
        <NavLinks $menuOpen={menuOpen} $scrolled={scrolled}>
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                $scrolled={scrolled}
                $inMenu={menuOpen}
                onClick={handleLinkClick}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </NavLinks>
      </NavContent>
    </Nav>
  );
};
