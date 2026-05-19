import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { footerLinks, featureItems, heroCards } from '@/shared/data/content';
import { Features } from '@/widgets/features/features';
import { Footer } from '@/widgets/footer/footer';
import { Header } from '@/widgets/header/header';
import { Hero } from '@/widgets/hero/hero';
import { World } from '@/widgets/world/world';

describe('Header', () => {
  it('renders logo, navigation and online bank button', () => {
    render(<Header />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText('NeoBank home page')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Online Bank' })).toBeInTheDocument();
  });

  it('renders all main navigation links', () => {
    render(<Header />, { wrapper: MemoryRouter });

    expect(screen.getByRole('link', { name: 'Credit card' })).toHaveAttribute('href', '/loan');
    expect(screen.getByRole('link', { name: 'Product' })).toHaveAttribute('href', '/#features');
    expect(screen.getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '/#news');
  });

  it('marks credit card link as current on loan page', () => {
    render(
      <MemoryRouter initialEntries={['/loan']}>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Credit card' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('Footer', () => {
  it('renders company logo and contacts', () => {
    render(<Footer />);

    expect(screen.getByAltText('NeoFlex')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+7 (495) 984 25 13' })).toHaveAttribute('href', 'tel:+74959842513');
    expect(screen.getByRole('link', { name: 'info@neoflex.ru' })).toHaveAttribute('href', 'mailto:info@neoFlex.ru');
  });

  it('renders every footer navigation item', () => {
    render(<Footer />);

    const navigation = screen.getByRole('navigation', { name: 'Footer navigation' });
    expect(within(navigation).getAllByRole('link')).toHaveLength(footerLinks.length);
    expect(screen.getByRole('link', { name: 'Investors' })).toBeInTheDocument();
  });

  it('renders compliance link and cookie note', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: 'Compliance and business ethics' })).toBeInTheDocument();
    expect(screen.getByText(/We use cookies to personalize our services/i)).toBeInTheDocument();
  });
});

describe('Hero', () => {
  it('renders title and choose card link', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { name: /Choose the design you like/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Choose the card' })).toHaveAttribute('href', '/loan');
  });

  it('renders all card design images', () => {
    render(<Hero />);

    expect(screen.getByLabelText('Card designs')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(heroCards.length);
  });

  it('uses meaningful alt text for card images', () => {
    render(<Hero />);

    heroCards.forEach((card) => {
      expect(screen.getByAltText(card.alt)).toBeInTheDocument();
    });
  });
});

describe('Features', () => {
  it('renders title, description and illustration', () => {
    render(<Features />);

    expect(screen.getByRole('heading', { name: 'We Provide Many Features You Can Use' })).toBeInTheDocument();
    expect(screen.getByText(/You can explore the features/i)).toBeInTheDocument();
    expect(screen.getByAltText('Bank application illustration')).toBeInTheDocument();
  });

  it('renders every feature item from content', () => {
    render(<Features />);

    featureItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('hides decorative check icons from accessibility tree', () => {
    const { container } = render(<Features />);

    expect(container.querySelectorAll('.features__item-icon[aria-hidden="true"]')).toHaveLength(featureItems.length);
  });
});

describe('World', () => {
  it('renders section title', () => {
    render(<World />);

    expect(screen.getByRole('heading', { name: 'You can use our services anywhere in the world' })).toBeInTheDocument();
  });

  it('renders supporting description', () => {
    render(<World />);

    expect(screen.getByText('Withdraw and transfer money online through our application')).toBeInTheDocument();
  });

  it('renders world map image with accessible alt text', () => {
    render(<World />);

    expect(screen.getByAltText('World map with bank coverage points')).toBeInTheDocument();
  });
});
