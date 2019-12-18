/** removes the edges and nodes naturally present in a graphQl response multiple fields */
export function removeEdgesAcrossResponse(response: any): any {
  let res: any;
  if (response && typeof response === 'object') {
    res = Array.isArray(response) ? response : Object.assign({}, response);
  } else {
    res = response;
  }

  for (const key in res) {
    if (res.hasOwnProperty(key)) {
      /** look in fist level of depth for the presence of edges and remove them */
      if (res[key] && Array.isArray(res[key].edges)) {
        res[key] = removeEdges(res[key]);
      }
      /** this will take care of successive levels of depth by recursive iterations */
      if (Array.isArray(res[key])) {
        res[key] = res[key].map(val => removeEdgesAcrossResponse(val));
      } else if (res[key] && typeof res[key] === 'object') {
        res[key] = removeEdgesAcrossResponse(res[key]);
      }
    }
  }

  return res;

}

/**
 * removes the nodes and edges of a particular field
 * @param original
 */
export function removeEdges(original: any): any {
  if (Array.isArray(original.edges)) {
    return original.hasOwnProperty('edges') ? original['edges'].map(obj => obj.node) : original;
  } else {
    return original.hasOwnProperty('edges') ? original['edges'] : original;
  }
}
