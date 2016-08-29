import _ from 'underscore'
import regexAccent from '../regex-accent'

export default function ({collection, filter, skip, limit, fields, sort, query, publication, identifier}) {
  sort = sort || { createdAt: -1 }
  limit = limit > 100 ? 100 : limit

  query.$or = query.$or || []

  if (_.isArray(fields)) {
    fields.map(field => {
      const search = {}
      search[field] = new RegExp(`${regexAccent(filter)}.*`, 'gi')
      query.$or.push(search)
    })
  } else if (fields) {
    query[fields] = new RegExp(`${regexAccent(filter)}.*`, 'gi')
  }

  if (query.$or.length === 0) {
    delete query.$or
  }

  const options = {
    skip,
    limit,
    sort,
    fields: { _id: 1 }
  }

  const filteredCursor = collection.find(query, options)
  const countCursor = collection.find(query)

  let itemsIds = filteredCursor.map(item => item._id)
  let recordReady = false
  const updateRecords = function () {
    const currentCount = countCursor.count()

    const doc = {
      ids: itemsIds,
      total: currentCount
    }

    if (recordReady) {
      publication.changed('collection_pub_get_info', identifier, doc)
    } else {
      publication.added('collection_pub_get_info', identifier, doc)
      recordReady = true
    }
  }

  updateRecords()
  publication.ready()

  let initializing = true
  const handle = filteredCursor.observeChanges({
    addedBefore: function (id, field, before) {
      if (initializing) return
      if (before) {
        const index = itemsIds.indexOf(before)
        itemsIds.splice(index, 0, id)
      } else {
        itemsIds.push(id)
      }
      updateRecords()
    },
    movedBefore: function (id, before) {
      itemsIds = _.without(itemsIds, id)
      if (before) {
        const index = itemsIds.indexOf(before)
        itemsIds.splice(index, 0, id)
      } else {
        itemsIds.push(id)
      }
      updateRecords()
    },
    removed: function (id) {
      itemsIds = _.without(itemsIds, id)
      updateRecords()
    }
  })
  initializing = false

  publication.onStop(function () {
    handle.stop()
  })
}
