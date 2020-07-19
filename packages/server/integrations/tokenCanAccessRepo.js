import { GITHUB_ENDPOINT } from 'parabol-client/utils/constants'
import makeGitHubPostOptions from 'parabol-client/utils/makeGitHubPostOptions'
import fetch from 'node-fetch'

// repo collaborators isn't part of github v4 yet, so we'll need to check that using v3
const getRepoQuery = `
query getRepo($name: String! $owner: String!) {
  repository(name: $name, owner: $owner) {
    databaseId
    viewerCanAdminister
    owner {
      __typename
      ... on Organization {
        viewerIsAMember
      }
    }
  }
}`

const tokenCanAccessRepo = async (accessToken, nameWithOwner) => {
  const [owner, name] = nameWithOwner.split('/')
  // see if the githubRepoId is legit

  const authedPostOptions = makeGitHubPostOptions(accessToken, {
    query: getRepoQuery,
    variables: { name, owner }
  })
  const ghProfile = await fetch(GITHUB_ENDPOINT, authedPostOptions)
  return ghProfile.json()
}

export default tokenCanAccessRepo
