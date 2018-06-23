export default class MatchClient {

  static computeNextMoveNumber(number) {
    if (number <= 1) {
      throw new Exception(`Input number must be > 1, got: ${number}`)
    }

    if ((number + 1) % 3 === 0) return (number + 1) / 3;

    if ((number) % 3 === 0) return (number) / 3;

    if ((number - 1) % 3 === 0) return (number - 1) / 3;
  }

  static initiateNumber() {
    return MatchClient._getRandomInteger(20, 100);
  }

  /**
   * @private
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  static _getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
