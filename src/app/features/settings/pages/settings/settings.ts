import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService, ThemePreference } from '../../../../core/services/settings.service';

@Component({selector:'app-settings',standalone:true,imports:[FormsModule],templateUrl:'./settings.html',styleUrl:'./settings.scss',changeDetection:ChangeDetectionStrategy.OnPush})
export class Settings {
  private readonly service = inject(SettingsService);
  readonly state = this.service.settings;
  readonly message = signal('');
  setTheme(theme: ThemePreference): void { this.service.update({theme}); this.message.set('Tema actualizado.'); }
  setAnimations(value: boolean): void { this.service.update({animations:value}); }
  setCompact(value: boolean): void { this.service.update({compactMode:value}); }
  reset(): void { this.service.reset(); this.message.set('Configuración restablecida.'); }
  clearData(): void { if(confirm('¿Eliminar favoritos, equipo y registros CRUD guardados localmente?')) { this.service.clearApplicationData(); this.message.set('Datos locales eliminados. Recarga la aplicación para reflejar los cambios.'); } }
}
