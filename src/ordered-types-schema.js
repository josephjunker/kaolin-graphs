
import {createScope, core as c} from "kaolin";

const scope = createScope();

const node = scope.newType("Node", c.strictStruct({
  name: c.string(),
  children: c.array(c.string()),
  childCounts: c.dictionary(c.string(), c.number()),
  docString: c.optional(c.string()),
  parents: c.array(c.string()),
  parentCounts: c.dictionary(c.string(), c.number()),
  siblings: c.array(c.string()),
  siblingCounts: c.dictionary(c.string(), c.number()),
  ancestors: c.array(c.string()),
  distanceToRoot: c.number(),
  rank: c.number()
}));

scope.newType("NodeArray", c.array(node));

export default scope;

