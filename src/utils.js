
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

const flatMap = (arr, fn) =>
  (arr || []).reduce((acc, x) => acc.concat(fn(x)), []);

const zipWith = (x, y, fn) => {
  const result = [];

  for(let i = 0; i < x.length && i < y.length; i++) {
    result.push(fn(x[i], y[i]));
  }

  return result;
};

const deepEqual = (x, y) => {
  if (Array.isArray(x))
    return Array.isArray(y) &&
      x.length === y.length &&
      zipWith(x, y, deepEqual)
        .reduce((a, b) => a && b, true);

  if (typeof x !== 'object') return isNaN(x) ? isNaN(y) : x === y;
  if (typeof y !== 'object') return false;

  if (!x) return x === y;

  return deepEqual(Object.keys(x), Object.keys(y)) &&
    Object.keys(x)
      .reduce(
        (equal, key) => equal && deepEqual(x[key], y[key]),
        true);
};

const iterateUntilStable = (x, fn) => {
  const y = fn(x);
  return deepEqual(x, y) ? y : iterateUntilStable(y, fn);
};

const clone = obj => obj && typeof obj === 'object' ?
  mapObject(obj, x => x) :
  obj;

const updateForKey = (obj, key, fn) => {
  const newObj = clone(obj) || {};

  newObj[key] = fn(obj[key]);

  return newObj;
};

const union = (...arrays) => arrays.reduce((arr1, arr2) => {
  (arr2 || []).forEach(x => {
    if (arr1.indexOf(x) === -1) arr1.push(x);
  });

  return arr1;
}, []);

const contains = (arr, x) => arr && arr.indexOf(x) !== -1;

const groupBy = (arr, fn) => arr.reduce(
  (groups, item) => {
    const label = fn(item),
          group = groups.find(group => deepEqual(label, group.label));

    if (group) {
      group.items.push(item);
    } else {
      groups.push({
        label,
        items: [item]
      });
    }

    return groups;
  }, []).map(group => group.items);

const flatten = arrs => (arrs || []).reduce(
  (arr1, arr2) => (arr1 || []).concat(arr2 || []));

export {
  compose,
  mapObject,
  values,
  uniqueStrings,
  incidencesOfStrings,
  foldObject,
  intersection,
  filterObject,
  merge,
  flatMap,
  deepEqual,
  iterateUntilStable,
  updateForKey,
  union,
  contains,
  groupBy,
  flatten
};

