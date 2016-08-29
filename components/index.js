import React from 'react'
import Loading from './loading'
import SaveStateComponent from './save-state'
import _ from 'underscore'
import NoItems from './no-items'
import Data from './data'
import Pagination from './pagination'
import CollectionPubGetInfo from './collection'

const propTypes = {
  /**
   * The collection that you are listing
   */
  collection: React.PropTypes.object.isRequired,

  /**
   * Name that you passed in to the publish function
   */
  name: React.PropTypes.string.isRequired,

  /**
   * Component that will be rendered for each item. It will have a item prop
   */
  itemComponent: React.PropTypes.any.isRequired,

  /**
   * Show this component when we are loading
   */
  loadingComponent: React.PropTypes.any,

  /**
   * Show this component whe there are no items
   */
  noItemsComponent: React.PropTypes.any,

  /**
   * The class name of the container component
   */
  parentClassName: React.PropTypes.string,

  /**
   * Component that will render all the items passed in the children prop
   */
  parentComponent: React.PropTypes.any,

  /**
   * Params passed to the publication
   */
  params: React.PropTypes.object,

  /**
   * Sort passed to the publication. Same as mongo sort
   */
  sort: React.PropTypes.object,

  /**
   * Save the state of the pagination
   */
  saveState: React.PropTypes.string,

  /**
   * Hide the pagination when items are smaller than the pages
   */
  autoHidePagination: React.PropTypes.bool,

  /**
   * The collection that has the publication info
   */
  infoCollection: React.PropTypes.any
}

const defaultProps = {
  loadingComponent: (<div style={{ padding: 20 }}><Loading/></div>),
  noItemsComponent: <NoItems />,
  parentClassName: '',
  params: {},
  autoHidePagination: false,
  infoCollection: CollectionPubGetInfo
}

export default class CollectionPub extends SaveStateComponent {

  constructor (props) {
    super(props)
    this.savingKey = props.saveState
    this.savingKeys = ['page', 'limit']
    this.state = {
      ids: [],
      page: 1,
      limit: 10,
      isLoading: false
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      !_.isEqual(this.props.params, prevProps.params) ||
      this.state.limit !== prevState.limit ||
      this.state.page !== prevState.page
    ) {
      if (!_.isEqual(this.props.params, prevProps.params)) {
        this.resetPagination()
      }
    }
  }

  resetPagination () {
    this.setState({ page: 1 })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
  }

  getConnection () {
    return this.props.collection._connection
  }

  renderPagination () {
    if (this.props.autoHidePagination) {
      if (this.state.total <= this.state.limit) return
    }
    return (
      <Pagination
      total={this.state.total}
      page={this.state.page}
      onPageChange={page => this.setState({ page })}
      limit={this.state.limit}
      onLimitChange={limit => this.setState({ limit })}/>
    )
  }

  render () {
    return (
      <div>
        <Data
        connection={this.getConnection()}
        infoCollection={this.props.infoCollection}
        publication={`collectionList.${this.props.name}.docs`}
        infoPublication={`collectionList.${this.props.name}.info`}
        sort={this.props.sort}
        params={this.props.params}
        setTotal={(total) => this.setState({total})}
        skip={(this.state.page - 1) * this.state.limit}
        limit={this.state.limit}
        collection={this.props.collection}
        ids={this.state.ids}
        isLoading={this.state.isLoading}
        itemComponent={this.props.itemComponent}
        loadingComponent={this.props.loadingComponent}
        noItemsComponent={this.props.noItemsComponent}
        parentClassName={this.props.parentClassName}
        parentComponent={this.props.parentComponent}/>
        {this.renderPagination()}
      </div>
    )
  }

}

CollectionPub.propTypes = propTypes
CollectionPub.defaultProps = defaultProps
