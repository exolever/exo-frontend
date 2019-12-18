/**
 * when using pipe as a method it is always executed twice the times that it is actually called in the code
 * I create this function to give a syntactical context on doubling the amount of expected calls in the test
 */
export function pipeDoubleExpectedCallAmount(expectedCallAmount: number): number {
  return expectedCallAmount * 2;
}
