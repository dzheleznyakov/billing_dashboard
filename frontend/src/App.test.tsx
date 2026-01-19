import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';

import App from './App';

describe('<App> component', () => {
  test('is rendered on start', () => {
    // Act
    render(<App />);

    // Assert
    expect(
      screen.getByRole('heading', { name: /Credit Usage: Dashboard/ }),
    ).toBeInTheDocument();
  });
});
