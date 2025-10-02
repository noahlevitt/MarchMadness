import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';   // ← note the *

/* hook the jest‑dom matchers into Vitest’s expect */
expect.extend(matchers);

/* stub react‑router‑dom’s useNavigate so unit tests don't push history */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

