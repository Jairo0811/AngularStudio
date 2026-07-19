import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ManualPokemonRecord {
  readonly id: string;
  readonly name: string;
  readonly nationalId: number;
  readonly type: string;
  readonly region: string;
  readonly game: string;
  readonly imageUrl: string;
  readonly notes: string;
}

type ManualPokemonDraft = Omit<ManualPokemonRecord, 'id'>;

@Component({
  selector: 'app-crud-lab',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './crud-lab.html',
  styleUrl: './crud-lab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudLab {
  private readonly storageKey = 'angular-studio:crud-lab:pokemon';
  readonly records = signal<ManualPokemonRecord[]>(this.load());
  readonly editingId = signal<string | null>(null);
  readonly search = signal('');
  readonly message = signal('');

  draft: ManualPokemonDraft = this.emptyDraft();

  readonly filteredRecords = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.records().filter((record) => !query || [record.name, record.type, record.region, record.game].some((value) => value.toLowerCase().includes(query)));
  });

  save(): void {
    const normalizedName = this.draft.name.trim();
    if (!normalizedName || this.draft.nationalId < 1) {
      this.message.set('Completa el nombre y un número nacional válido.');
      return;
    }

    const editingId = this.editingId();
    const record: ManualPokemonRecord = {
      ...this.draft,
      id: editingId ?? crypto.randomUUID(),
      name: normalizedName,
      type: this.draft.type.trim(),
      region: this.draft.region.trim(),
      game: this.draft.game.trim(),
      imageUrl: this.draft.imageUrl.trim(),
      notes: this.draft.notes.trim(),
    };

    const next = editingId
      ? this.records().map((item) => item.id === editingId ? record : item)
      : [...this.records(), record];

    this.records.set(next);
    this.persist(next);
    this.cancel();
    this.message.set(editingId ? 'Registro actualizado.' : 'Registro creado.');
  }

  edit(record: ManualPokemonRecord): void {
    this.editingId.set(record.id);
    this.draft = {
      name: record.name,
      nationalId: record.nationalId,
      type: record.type,
      region: record.region,
      game: record.game,
      imageUrl: record.imageUrl,
      notes: record.notes,
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(record: ManualPokemonRecord): void {
    if (!confirm(`¿Eliminar ${record.name}?`)) return;
    const next = this.records().filter((item) => item.id !== record.id);
    this.records.set(next);
    this.persist(next);
    if (this.editingId() === record.id) this.cancel();
    this.message.set('Registro eliminado.');
  }

  cancel(): void {
    this.editingId.set(null);
    this.draft = this.emptyDraft();
  }

  private emptyDraft(): ManualPokemonDraft {
    return { name: '', nationalId: 1, type: '', region: '', game: '', imageUrl: '', notes: '' };
  }

  private load(): ManualPokemonRecord[] {
    try { return JSON.parse(localStorage.getItem(this.storageKey) ?? '[]') as ManualPokemonRecord[]; }
    catch { return []; }
  }

  private persist(records: ManualPokemonRecord[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(records));
  }
}
