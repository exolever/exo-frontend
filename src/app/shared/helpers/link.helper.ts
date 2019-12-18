export function addHttpToLink(value: string): string {
  const regex = new RegExp(/^(http|https|Http|Https):\/\//);
  return (!regex.test(value) ? 'http://'.concat(value) : value);
}
