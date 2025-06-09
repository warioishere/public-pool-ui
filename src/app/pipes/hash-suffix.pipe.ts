import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hashSuffix'
})
export class HashSuffixPipe implements PipeTransform {

  private static _this = new HashSuffixPipe();

  public static transform(value: number | string): string {
    return this._this.transform(value);
  }

  public transform(value: number | string): string {

    const num = Number(value);

    if (isNaN(num) || num < 0) {
      return '0';
    }

    const suffixes = [' H/s', ' KH/s', ' MH/s', ' GH/s', ' TH/s', ' PH/s', ' EH/s', ' ZH/s', ' YH/s', ' RH/s', ' QH/s'];

    let power = Math.floor(Math.log10(num) / 3);
    if (power < 0) {
      power = 0;
    }
    const scaledValue = num / Math.pow(1000, power);
    const suffix = suffixes[power];

    return scaledValue.toFixed(1) + suffix;
  }


}
