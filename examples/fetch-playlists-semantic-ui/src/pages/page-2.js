import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import Playlist from '../components/playlist'
import Layout from '../components/layout'

const SecondPage = ({ data }) => {
  const { playlists } = data
  return (
    <Layout>
      <h2><span role="img" aria-label="Eyes">👀</span> Hello from the second page.</h2>
      <p>Pretty, isn't it?</p>
      <div className="ui cards playlists">
        {playlists.edges.map(({ node: playlist }) => (
          <Playlist key={playlist.spotifyId} data={playlist} />
        ))}
      </div>
    </Layout>
  )
}

export default props => (
  <StaticQuery
    query={graphql`
      query SpotifyPlaylists {
        playlists: allSpotifyPlaylist(
          # filter: { spotifyId: {eq: "1nVxTfwvJcK4Huoz1BtHar"}}
          # filter: { name: {regex: "/Album Cover/"}}
          limit: 20
        ) {
          edges {
            node {
              spotifyId
              name
              href
              image {
                localFile {
                  childImageSharp {
                    fluid(maxWidth: 400) {
                      ...GatsbyImageSharpFluid_withWebp
                    }
                  }
                }
              }
              images {
                url
                height
                width
              }
              tracks{
                href
                total
              }
              owner{
                display_name
              }
            }
          }
        }
      }
    `}
    render={data => <SecondPage data={data} {...props} />}
  />
)