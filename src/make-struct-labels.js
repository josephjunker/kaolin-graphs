
import makeLabel from "./html-label-for-struct";
import {mapObject, filterObject} from "./utils";

export default scope => {
  const types = scope.getTypes();

  return mapObject(
    filterObject(
      types,
      type => ["struct", "strictStruct"].includes(type.name)),
    (_, typeName) => makeLabel(types, typeName));
};

