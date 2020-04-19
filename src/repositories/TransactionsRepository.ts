import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (accumulator, currentValue) => {
        if (currentValue.type === 'income') {
          return {
            ...accumulator,
            income: accumulator.income + currentValue.value,
            total: accumulator.total + currentValue.value,
          };
        }

        return {
          ...accumulator,
          outcome: accumulator.outcome + currentValue.value,
          total: accumulator.total - currentValue.value,
        };
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();

    if (value > total && type === 'outcome') {
      throw Error('You don`t have enough balance');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
