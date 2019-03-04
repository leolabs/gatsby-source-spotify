import React from 'react'
import { Link } from 'gatsby'
import { Container } from 'semantic-ui-react'

const Header = ({ siteTitle }) => (
  <div style={{ background: 'rebeccapurple' }}>
    <Container>
      <h1 style={{ padding: '1rem 0', marginBottom: '2rem' }}>
        <Link style={{ color: 'white' }} to="/">
          {siteTitle}
        </Link>
      </h1>
    </Container>
  </div>
)

export default Header
