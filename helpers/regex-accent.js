import _ from 'underscore'

export default function (text) {
  text = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')

  const strings = {
    a: ['á'],
    e: ['é'],
    i: ['í'],
    o: ['ó'],
    u: ['ú']
  }

  _.keys(strings).map(letter => {
    text = text.replace(new RegExp(letter, 'g'), `[${strings[letter].join('')}${letter}]`)
  })

  return text
}
