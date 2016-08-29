import React from 'react'
import * as Colors from 'material-ui/styles/colors'
import FontIcon from 'material-ui/FontIcon'

export default class NoItems extends React.Component {
  render () {
    return (
      <div style={{ paddingTop: 20, textAlign: 'center' }}>
        <FontIcon className='material-icons' style={styles.icon}>error_outline</FontIcon>
        <div style={styles.text}>
          No items found
        </div>
      </div>
    )
  }
}

const styles = {
  icon: {
    fontSize: 100,
    color: Colors.grey500
  },
  text: {
    fontSize: 22,
    color: Colors.grey500,
    paddingTop: 10,
    paddingBottom: 20
  }
}
