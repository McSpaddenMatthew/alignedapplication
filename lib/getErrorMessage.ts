export function getErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error) {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) {
      return message;
    }
  }

  try {
    return JSON.stringify(error);
  } catch (jsonError) {
    if (jsonError instanceof Error && jsonError.message) {
      return jsonError.message;
    }
  }

  return fallback;
}
