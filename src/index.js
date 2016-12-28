
import makeGraph from "./make-graph";
import selectNeighborhood from "./select-neighborhood";
import graphToDotFormat from "./graph-to-dot-format";
import partiallyOrder from "./partial-ordering";
import makeStructLabels from "./make-struct-labels";

import {flatten, compose} from "./utils";

const dotFormatForScope = (scope, stylingOptions) =>
  graphToDotFormat(makeGraph(scope), stylingOptions);

const orderTypes = (scope, rootNodes) =>
  flatten(partiallyOrder(makeGraph(scope), rootNodes));

const dotFormatForNeighborhood = (scope, focus, stylingOptions) => {
  const specialNodes = stylingOptions && stylingOptions.expandStructs ? makeStructLabels(scope) : {};
  return graphToDotFormat(selectNeighborhood(makeGraph(scope), focus), stylingOptions, specialNodes);
};

export {
  dotFormatForScope,
  dotFormatForNeighborhood,
  orderTypes
};

