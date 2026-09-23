// Applies the saved theme before first paint. Kept external so the CSP can forbid inline scripts.
(function () {
  var root = document.documentElement
  try {
    root.dataset.theme = localStorage.getItem('atlas-theme') === 'light' ? 'light' : 'dark'
    if (localStorage.getItem('atlas-stage') === '1') root.dataset.stage = ''
  } catch (error) {
    root.dataset.theme = 'dark'
  }
})()
