import { vi } from 'vitest';

export const backendLogin  = vi.fn(async () => 'login ok test@example.com bal 100');
export const backendSignUp = vi.fn(async () => 'signup ok');
export const queryBackend  = vi.fn(async () => 'query result');

