
const compose = (...fns) =>
  x => fns.reduce((acc, fn) => fn(acc), x);

const mapObject = (obj, fn) =>
  Object.keys(obj || {})
    .reduce((acc, key) => {
      acc[key] = fn(obj[key], key);
      return acc;
    }, {});

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

const merge = (...objs) =>
  objs.reduce((acc, obj) => {
    Object.keys(obj).forEach(key => { acc[key] = obj[key]; });
    return acc;
  }, {});

const intersection = (...arrs) =>
  (arrs || []).reduce((acc, arr) => (acc || []).filter(x => (arr || []).indexOf(x) !== -1));

const filterObject = (obj, fn) =>
  Object.keys(obj || {})
    .reduce((acc, {key, value}) => {
      if (fn(value, key)) acc[key] = value;

      return acc;
    }, {});

export {
  compose,
  mapObject,
  values,
  uniqueStrings,
  incidencesOfStrings,
  foldObject,
  intersection,
  filterObject,
  merge
};

