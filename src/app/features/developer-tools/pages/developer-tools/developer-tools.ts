import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ToolId = 'json' | 'base64' | 'uuid' | 'password';

@Component({
  selector: 'app-developer-tools',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './developer-tools.html',
  styleUrl: './developer-tools.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperTools {
  readonly activeTool = signal<ToolId>('json');
  readonly message = signal('');
  jsonInput = '{"project":"Angular Studio","version":"2.0"}';
  jsonOutput = '';
  base64Input = '';
  base64Output = '';
  uuidOutput = crypto.randomUUID();
  passwordLength = 16;
  includeSymbols = true;
  passwordOutput = '';

  readonly tools = [
    { id: 'json' as const, label: 'JSON Formatter', icon: '{}' },
    { id: 'base64' as const, label: 'Base64', icon: '64' },
    { id: 'uuid' as const, label: 'UUID Generator', icon: '#' },
    { id: 'password' as const, label: 'Password Generator', icon: '*' },
  ];

  readonly activeTitle = computed(() => this.tools.find((tool) => tool.id === this.activeTool())?.label ?? 'Herramienta');

  formatJson(): void {
    try {
      this.jsonOutput = JSON.stringify(JSON.parse(this.jsonInput), null, 2);
      this.message.set('JSON validado y formateado.');
    } catch {
      this.jsonOutput = '';
      this.message.set('El contenido no es un JSON válido.');
    }
  }

  minifyJson(): void {
    try {
      this.jsonOutput = JSON.stringify(JSON.parse(this.jsonInput));
      this.message.set('JSON minificado.');
    } catch {
      this.jsonOutput = '';
      this.message.set('El contenido no es un JSON válido.');
    }
  }

  encodeBase64(): void {
    try {
      this.base64Output = btoa(unescape(encodeURIComponent(this.base64Input)));
      this.message.set('Texto codificado correctamente.');
    } catch {
      this.message.set('No fue posible codificar el contenido.');
    }
  }

  decodeBase64(): void {
    try {
      this.base64Output = decodeURIComponent(escape(atob(this.base64Input.trim())));
      this.message.set('Base64 decodificado correctamente.');
    } catch {
      this.base64Output = '';
      this.message.set('El contenido no es Base64 válido.');
    }
  }

  generateUuid(): void {
    this.uuidOutput = crypto.randomUUID();
  }

  generatePassword(): void {
    const length = Math.min(64, Math.max(8, Number(this.passwordLength) || 16));
    const alphabet = `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789${this.includeSymbols ? '!@#$%^&*_-+=' : ''}`;
    const values = crypto.getRandomValues(new Uint32Array(length));
    this.passwordOutput = Array.from(values, (value) => alphabet[value % alphabet.length]).join('');
    this.message.set('Contraseña segura generada.');
  }

  async copy(value: string): Promise<void> {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    this.message.set('Copiado al portapapeles.');
  }
}
