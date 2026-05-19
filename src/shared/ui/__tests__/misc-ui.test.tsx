import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Container } from '@/shared/ui/container/container';
import { Divider } from '@/shared/ui/divider/divider';
import { Label } from '@/shared/ui/label/label';
import { Loader } from '@/shared/ui/loader/loader';
import { StatusMessage, StatusButton } from '@/shared/ui/status-message/status-message';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies base container class', () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstElementChild).toHaveClass('container');
  });

  it('adds custom class name', () => {
    const { container } = render(<Container className="custom">Content</Container>);
    expect(container.firstElementChild).toHaveClass('container', 'custom');
  });
});

describe('Divider', () => {
  it('renders separator element', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('applies base divider class', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toHaveClass('divider');
  });

  it('adds custom class name', () => {
    render(<Divider className="loan-divider" />);
    expect(screen.getByRole('separator')).toHaveClass('divider', 'loan-divider');
  });
});

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Name</Label>);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders required marker when required is true', () => {
    render(<Label required>Name</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards htmlFor and custom class', () => {
    render(<Label htmlFor="name" className="extra-label">Name</Label>);
    expect(screen.getByText('Name')).toHaveAttribute('for', 'name');
    expect(screen.getByText('Name')).toHaveClass('field-label', 'extra-label');
  });
});

describe('Loader', () => {
  it('renders with default aria label', () => {
    render(<Loader />);
    expect(screen.getByLabelText('Loading')).toHaveClass('loader');
  });

  it('renders with custom aria label', () => {
    render(<Loader label="Sending" />);
    expect(screen.getByLabelText('Sending')).toBeInTheDocument();
  });

  it('does not expose visual text content', () => {
    const { container } = render(<Loader label="Processing" />);
    expect(container.textContent).toBe('');
  });
});

describe('Tooltip', () => {
  it('renders tooltip content with tooltip role', () => {
    render(<Tooltip content="Helpful text"><span>?</span></Tooltip>);
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('Helpful text');
  });

  it('renders trigger children', () => {
    render(<Tooltip content="Helpful text"><button type="button">Info</button></Tooltip>);
    expect(screen.getByRole('button', { name: 'Info' })).toBeInTheDocument();
  });

  it('makes trigger focusable for keyboard users', () => {
    const { container } = render(<Tooltip content="Helpful text"><span>?</span></Tooltip>);
    expect(container.querySelector('.tooltip__trigger')).toHaveAttribute('tabIndex', '0');
  });
});

describe('StatusMessage', () => {
  it('renders title and text', () => {
    render(<StatusMessage title="Success" text="Documents sent" />);
    expect(screen.getByRole('heading', { name: 'Success' })).toBeInTheDocument();
    expect(screen.getByText('Documents sent')).toBeInTheDocument();
  });

  it('renders action children', () => {
    render(<StatusMessage title="Success"><StatusButton type="button">Go home</StatusButton></StatusMessage>);
    expect(screen.getByRole('button', { name: 'Go home' })).toBeInTheDocument();
  });

  it('adds custom class name', () => {
    const { container } = render(<StatusMessage title="Success" className="custom-status" />);
    expect(container.firstElementChild).toHaveClass('status-message', 'custom-status');
  });
});
