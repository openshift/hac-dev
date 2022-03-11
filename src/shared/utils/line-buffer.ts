import * as _ from 'lodash-es';
export const LINE_PATTERN = /^.*(\n|$)/gm;
const TRUNCATE_LENGTH = 1024;

export class LineBuffer {
  private _buffer: string[];
  private _tail: string;
  private _hasTruncated: boolean;

  constructor() {
    this._buffer = [];
    this._tail = '';
    this._hasTruncated = false;
  }

  ingest(text): number {
    const lines = text.match(LINE_PATTERN);
    let lineCount = 0;
    lines.forEach((line) => {
      const next = `${this._tail}${line}`;
      if (next.length > TRUNCATE_LENGTH) {
        this._hasTruncated = true;
      }
      if (/\n$/.test(line)) {
        this._buffer.push(_.truncate(next, { length: TRUNCATE_LENGTH }).trimEnd());
        lineCount++;
        this._tail = '';
      } else {
        this._tail = next;
      }
    });
    return lineCount;
  }

  clear(): void {
    this._buffer = [];
    this._hasTruncated = false;
    this._tail = '';
  }

  getLines(): string[] {
    return this._buffer;
  }

  getBlob(options: BlobPropertyBag, lineSeparator = '\n'): Blob {
    return new Blob([this._buffer.join(lineSeparator)], options);
  }

  getHasTruncated(): boolean {
    return this._hasTruncated;
  }

  getTail() {
    return _.truncate(this._tail, { length: TRUNCATE_LENGTH });
  }

  length(): number {
    return this._buffer.length;
  }
}
