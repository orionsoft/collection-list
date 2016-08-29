Package.describe({
  name: 'orionsoft:collection-list',
  version: '0.0.1',
  summary: 'List documents in your collections with React',
  git: '',
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.4.1.1')
  api.use('ecmascript')
  api.mainModule('main.js')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('orionsoft:collection-list')
  api.mainModule('collection-list-tests.js')
})
