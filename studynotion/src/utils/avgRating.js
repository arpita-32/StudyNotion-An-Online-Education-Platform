export default function GetAvgRating(ratingArr) {
  if (!Array.isArray(ratingArr) || ratingArr.length === 0) return 0; // Ensure ratingArr is a valid array
  
  const totalReviewCount = ratingArr.reduce((acc, curr) => {
    return acc + (curr?.rating || 0);  // Ensure undefined ratings don’t break it
  }, 0);

  const avgReviewCount = totalReviewCount / ratingArr.length;

  return isNaN(avgReviewCount) ? 0 : Math.round(avgReviewCount * 10) / 10;
}
