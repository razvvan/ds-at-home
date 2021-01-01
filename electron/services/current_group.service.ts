import { fileURL } from '../lib/fileurl';
import { WebItem } from '../../src/models/web_content.model';

export class CurrentGroupService {
  items: WebItem[];
  currentIdx: number;
  updateCallbackFn: (_wc: WebItem) => void;

  constructor(updateCallbackFn: (_wc: WebItem) => void) {
    this.updateCallbackFn = updateCallbackFn;

    const defaultItems = [{ url: fileURL('loading.html') }];
    this.set(defaultItems);
  }

  set = (items: WebItem[]): void => {
    this.items = items;

    if (this.items.length === 0) {
      this.items = [{ url: fileURL('empty.html') }];
    }

    this.currentIdx = 0;

    this.updateCallbackFn(this.items[this.currentIdx]);
  };

  next = (): void => {
    this.currentIdx++;
    if (this.currentIdx > this.items.length - 1) {
      this.currentIdx = 0;
    }

    this.updateCallbackFn(this.items[this.currentIdx]);
  };

  prev = (): void => {
    this.currentIdx--;
    if (this.currentIdx < 0) {
      this.currentIdx = this.items.length - 1;
    }

    this.updateCallbackFn(this.items[this.currentIdx]);
  };
}
