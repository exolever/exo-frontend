export interface CustomFields {
  name: string;
  data: any;
}

/*
  Typescript does not allow for multiple inheritance, so we can leverage on this
  ES6 trick to emulate it. Fake factories will extend FakeModel, getting native access
  to all it's properties and methods. Fake model on it's turn, will receive another class
  as a parameter, in this concrete case the real model that the fake factory should extend,
  thus also incorporating all properties and methods and acting as multiple inheritance
  as expected in a proper OOP language.
  This is known as the mixin pattern for ES6. For more info:
  http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Mix-ins
  https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#typescript-22
 */

type Constructor<T> = new( ...args: any[] ) => T;

export function FakeModel<T extends Constructor<{}>>( Base: T ) {
  return class extends Base {

    constructor( ...args: any[] ) {
      super( ...args );
    }

    // receives an object which contains properties and values and if the
    // property is in the prototype of the targeted class, it is overwritten
    assignPropertyToClass ( obj: any ): any {
      if ( typeof ( obj ) === 'object') {
        Object.assign( this, obj );
      }
    }

    // receives an array with CustomField objects and assigns the value of the
    // name property in case the super class contains that name
    modelPropertiesCustom ( params?: CustomFields[] ): any {
      if ( params ) {
        params.map( n => {
          if ( this.hasOwnProperty( n.name ) ) { this[ n.name ] = n.data; }
        });
      }
      return this;
    }
  };

}
