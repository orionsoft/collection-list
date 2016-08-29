import React from 'react'

const propTypes = {

}

const defaultProps = {

}

export default class Loading extends React.Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        im loading...
      </div>
    )
  }

}

Loading.propTypes = propTypes
Loading.defaultProps = defaultProps
