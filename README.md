# gatsby-source-spotify

[![npm](https://img.shields.io/npm/v/gatsby-source-spotify.svg)](https://www.npmjs.com/package/gatsby-source-spotify) [![Build Status](https://travis-ci.org/leolabs/gatsby-source-spotify.svg?branch=master)](https://travis-ci.org/leolabs/gatsby-source-spotify)

This source plugin for Gatsby fetches personal statistics and playlists from
[Spotify](https://spotify.com). You can use this to display a list of your
favorite artists and tracks, or your public playlists.

gatsby-source-spotify is compatible with [gatsby-image](https://www.gatsbyjs.org/packages/gatsby-image/).
Images are always accessible using the `image` key of a node. Downloaded images are
cached locally to improve build times.

## Configuration

To use this plugin, you have to provide a client id, a client secret,
and a personal refresh token from Spotify. 

1. To do this, first
[create a new Spotify App](https://developer.spotify.com/dashboard/applications).

2. After you created it, click the "Edit Settings" button on the
   application dashboard, add `http://localhost:5071/spotify` to
   the "Redirect URIs" section and hit save.

3. You can then run gatsby-source-spotify's integrated tool to log in using your
Spotify account and to get your refresh token.

```shell
$ npx gatsby-source-spotify token <clientId> <clientToken>
```

4. Put those credentials into your `gatsby-config.js` and you're good to go 🎉

```javascript
{
  resolve: `gatsby-source-spotify`,
  options: {
    clientId: `<CLIENT_ID>`,
    clientSecret: `<CLIENT_SECRET>`,
    refreshToken: `<REFRESH_TOKEN>`,

    fetchPlaylists: true, // optional. Set to false to disable fetching of your playlists
    fetchRecent: true, // optional. Set to false to disable fetching of your recently played tracks
    timeRanges: ['short_term', 'medium_term', 'long_term'], // optional. Set time ranges to be fetched
  },
},
```

## Time Ranges

According to Spotify, the time ranges are specified as follows:

- `short_term`: Data from the last four weeks
- `medium_term`: Data from the last six months
- `long_term`: All data since the account's creation

## Querying Data

For your top artists and tracks, I'd recommend filtering by one `time_range` and
sorting by `order`. This ensures that you get the correct results.

Example for your top artists with images and genres:

```graphql
{
  allSpotifyTopArtist(
    filter: { time_range: { eq: "medium_term" } }
    sort: { fields: order }
  ) {
    edges {
      node {
        name
        genres
        image {
          localFile {
            childImageSharp {
              fluid(maxWidth: 400) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
  }
}
```

## Contributing

If you're interested in contributing, please feel free to open a pull request.
