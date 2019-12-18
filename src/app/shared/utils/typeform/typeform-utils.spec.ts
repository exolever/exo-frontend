import * as typeFormUtil from '@shared/utils/typeform/typeform-utils';

describe('typeform utils', () => {
  it('enableScrollAfterTypeformClose', () => {
    window.navigator['__defineGetter__']('userAgent', () => {
      return 'iPhone';
    });

    const funcSpy = jasmine.createSpy('enableScrollAfterTypeformClose').and.returnValue('');
    typeFormUtil.enableScrollAfterTypeformClose();
    spyOnProperty(typeFormUtil, 'enableScrollAfterTypeformClose', 'get').and.returnValue(funcSpy);
  });
});
