"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAverageRating = getAverageRating;

function getAverageRating(AllRating) {
  if (AllRating.length === 0) {
    return 0;
  }

  var totalRating = AllRating.reduce(function (acc, curr) {
    return acc + curr.rating;
  }, 0);
  var averageRating = Math.round(totalRating / AllRating.length * 10) / 10;
  return averageRating;
}
//# sourceMappingURL=avgRating.dev.js.map
