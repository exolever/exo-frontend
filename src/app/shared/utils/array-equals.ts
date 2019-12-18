// returns boolean that states if two arrays are equal
export function arrayEquals ( a: Array<any>, b: Array<any> ): boolean {
  if ( !a || !b ) { return false; }
  if ( a.length !== b.length ) { return false; }

  const differentPositions = a.filter( ( el, i ) => {
    if ( typeof el !== typeof b[i]) { return true; } else
    if ( Array.isArray( el ) ) { return !arrayEquals( el, b[i] ); } else
    if ( typeof el === 'object' ) {
      if ( Object.keys( el ).length === Object.keys( b[ i ] ).length ) {
        return Object.keys( el ).filter( elKey => {
          return ( !( b[ i ][ elKey ]) || b[ i ][ elKey ] !== el[ elKey ] );
        }).length > 0;
      } else {
        return true;
      }
    } else { return el !== b[ i ]; }
  });

  return differentPositions.length === 0;
}
