import { singleton, container } from 'tsyringe';
import fetch from 'node-fetch';
import { EventEmitter } from 'events';

const dataPath = 'http://192.168.50.234:8085/data.json';

export type CpuTemp = {
  min: number;
  max: number;
  current: number;
};

@singleton()
export class SystemTemps {
  private events: EventEmitter = new EventEmitter();

  public async get(): Promise<CpuTemp> {
    const temp: CpuTemp = {
      current: 0,
      min: 0,
      max: 0
    };

    try {
      const result = await fetch(dataPath);
      if (!result) {
        return temp;
      }

      const data = await result.json();
      if (!data) {
        return temp;
      }

      data.Children[0].Children[1].Children.forEach(
        (item: { Text: 'Temperatures' | string; Children: [] }) => {
          type TempItem = {
            Text: string;
            Min: string;
            Max: string;
            Value: string;
          };

          if (item.Text === 'Temperatures') {
            item.Children.forEach((tempItem: TempItem, index: number) => {
              const min = parseInt(tempItem.Min);
              const max = parseInt(tempItem.Max);
              const value = parseInt(tempItem.Value);
              temp.min = temp.min == 0 || min < temp.min ? min : temp.min;
              temp.max = temp.max > max ? temp.max : max;
              temp.current = temp.current > value ? temp.current : value;
            });
          }
        }
      );
    } catch (err) {
      console.log('Failed to reach network');
    }
    return temp;
  }

  public onUpdate(fn: (...args: any[]) => any) {
    this.events.on('update', fn);
  }

  public offUpdate(fn: (...args: any[]) => any) {
    this.events.off('update', fn);
  }

  public pollTemperatues(ms: number): () => void {
    const temps = container.resolve<SystemTemps>(SystemTemps);
    let run = true;

    const events = this.events;
    async function poller() {
      const temp = await temps.get();
      events.emit('update', temp);
      while (run) {
        /* eslint-disable-line no-await-in-loop */
        await wait(5000);
        const nextTemp = await temps.get();
        if (
          nextTemp.min !== temp.min ||
          nextTemp.max !== temp.max ||
          nextTemp.current !== temp.current
        ) {
          temp.min = nextTemp.min;
          temp.max = nextTemp.max;
          temp.current = nextTemp.current;
          events.emit('update', temp);
        }
      }
    }

    poller();

    return () => {
      run = false;
    };
  }
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
