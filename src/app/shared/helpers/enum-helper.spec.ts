import { getValueEnum, getStringEnum } from './enum.helper';

describe('EnumHelper', () => {

  enum GenericEnumStub {
    A = <any>'Option1',
    B = <any>'Option2',
    C = <any>'Option3',
  }
  enum NormalEnumStub {
    number0,
    number1,
    number2
  }
  it('Should return a string of enum from Backend way', () => {
    const ticketStatus = getValueEnum(GenericEnumStub, 'A');
    expect(ticketStatus).toBe(GenericEnumStub.A);
    expect(ticketStatus).toBe('Option1');
  });
  it('Should return a leter of enum', () => {
    const ticketStatus = getValueEnum(GenericEnumStub, 'Option2');
    expect(ticketStatus).toBe('B');
  });

  it('Should return a undefined there is not this enum', () => {
    const ticketStatus = getValueEnum(GenericEnumStub, 'H');
    expect(ticketStatus).toBeUndefined();
  });
  it('Should return a position of enum', () => {
    const ticketStatus = getStringEnum(GenericEnumStub, GenericEnumStub.B);
    expect(ticketStatus).toBe('Option2');
  });

  it('Should return a undefined there is not this enum from Value', () => {
    const ticketStatus = getValueEnum(GenericEnumStub, 'H');
    expect(ticketStatus).toBeUndefined();
  });
  it('Should return a undefined there is not this enum from String', () => {
    const ticketStatus = getStringEnum(GenericEnumStub, 'H');
    expect(ticketStatus).toBeUndefined();
  });

  it('Should return a undefined there is not this enum', () => {
    const ticketStatus = getValueEnum(GenericEnumStub, undefined);
    expect(ticketStatus).toBeUndefined();
  });
  it('Should return first value enum position', () => {
    const ticketStatus = getValueEnum(NormalEnumStub, 0);
    expect(ticketStatus).toBe('number0');
  });
  it('Should return value enum related value', () => {
    const ticketStatus = getValueEnum(NormalEnumStub, NormalEnumStub.number1);
    expect(ticketStatus).toBe('number1');
  });
  it('Should return first position ', () => {
    const ticketStatus = getStringEnum(NormalEnumStub, 0);
    expect(ticketStatus).toBe(0);
  });
  it('Should return second enum position', () => {
    const ticketStatus = getStringEnum(NormalEnumStub, NormalEnumStub.number1);
    expect(ticketStatus).toBe(1);
  });

});
