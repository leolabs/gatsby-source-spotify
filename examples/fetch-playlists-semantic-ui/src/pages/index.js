import React from 'react'

import { Button } from 'semantic-ui-react'
import Layout from '../components/layout'

const IndexPage = () => (
  <Layout>
    <h2>
      <span role="img" aria-label="Waving hand">
        👋
      </span>{' '}
      Hey there!
    </h2>

    <p>
      Welcome to this humble Gatsby Semantic UI starter. It is a very thin layer
      on top of the regular Gatsby 2 starter. All that has been added is
      Semantic UI as the component library of choice.
    </p>

    <p>
      Everything is pre-setup and ready to go. You can either use the default
      Semantic UI theme as it currently runs, or you can override all variables
      and make custom CSS changes in the <code>src/semantic/site</code> folder.
    </p>

    <p>
      The folder contains all the standard settings of the default theme so you
      don't have to remember which variables are available.
    </p>

    <Button primary>I'm a button!</Button>
  </Layout>
)

export default IndexPage
