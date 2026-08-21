/**
 * Pulls the message text out of whatever shape Puter returned.
 *
 * The SDK answers with a bare string for some models and a wrapper object for
 * others, and both call sites used to unwrap it themselves — one of them by
 * handing the value straight to `JSON.parse`, which throws on the object form
 * and quietly fell back to canned chords.
 */
export const puterText = (
  response: PuterChatResponse | null | undefined,
): string | null => {
  if (!response) return null;
  if (typeof response === 'string') return response;

  if ('message' in response && response.message?.content) {
    return response.message.content;
  }
  if ('choices' in response) {
    const content = response.choices?.[0]?.message?.content;
    if (content) return content;
  }
  if ('text' in response && response.text) return response.text;

  return null;
};

/** Loads the SDK if the script has arrived, or reports that it has not. */
export const ensurePuter = async (): Promise<Puter | null> => {
  if (typeof puter === 'undefined') return null;
  if (typeof puter.init === 'function') {
    await puter.init();
  }
  return puter;
};
