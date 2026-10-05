export type FetchJsonResult<T> = {
  ok: boolean;
  status: number;
  data: T;
};

const inflight = new Map<string, Promise<FetchJsonResult<unknown>>>();

export function fetchJson<T>(url: string): Promise<FetchJsonResult<T>> {
  const existing = inflight.get(url);
  if (existing) {
    return existing as Promise<FetchJsonResult<T>>;
  }

  const pending = fetch(url)
    .then(async (response) => {
      const data = (await response.json()) as T;
      return { ok: response.ok, status: response.status, data };
    })
    .finally(() => {
      inflight.delete(url);
    });

  inflight.set(url, pending);
  return pending;
}
