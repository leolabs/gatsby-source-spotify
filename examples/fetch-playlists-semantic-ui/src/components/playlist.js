import React from 'react'
import Img from 'gatsby-image'
import placeholderImage from '../assets/images/placeholder.png'

const PlaylistImage = ({ data }) => {
  if (!data.image) {
    return (
      <div className="image">
        <img className="ui image" src={placeholderImage} />
      </div>
    )
  }
  return (
    <div className="image">
      <Img fluid={data.image.localFile.childImageSharp.fluid} />
    </div>
  )
}

const Playlist = ({ data }) => (
  <div className="card">
    <PlaylistImage data={data} />
    <div className="content">
      <div className="header">{data.name}</div>
      <div className="meta">
        {data.spotifyId}
      </div>
    </div>
    <div className="extra content">
      <span className="right floated">
        <i className="user icon" />
        by: {data.owner.display_name}
      </span>
      <span>
        <i className="music icon" />
        tracks: {data.tracks.total}
      </span>
    </div>
  </div>
)

export default Playlist