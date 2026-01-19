import { type UsageItem } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchUsage({
  signal,
}: {
  signal: AbortSignal | null;
}): Promise<UsageItem[]> {
  const url = `${BASE_URL}/usage`;
  const response = await fetch(url, { signal });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        'An error occurred while fetching usage data. Try again later.',
    );
  }

  return data.usage;
}
