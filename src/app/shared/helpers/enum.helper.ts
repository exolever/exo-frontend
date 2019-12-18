/**
 * you can use when you need know string value is into Enum
 * @param enumName Enum
 * @param value valor to search
 * @return value of enum like string
 */
export function getValueEnum(enumName: any, value): any {
  if (!isNaN(+value)) { value = +value; }
  const enumValue = Object.keys(enumName).find(k => enumName[k] === value);
  return !isNaN(+enumValue) ? +enumValue : enumValue;
}

/**
 * When you are using <any> with the enum, and you need the string, you can use it
 * @param enumName Enum
 * @param value valor to search
 * @return value of enum like string
 */
export function getStringEnum(enumName: any, value): any {
  if (!isNaN(+value)) { value = +value; }
  return enumName[Object.keys(enumName).find(k => enumName[k] === value)];
}

/**
 * you can use when you need know the Enum key from the value
 * @param enumParam Enum
 * @param value valor to search
 * @return value of enum
 */
export function getEnumValue( enumParam: any, value: any ): any {
  const enumValue = Object.keys( enumParam ).find(k => enumParam[ k ] === value );
  // Check the value of +enumValue isn't NaN because typeof NaN is equal to number :/
  return (typeof( +enumValue ) === 'number' && +enumValue === +enumValue) ?
    +enumValue :
    enumValue;
}
