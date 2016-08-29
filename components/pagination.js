import React from 'react'
import numeral from 'numeral'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const propTypes = {
  page: React.PropTypes.number.isRequired,
  limit: React.PropTypes.number.isRequired,
  total: React.PropTypes.number,
  onPageChange: React.PropTypes.func.isRequired,
  onLimitChange: React.PropTypes.func.isRequired
}

const defaultProps = {
  total: 0
}

export default class Pagination extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      page: props.page
    }
    this.onLimitChange = this.onLimitChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.page !== this.state.page) {
      this.setState({ page: nextProps.page })
    }
  }

  canSetPage (page) {
    const pages = Math.ceil(this.props.total / this.props.limit)
    if (page > pages) return false
    if (page <= 0) return false
    return true
  }

  setPage (page) {
    this.setState({ page })
    if (!this.canSetPage(page)) return
    this.props.onPageChange(page)
  }

  onLimitChange (_, __, value) {
    this.props.onLimitChange(value)
    this.props.onPageChange(1)
  }

  onPageBlur () {
    this.setState({ page: this.props.page })
  }

  renderPages () {
    const pages = Math.ceil(this.props.total / this.props.limit)
    return (
      <div>
        <div style={{ display: 'inline-block' }}>
          <IconButton
          iconClassName='material-icons'
          tooltip='Previous page'
          onTouchTap={() => this.canSetPage(this.props.page - 1) && this.setPage(this.props.page - 1)}>
            navigate_before
          </IconButton>
        </div>
        <div style={{ display: 'inline-block', position: 'relative', top: -7 }}>
          page <TextField
          name='pageInput'
          style={{ width: 40 }}
          inputStyle={{ textAlign: 'center' }}
          value={this.state.page}
          onChange={event => this.setPage(Number(event.target.value))}
          onBlur={this.onPageBlur.bind(this)}/> of {numeral(pages).format()}
        </div>
        <div style={{ display: 'inline-block' }}>
          <IconButton
          iconClassName='material-icons'
          tooltip='Next page'
          onTouchTap={() => this.canSetPage(this.props.page + 1) && this.setPage(this.props.page + 1)}>
            navigate_next
          </IconButton>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div style={{ padding: 10, paddingBottom: 0 }}>
        <div className='row'>
          <div className='col-xs-12 col-sm-6'>
            show <SelectField
            underlineStyle={{display: 'none'}}
            value={this.props.limit}
            onChange={this.onLimitChange}
            style={styles.select}>
              <MenuItem value={10} primaryText='10' />
              <MenuItem value={25} primaryText='25' />
              <MenuItem value={50} primaryText='50' />
              <MenuItem value={100} primaryText='100' />
              <MenuItem value={200} primaryText='200' />
            </SelectField> of {numeral(this.props.total).format()}
          </div>
          <div className='col-xs-12 col-sm-6' style={{ textAlign: 'right' }}>
            {this.renderPages()}
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  select: {
    width: 50,
    marginLeft: 5,
    position: 'relative',
    top: 4
  }
}

Pagination.propTypes = propTypes
Pagination.defaultProps = defaultProps
