# GitHub Repository Finder

A simple async function to fetch and display GitHub repositories for any public GitHub user.

## Files

### 1. `gitHubRepos.js` - Node.js Module
A CommonJS module that provides async functions to fetch GitHub repositories.

**Functions:**

#### `getGitHubRepositories(username)`
Fetches all public repositories for a given GitHub username.

```javascript
async function getGitHubRepositories(username)
```

**Parameters:**
- `username` (string): GitHub username

**Returns:**
- Promise that resolves to an array of repository objects from GitHub API

**Throws:**
- Error if username is invalid or user not found
- Error if GitHub API request fails

**Example:**
```javascript
const { getGitHubRepositories } = require('./gitHubRepos.js');

try {
    const repos = await getGitHubRepositories('torvalds');
    console.log(`Found ${repos.length} repositories`);
} catch (error) {
    console.error('Error:', error.message);
}
```

#### `formatRepositories(repositories)`
Formats raw GitHub API response into a cleaner structure.

```javascript
function formatRepositories(repositories)
```

**Parameters:**
- `repositories` (Array): Array of repository objects from GitHub API

**Returns:**
- Array of formatted repository objects with:
  - `name`: Repository name
  - `description`: Repository description
  - `url`: Repository URL
  - `stars`: Number of stars
  - `forks`: Number of forks
  - `language`: Primary programming language
  - `updated`: Last update date

**Example:**
```javascript
const formatted = formatRepositories(repos);
formatted.forEach(repo => {
    console.log(`${repo.name}: ${repo.stars} ⭐`);
});
```

### 2. `github-repos.html` - Web Interface
A beautiful, interactive web application to search and browse GitHub repositories.

**Features:**
- 🔍 Search GitHub users by username
- 📦 Display all public repositories
- ⭐ Show repository statistics (stars, forks)
- 📅 Display last update date
- 🎨 Responsive card-based layout
- 💡 Example quick links (torvalds, gvanrossum, etc.)
- ⏳ Loading states and error handling
- 🔗 Direct links to GitHub repositories

**To Use:**
1. Open `github-repos.html` in a web browser
2. Enter a GitHub username
3. Click "Search" or press Enter
4. View all repositories in an interactive grid

**Example Usernames:**
- `torvalds` - Linus Torvalds (Linux creator)
- `gvanrossum` - Guido van Rossum (Python creator)
- `octocat` - GitHub's mascot
- `facebook` - Facebook organization
- `google` - Google organization

## API Reference

### GitHub REST API Endpoint
```
GET https://api.github.com/users/{username}/repos
```

**Rate Limits:**
- Unauthenticated: 60 requests per hour
- Authenticated: 5,000 requests per hour

**Response:**
Returns JSON array of repository objects with properties like:
- `name`: Repository name
- `description`: Repository description
- `html_url`: Repository URL
- `stargazers_count`: Number of stars
- `forks_count`: Number of forks
- `language`: Primary programming language
- `updated_at`: Last update timestamp

## Usage Examples

### Node.js
```javascript
const { getGitHubRepositories, formatRepositories } = require('./gitHubRepos.js');

(async () => {
    try {
        // Fetch repositories
        const repos = await getGitHubRepositories('torvalds');
        
        // Format for display
        const formatted = formatRepositories(repos);
        
        // Display results
        console.log(`Found ${formatted.length} repositories:\n`);
        formatted.forEach(repo => {
            console.log(`📦 ${repo.name}`);
            console.log(`   Description: ${repo.description}`);
            console.log(`   Stars: ${repo.stars} | Forks: ${repo.forks}`);
            console.log(`   Language: ${repo.language}`);
            console.log(`   Updated: ${repo.updated}\n`);
        });
    } catch (error) {
        console.error('Error fetching repositories:', error.message);
    }
})();
```

### Browser (Fetch API)
```javascript
async function getGitHubRepositories(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    if (!response.ok) throw new Error('User not found');
    return await response.json();
}

// Usage
getGitHubRepositories('octocat')
    .then(repos => console.log(`Found ${repos.length} repos`))
    .catch(err => console.error(err));
```

## Error Handling

The module includes comprehensive error handling:

```javascript
try {
    const repos = await getGitHubRepositories('invalid_username_xyz');
} catch (error) {
    if (error.message.includes('not found')) {
        console.log('User does not exist');
    } else if (error.message.includes('API error')) {
        console.log('GitHub API is unavailable');
    } else {
        console.log('Network error:', error.message);
    }
}
```

## Features

✅ **Async/Await Pattern** - Non-blocking asynchronous operations  
✅ **Error Handling** - Comprehensive error messages  
✅ **Data Formatting** - Converts API response to user-friendly format  
✅ **Web Interface** - Beautiful HTML/CSS UI  
✅ **Responsive Design** - Works on mobile, tablet, desktop  
✅ **Loading States** - Visual feedback during API calls  
✅ **Example Links** - Quick access to famous developers  
✅ **GitHub Integration** - Direct links to repositories  

## Technical Details

**Technologies Used:**
- JavaScript (ES6+)
- Async/Await
- Fetch API
- GitHub REST API
- HTML5
- CSS3 (Grid, Flexbox, Gradients)

**Browser Compatibility:**
- Chrome 51+
- Firefox 52+
- Safari 10.1+
- Edge 15+

**API Rate Limit Handling:**
The GitHub API returns rate limit information in response headers:
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Time when limit resets

## Limitations

1. **Public Repositories Only** - Cannot fetch private repositories without authentication
2. **Rate Limiting** - Unauthenticated requests are limited to 60 per hour
3. **Pagination** - Default response limited to 30 repos (can be increased with parameters)
4. **No Authentication** - This basic version doesn't support OAuth tokens

## Future Enhancements

- Add authentication for higher rate limits
- Implement pagination for users with many repositories
- Add filtering by language, stars, forks
- Add sorting options
- Cache results to reduce API calls
- Add user profile information
- Add search functionality within repositories

## Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub API Rate Limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Async/Await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
