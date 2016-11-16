
import makeGraph from "./make-graph";
import selectNeighborhood from "./select-neighborhood";
import graphToDotFormat from "./graph-to-dot-format";

import {flatten, compose} from "./utils";

const dotFormatForScope = (scope, stylingOptions) =>
  graphToDotFormat(makeGraph(scope), stylingOptions);

const orderTypes = compose(
  makeGraph,
  partiallyOrder,
  flatten);

const dotFormatForNeighborhood = (scope, focus, stylingOptions) =>
  graphToDotFormat(selectNeighborhood(makeGraph(scope), focus), stylingOptions);

export {
  dotFormatForScope,
  dotFormatForNeighborhood,
  orderTypes
};

