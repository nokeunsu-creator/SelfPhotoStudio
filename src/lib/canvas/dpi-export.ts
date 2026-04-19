/**
 * Inject 300 DPI metadata into a JPEG blob.
 * Modifies the JFIF APP0 marker to set X/Y density to 300 DPI.
 */
export async function injectJpegDpi(
  blob: Blob,
  dpi: number = 300
): Promise<Blob> {
  const buffer = await blob.arrayBuffer();
  const data = new Uint8Array(buffer);

  // Find JFIF APP0 marker (FF E0)
  for (let i = 0; i < data.length - 20; i++) {
    if (data[i] === 0xff && data[i + 1] === 0xe0) {
      // Check JFIF identifier
      const isJfif =
        data[i + 4] === 0x4a && // J
        data[i + 5] === 0x46 && // F
        data[i + 6] === 0x49 && // I
        data[i + 7] === 0x46; // F

      if (isJfif) {
        // Set density units to DPI (1 = dots per inch)
        data[i + 9] = 1;
        // Set X density
        data[i + 10] = (dpi >> 8) & 0xff;
        data[i + 11] = dpi & 0xff;
        // Set Y density
        data[i + 12] = (dpi >> 8) & 0xff;
        data[i + 13] = dpi & 0xff;
        break;
      }
    }
  }

  return new Blob([data], { type: "image/jpeg" });
}

/**
 * Inject 300 DPI into a PNG blob by adding a pHYs chunk.
 * 300 DPI = 11811 pixels per meter.
 */
export async function injectPngDpi(
  blob: Blob,
  dpi: number = 300
): Promise<Blob> {
  const buffer = await blob.arrayBuffer();
  const data = new Uint8Array(buffer);

  // Pixels per meter
  const ppm = Math.round(dpi / 0.0254);

  // Build pHYs chunk: 4 bytes X ppm + 4 bytes Y ppm + 1 byte unit(1=meter)
  const chunkData = new Uint8Array(9);
  const view = new DataView(chunkData.buffer);
  view.setUint32(0, ppm);
  view.setUint32(4, ppm);
  chunkData[8] = 1; // meter

  const chunkType = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // pHYs

  // Calculate CRC32 over type + data
  const crcInput = new Uint8Array(4 + 9);
  crcInput.set(chunkType, 0);
  crcInput.set(chunkData, 4);
  const crc = crc32(crcInput);

  // Build full chunk: length(4) + type(4) + data(9) + crc(4) = 21 bytes
  const chunk = new Uint8Array(21);
  const chunkView = new DataView(chunk.buffer);
  chunkView.setUint32(0, 9); // data length
  chunk.set(chunkType, 4);
  chunk.set(chunkData, 8);
  chunkView.setUint32(17, crc);

  // Insert pHYs chunk after IHDR (PNG signature is 8 bytes, IHDR chunk follows)
  // IHDR chunk: length(4) + "IHDR"(4) + data(13) + crc(4) = 25 bytes
  const insertAt = 8 + 25; // after PNG signature + IHDR

  const result = new Uint8Array(data.length + 21);
  result.set(data.subarray(0, insertAt), 0);
  result.set(chunk, insertAt);
  result.set(data.subarray(insertAt), insertAt + 21);

  return new Blob([result], { type: "image/png" });
}

// Simple CRC32 implementation for PNG chunk CRC
function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
