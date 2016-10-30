
const compose = (...fns) =>
  x => fns.reduce((acc, fn) => fn(acc), x);

const mapObject = (obj, fn) =>
  Object.keys(obj || {})
    .map(key => ({ key, value: fn(obj[key], key)}))
    .reduce((acc, {key, value}) => { acc[key] = value; return acc; }, {});

const values = obj => Object.keys(obj || {}).map(x => obj[x]);

const foldObject = (skipKeys, initial, obj, fn) => {

  const recursive = (acc, node) => {
    acc = fn(acc, node);

    if (typeof node !== 'object') return acc;

    return Array.isArray(node) ?
      node.reduce(recursive, acc) :
      values(node).reduce(recursive, acc);
  };

  return recursive(initial, obj);
};

const incidencesOfStrings = strings =>
    (strings || [])
      .reduce((acc, str) => {
        if (acc[str]) {
          acc[str]++;
        } else {
          acc[str] = 1;
        }

        return acc;
      }, {});

const uniqueStrings = compose(incidencesOfStrings, Object.keys);

export {
  compose,
  mapObject,
  values,
  uniqueStrings,
  incidencesOfStrings,
  foldObject
};

