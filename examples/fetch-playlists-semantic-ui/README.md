# Example of `gatsby-source-spotify`

### Installation

```sh
cp .env.example .env.development
# fill in the  SPOTIFY_CLIENT_ID=
#              SPOTIFY_CLIENT_SECRET=
#              SPOTIFY_REFRESH_TOKEN=
npm i
npm run develop
```
Using Graphiql `http://localhost:8000/___graphql` should give a better
understanding of how schemas are structured.

### Query Examples
To fetch one playlist
```graphql
query SpotifyPlaylistAlbumCover {
  playlist: spotifyPlaylist(name: {regex: "/Album Cover/"}) {
    spotifyId
    name
    spotifyId
    images {
      url
      width
      height
    }
    tracks {
      href
      total
    }
  }
}
```

Or to fetch all Spotify playlists: 
```graphql
query SpotifyPlaylists {
  playlist: allSpotifyPlaylist(
    # filter: { spotifyId: {eq: "1nVxTfwvJcK4Huoz1BtHar"}}
    # filter: { name: {regex: "/Album Cover/"}}
    limit: 100) {
    edges {
      node {
        spotifyId
        name
        # href
        # image {
        #   localFile {
        #     childImageSharp {
        #       fluid(maxWidth: 400) {
        #         src
        #       }
        #     }
        #   }
        # }
        # images {
        #   url
        #   height
        #   width
        # }
        # tracks{
        #   href
        #   total
        # }

      }
    }
  }
}
```

for image graphql fragments check `gatsby-image` docs.
https://www.gatsbyjs.org/packages/gatsby-image/#fragments

## License
See the [LICENSE file](./LICENSE.md) for more details.
