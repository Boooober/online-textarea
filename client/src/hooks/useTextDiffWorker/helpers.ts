export const writeTextToBuffer = (text: string): ArrayBuffer => {
  // 2 bytes for each char
  const bytes = text.length * 2;
  const buffer = new ArrayBuffer(bytes);
  const arrayBuffer = new Uint16Array(buffer);
  for (let i = 0, strLen = text.length; i < strLen; i += 1) {
    arrayBuffer[i] = text.charCodeAt(i);
  }

  return buffer;
};

export const readTextFromBuffer = (buffer: ArrayBuffer): string => {
  const array = new Uint16Array(buffer);
  return String.fromCharCode.apply(null, (array as unknown) as number[]);
};
