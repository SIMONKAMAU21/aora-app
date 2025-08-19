/**
 * Sorts posts by updated time and returns only video posts.
 * @param {Array} posts - Array of post objects.
 * @returns {Array} Sorted array of video posts.
 */
export function getSortedVideos(posts) {
    if (!Array.isArray(posts)) return [];
    return posts
        .filter(post => !!post.video)
        .sort((a, b) => new Date(b.$updatedAt) - new Date(a.$updatedAt));
}
