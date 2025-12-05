// GitHub Repositories Module
// Async function to fetch repositories for a given GitHub username

/**
 * Fetch all repositories for a given GitHub username
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} Array of repository objects from GitHub API
 * @throws {Error} If the username is not found or API request fails
 */
async function getGitHubRepositories(username) {
    if (!username || typeof username !== 'string') {
        throw new Error('Username must be a non-empty string');
    }

    try {
        const url = `https://api.github.com/users/${username}/repos`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`GitHub user "${username}" not found`);
            }
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const repositories = await response.json();

        if (!Array.isArray(repositories)) {
            throw new Error('Invalid response from GitHub API');
        }

        return repositories;
    } catch (error) {
        throw error;
    }
}

/**
 * Format repository data for display
 * @param {Array} repositories - Array of repository objects
 * @returns {Array} Formatted repository data
 */
function formatRepositories(repositories) {
    return repositories.map(repo => ({
        name: repo.name,
        description: repo.description || 'No description',
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown',
        updated: new Date(repo.updated_at).toLocaleDateString()
    }));
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getGitHubRepositories, formatRepositories };
}

// Example usage in Node.js:
// const { getGitHubRepositories } = require('./gitHubRepos.js');
//
// (async () => {
//     try {
//         const repos = await getGitHubRepositories('torvalds');
//         console.log(`Found ${repos.length} repositories`);
//         repos.forEach(repo => {
//             console.log(`- ${repo.name}: ${repo.stargazers_count} stars`);
//         });
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// })();
