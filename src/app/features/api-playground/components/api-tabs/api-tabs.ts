import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ApiTab, ApiTabId } from '../../models/api-tab.model';

@Component({
  selector: 'app-api-tabs',
  standalone: true,
  templateUrl: './api-tabs.html',
  styleUrl: './api-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiTabsComponent {
  readonly tabs = input.required<readonly ApiTab[]>();
  readonly activeTab = input.required<ApiTabId>();
  readonly tabChange = output<ApiTabId>();

  selectTab(tabId: ApiTabId): void {
    this.tabChange.emit(tabId);
  }
}
