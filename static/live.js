console.log('test live.js')
window.onload = function () {
  var script = document.createElement("script")
  script.type = "text/javascript"
  script.src = "./jquery.js"
  document.getElementsByTagName('head')[0].appendChild(script)
  $(function () {
    $('html').css('overflow', 'hidden')
    $('span.v-top:contains(登录)').click()
    $('.t:contains(注册)').remove()
  })
}