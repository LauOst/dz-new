var supportIE = {
  install: function(Vue) {
    Vue.directive('support', {
      inserted: function(el) {
        if (('placeholder' in document.createElement('input'))) {
          return
        }
        if (/^el/.test(el.className)) {
          el = el.querySelector('[placeholder]')
        }

        var placeholder = el.getAttribute('placeholder') || '请输入'
        var span = document.createElement('span')
        span.className = 'ie-placeholder'
        span.innerText = placeholder
        span.style.left = el.offsetLeft !== 0 ? el.offsetLef + 'px' : getStyle(el, 'paddingLeft')
        el.parentNode.style.position = 'relative'
        el.insertAdjacentElement('afterend', span)
        span.onclick = function() {
          el.focus()
        }
        if (el.getAttribute('readOnly') !== null) {
          el.setAttribute('unselectable', 'on')
        }
        el.onpropertychange = el.attachEvent('onpropertychange', function() {
          el.value === '' ? span.style.display = 'inline' : span.style.display = 'none'
        })
        el.onblur = function(event) {
          if (!event.target.value) {
            span.style.display = 'inline'
          }
        }
        el.keyup = el.addEventListener('keyup', function(event) {
          if (!event.target.value) {
            span.style.display = 'inline'
          }
        })
        function getStyle(obj, attr) {
          if (obj.currentStyle) {
            return obj.currentStyle[attr]
          } else {
            return document.defaultView.getComputedStyle(obj, null)[attr]
          }
        }
      },
      unbind: function(el) {
        el.onfocus = el.onblur = el.oninput = null
      }
    })
  }
}

export default supportIE
