import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from './page.tsx';

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />);

    const heading = screen.getByRole('heading', { level: 1 }); // Querying the DOM for an <h1> element

    expect(heading).toBeInTheDocument();// Asserting that the <h1> element is present in the document
  });
});
