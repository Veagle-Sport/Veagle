// Utility for JSON POST with timeout and structured error
async function postJSON<T>(
  url: string,
  data: unknown,
  timeout = 10000
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    if (!response.ok) {
      // Try to parse an error message
      let message = response.statusText;
      try {
        const err = await response.json();
        message = err?.message || message;
      } catch {
        // ignore non-JSON errors
      }
      throw new Error(`Request failed: ${message}`);
    }

    return (await response.json()) as T;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}