# How to Remove Devin Bot from GitHub Contributors

The devin-ai-integration[bot] appears in your GitHub contributors list, but it's not in your git commit history. This means it was likely added as a collaborator or through GitHub's integration settings, not through commits.

## Steps to Remove Devin Bot from GitHub Repository

### Method 1: Remove from Collaborators (if applicable)

1. **Go to your repository settings**
   - Navigate to `https://github.com/Piyush0000/internship_task/settings`

2. **Check Collaborators & teams**
   - Click on "Collaborators" in the left sidebar
   - If you see `devin-ai-integration[bot]` in the list, click "Remove" next to it

### Method 2: Remove from Integration Settings

1. **Go to repository settings**
   - Navigate to `https://github.com/Piyush0000/internship_task/settings`

2. **Check Applications**
   - Click on "Applications" in the left sidebar
   - Look for any Devin or Cognition-related applications
   - Remove any that you don't recognize or want to keep

### Method 3: Check GitHub App Integrations

1. **Go to your GitHub account settings**
   - Navigate to `https://github.com/settings/installations`

2. **Check installed apps**
   - Look for any Devin-related applications
   - Remove or uninstall if found

### Method 4: Contact GitHub Support (if stuck)

If the bot still appears and you can't remove it through the above methods:

1. Go to GitHub's contact form
2. Choose "Repository issues" as the topic
3. Explain that a bot appears in contributors but not in commit history
4. Request removal of the bot from your repository

## Why This Happens

GitHub's contributor calculation includes:
- Commit authors
- Co-authors in commits
- People who have opened pull requests
- Repository collaborators
- GitHub app integrations that have interacted with the repo

Since the bot isn't in your commit history, it was likely added through one of the other methods (collaborator access or GitHub app integration).

## Verification

After removal, check your repository's contributors section:
- Go to the main repository page
- Click on the contributors count (currently shows "2")
- Verify only your profile appears

## Prevention

To prevent this in the future:
- Be careful when authorizing GitHub apps
- Review repository collaborators regularly
- Check repository settings after using any AI coding tools
