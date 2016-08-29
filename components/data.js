import React from 'react'
import {createContainer} from 'meteor/react-meteor-data'

const propTypes = {
  params: React.PropTypes.object.isRequired,
  sort: React.PropTypes.object,
  skip: React.PropTypes.number.isRequired,
  limit: React.PropTypes.number.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  itemComponent: React.PropTypes.any.isRequired,
  loadingComponent: React.PropTypes.any.isRequired,
  noItemsComponent: React.PropTypes.any.isRequired,
  parentClassName: React.PropTypes.string.isRequired,
  parentComponent: React.PropTypes.any,
  connection: React.PropTypes.any.isRequired
}

class CollectionMethodData extends React.Component {

  renderItems () {
    return this.props.items.map((item) => {
      const key = item._id
      return React.createElement(this.props.itemComponent, { key, item })
    })
  }

  renderLoading () {
    return this.props.loadingComponent
  }

  renderNoItems () {
    return this.props.noItemsComponent
  }

  render () {
    if (this.props.isLoading) {
      return this.renderLoading()
    } else if (this.props.items.length > 0) {
      if (this.props.parentComponent) {
        return React.createElement(this.props.parentComponent, {
          className: this.props.parentClassName,
          children: this.renderItems()
        })
      } else {
        return <div className={this.props.parentClassName}>{this.renderItems()}</div>
      }
    } else {
      return this.renderNoItems()
    }
  }
}

CollectionMethodData.propTypes = propTypes

/**
 * Docs container
 */
const idsContainer = createContainer(({ids, publication, collection, isLoading, params, connection}) => {
  const handler = connection.subscribe(publication, ids, params)
  const items = []
  ids.map(id => {
    const item = collection.findOne(id)
    if (item) {
      items.push(item)
    }
  })
  const finalLoading = isLoading || !handler.ready() ? items.length === 0 : false
  return {isLoading: finalLoading, items}
}, CollectionMethodData)

/**
 * Fetch info container
 */
export default createContainer(({skip, sort, limit, params, infoPublication, setTotal, connection, infoCollection}) => {
  const data = infoPublication + window.btoa(JSON.stringify(params)) + window.btoa(skip) + window.btoa(limit) + window.btoa(sort)
  const identifier = '' + data.split('').reduce((prevHash, currVal) => ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0)
  const handler = connection.subscribe(infoPublication, params, skip, limit, identifier, sort)
  const info = infoCollection.findOne(identifier)
  const isLoading = !handler.ready()
  const ids = info ? info.ids : []
  const total = info ? info.total : 0
  setTotal(total)
  return {isLoading, ids}
}, idsContainer)
