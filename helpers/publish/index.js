import _ from 'underscore'
import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import find from './find'

export default function ({
  name,
  collection,
  searchFields,
  getSearchFields,
  showFields,
  hiddenShowFields,
  sort,
  getQuery
}) {
  Meteor.publish(`collectionList.${name}.info`, function (options, skip, limit, identifier) {
    check(options, Object)
    check(skip, Number)
    check(limit, Number)
    check(identifier, String)

    const {filter} = options
    const query = getQuery ? getQuery.call(this, options) : {}
    searchFields = getSearchFields ? getSearchFields.call(this, options) : searchFields
    find({collection, filter, skip, limit, fields: searchFields, sort, query, publication: this, identifier})
  })

  Meteor.publish(`collectionList.${name}.docs`, function (ids) {
    check(ids, [String])
    const query = { _id: { $in: ids } }
    const options = {}

    if (showFields) {
      options.fields = _.object(showFields, Array(showFields.length).fill(1))
    } else if (hiddenShowFields) {
      options.fields = _.object(hiddenShowFields, Array(hiddenShowFields.length).fill(0))
    }

    return collection.find(query, options)
  })
}
