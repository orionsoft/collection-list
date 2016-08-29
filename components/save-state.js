import React from 'react'
import {Meteor} from 'meteor/meteor'
import _ from 'underscore'

export default class SaveStateComponent extends React.Component {

  componentWillMount () {
    if (!this.shouldSaveState()) return
    this.setState(this.getSavedState())
  }

  componentWillUpdate (nextProps, nextState) {
    if (!this.shouldSaveState()) return
    this.saveState(nextState)
  }

  shouldSaveState () {
    return !!this.savingKey
  }

  getKey () {
    return 'ss-' + this.savingKey
  }

  getSavedState () {
    if (!Meteor.isClient) return {}
    return JSON.parse(window.localStorage[this.getKey()] || '{}')
  }

  saveState (state) {
    if (!Meteor.isClient) return
    if (this.savingKeys) {
      state = _.pick(state, this.savingKeys)
    }
    window.localStorage[this.getKey()] = JSON.stringify(state)
  }

}

Meteor.startup(function () {
  if (!Meteor.isClient) return
  _.keys(window.localStorage).map((key) => {
    if (!key.startsWith('ss-')) return
    delete window.localStorage[key]
  })
})
