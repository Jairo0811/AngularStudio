import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

type CalculatorOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide';

interface CalculationHistoryItem {
  readonly id: number;
  readonly expression: string;
  readonly result: number;
  readonly createdAt: Date;
}

@Component({
  selector: 'app-calculator',
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class Calculator {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly result = signal<number | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly history = signal<
    readonly CalculationHistoryItem[]
  >([]);

  protected readonly calculatorForm =
    this.formBuilder.nonNullable.group({
      firstOperand: [
        0,
        [
          Validators.required,
          Validators.pattern(/^-?\d+(\.\d+)?$/),
        ],
      ],
      secondOperand: [
        0,
        [
          Validators.required,
          Validators.pattern(/^-?\d+(\.\d+)?$/),
        ],
      ],
    });

  protected readonly hasResult = computed(
    () => this.result() !== null,
  );

  protected calculate(operation: CalculatorOperation): void {
    if (this.calculatorForm.invalid) {
      this.calculatorForm.markAllAsTouched();
      this.errorMessage.set(
        'Introduce valores numéricos válidos.',
      );
      return;
    }

    const {
      firstOperand,
      secondOperand,
    } = this.calculatorForm.getRawValue();

    this.errorMessage.set(null);

    let calculatedResult: number;
    let operatorSymbol: string;

    switch (operation) {
      case 'add':
        calculatedResult = firstOperand + secondOperand;
        operatorSymbol = '+';
        break;

      case 'subtract':
        calculatedResult = firstOperand - secondOperand;
        operatorSymbol = '−';
        break;

      case 'multiply':
        calculatedResult = firstOperand * secondOperand;
        operatorSymbol = '×';
        break;

      case 'divide':
        if (secondOperand === 0) {
          this.result.set(null);
          this.errorMessage.set(
            'No es posible dividir entre cero.',
          );
          return;
        }

        calculatedResult = firstOperand / secondOperand;
        operatorSymbol = '÷';
        break;
    }

    this.result.set(calculatedResult);

    this.addToHistory(
      firstOperand,
      secondOperand,
      calculatedResult,
      operatorSymbol,
    );
  }

  protected clearCalculator(): void {
    this.calculatorForm.reset({
      firstOperand: 0,
      secondOperand: 0,
    });

    this.result.set(null);
    this.errorMessage.set(null);
  }

  protected clearHistory(): void {
    this.history.set([]);
  }

  private addToHistory(
    firstOperand: number,
    secondOperand: number,
    result: number,
    operatorSymbol: string,
  ): void {
    const historyItem: CalculationHistoryItem = {
      id: Date.now(),
      expression:
        `${firstOperand} ${operatorSymbol} ${secondOperand}`,
      result,
      createdAt: new Date(),
    };

    this.history.update((currentHistory) => [
      historyItem,
      ...currentHistory,
    ].slice(0, 10));
  }
}