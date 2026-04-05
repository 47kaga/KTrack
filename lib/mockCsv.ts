/**
 * Placeholder for future CSV parsing. Call sites can record metadata only for now.
 */
export interface MockCsvImportResult {
  fileName: string;
  fileSize: number;
  /** Simulated row count until real parsing exists */
  placeholderRowCount: number;
}

export function mockImportCsvFile(file: File): MockCsvImportResult {
  const estimatedRows = Math.max(1, Math.floor(file.size / 48));
  return {
    fileName: file.name,
    fileSize: file.size,
    placeholderRowCount: estimatedRows,
  };
}
