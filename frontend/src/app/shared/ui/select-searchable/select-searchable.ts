import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  ElementRef,
  viewChild,
  ChangeDetectionStrategy,
  OnDestroy,
  effect,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

export interface SelectOption {
  label: string;
  value: unknown;
}

@Component({
  selector: 'app-select-searchable',
  imports: [ReactiveFormsModule],
  templateUrl: './select-searchable.html',
  styleUrl: './select-searchable.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectSearchable,
      multi: true,
    },
  ],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class SelectSearchable implements ControlValueAccessor, OnDestroy {
  options = input<SelectOption[]>([]);
  placeholder = input<string>('Seleccionar...');
  label = input<string | undefined>();
  loading = input<boolean>(false);
  hasMore = input<boolean>(false);

  onSearch = output<string>();
  onLoadMore = output<void>();

  private readonly elementRef = inject(ElementRef);
  private observer?: IntersectionObserver;

  readonly popoverId = `select-${Math.random().toString(36).slice(2, 9)}`;
  searchControl = new FormControl('', { nonNullable: true });

  isOpen = signal(false);
  selectedValue = signal<unknown>(null);
  selectedOption = computed(() => this.options().find((o) => o.value === this.selectedValue()));

  loadMoreTrigger = viewChild<ElementRef<HTMLElement>>('loadMoreTrigger');
  optionsList = viewChild<ElementRef<HTMLElement>>('optionsList');

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), takeUntilDestroyed())
      .subscribe((value) => this.onSearch.emit(value));

    effect(() => {
      const trigger = this.loadMoreTrigger();
      const scrollContainer = this.optionsList();

      if (trigger && scrollContainer) {
        this.setupIntersectionObserver(trigger.nativeElement, scrollContainer.nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupIntersectionObserver(element: HTMLElement, root: HTMLElement): void {
    this.observer?.disconnect();

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.loading() && this.hasMore()) {
          this.onLoadMore.emit();
        }
      },
      { root, threshold: 0.1 },
    );

    this.observer.observe(element);
  }

  writeValue(value: unknown): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggle(btn: HTMLElement): void {
    const menu = document.getElementById(this.popoverId) as HTMLElement & {
      showPopover(): void;
      hidePopover(): void;
    };
    if (!this.isOpen()) {
      this.checkPosition(btn);
      menu?.showPopover();
      this.searchControl.setValue('', { emitEvent: false });
    } else {
      menu?.hidePopover();
    }
    this.isOpen.update((v) => !v);
    this.onTouched();
  }

  select(option: SelectOption): void {
    this.selectedValue.set(option.value);
    this.onChange(option.value);
    this.closePopover();
  }

  private closePopover(): void {
    const menu = document.getElementById(this.popoverId) as HTMLElement & { hidePopover(): void };
    menu?.hidePopover();
    this.isOpen.set(false);
  }

  onWindowScroll(): void {
    if (this.isOpen()) {
      const btn = this.elementRef.nativeElement.querySelector('.select-box');
      if (btn) this.checkPosition(btn);
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.closePopover();
    }
  }

  private checkPosition(btn: HTMLElement): void {
    const menu = document.getElementById(this.popoverId);
    if (!menu) return;

    const rect = btn.getBoundingClientRect();
    const vH = window.innerHeight;
    const dropdownHeight = 320;

    Object.assign(menu.style, {
      position: 'fixed',
      inset: 'unset',
      width: `${rect.width}px`,
      left: `${rect.left}px`,
    });

    if (vH - rect.bottom < dropdownHeight && rect.top > dropdownHeight) {
      menu.style.top = 'auto';
      menu.style.bottom = `${vH - rect.top + 4}px`;
    } else {
      menu.style.bottom = 'auto';
      menu.style.top = `${rect.bottom + 4}px`;
    }
  }
}
