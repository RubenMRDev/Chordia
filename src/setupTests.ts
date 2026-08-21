// Configuracion global de los tests de frontend.
// El fichero lo referencia jest.frontend.config.cjs (setupFilesAfterEach).
import { TextDecoder, TextEncoder } from 'node:util';
import '@testing-library/jest-dom';

/*
  jsdom does not provide TextEncoder/TextDecoder, and react-router 7 reaches for
  them at import time — so merely importing a component that uses <Link> failed
  the whole suite with "TextEncoder is not defined". Node's own implementations
  are the same ones the browser exposes.
*/
const globals = globalThis as unknown as {
  TextEncoder?: typeof TextEncoder;
  TextDecoder?: typeof TextDecoder;
};

if (typeof globals.TextEncoder === 'undefined') {
  globals.TextEncoder = TextEncoder;
}
if (typeof globals.TextDecoder === 'undefined') {
  globals.TextDecoder = TextDecoder;
}
