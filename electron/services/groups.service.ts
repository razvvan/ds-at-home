import log from 'electron-log';

import { fileURL } from '../lib';
import { WebItem, Group } from '../../src/models/web_content.model';
import { CurrentGroupService } from './current_group.service';

export class GroupsService {
  groups: Group[];
  currentIdx: number;
  currentGroupService: CurrentGroupService;

  constructor(
    showURL: (_wc: WebItem) => void
  ) {
    this.currentGroupService = new CurrentGroupService(showURL);
  }

  nextItem = (): void => {
    this.currentGroupService.next();
  };

  prevItem = (): void => {
    this.currentGroupService.prev();
  };

  set = (groups: Group[], defaultIdx = 0): void => {
    this.groups = groups;

    if (this.groups.length === 0) {
      this.groups = <Group[]>[
        { name: 'Empty', links: [ { url: fileURL('empty.html') } ] }
      ];
    }

    this.currentIdx = defaultIdx;
    this.setCurrentGroup();
  };

  next = (): void => {
    if (this.groups.length == 0) {
      return;
    }

    if (this.currentIdx >= this.groups.length - 1) {
      // end of the list, go back to the start
      this.currentIdx = 0;
      return;
    }

    this.currentIdx = this.currentIdx + 1;

    this.setCurrentGroup();
  };

  setCurrentGroup = (): void => {
    if (this.groups.length === 0) {
      this.currentGroupService.set(<WebItem[]>[{ url: fileURL('empty.html') }]);
      this.currentIdx = 0;
    }

    if (!this.groups[this.currentIdx]) {
      log.error('encountered problem rendering idx', this.currentIdx, 'for', this.groups);
      return;
    }

    const currentLinks = this.groups[this.currentIdx].links;
    this.currentGroupService.set(currentLinks);
  };
}
