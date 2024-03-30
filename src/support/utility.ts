import { RandomWords } from "./random-words";

export class Utility {
  static capitalize(value: string) {
    return value?.charAt(0).toUpperCase() + value.slice(1);
  }

  static async forEachParallel<T, TReturn>(
    values: T[],
    func: (item: T) => Promise<TReturn>
  ): Promise<TReturn[]> {
    return await Promise.all(values.map(async (item: T) => await func(item)));
  }

  static async forEachSequential<T, TReturn>(
    values: T[],
    func: (item: T) => Promise<TReturn>
  ): Promise<TReturn[]> {
    const results: TReturn[] = [];
    for (const item of values) {
      const result = await func(item);
      results.push(result);
    }
    return results;
  }

  static getRandomWord() {
    return Utility.getRandomElement(RandomWords);
  }

  static getRandomWords(count: number) {
    return [...Array(count).keys()].map(() => {
      return Utility.getRandomWord();
    });
  }

  static getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  static getRandomElement<T>(items: T[]) {
    const idx = Utility.getRandomInt(items.length);
    return items[idx];
  }
}
