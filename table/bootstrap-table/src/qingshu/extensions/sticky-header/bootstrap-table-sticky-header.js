import '../../../extensions/sticky-header/bootstrap-table-sticky-header.js'

$.extend($.fn.bootstrapTable.defaults, {
  stickyHeader: true
})

$.BootstrapTable = class extends $.BootstrapTable {
  initHeader () {
    super.initHeader()
    // for element selector, like id selector, in table header
    this.$stickyContainer.insertAfter(this.$stickyEnd)
  }

  initStickyHeader () {
    // TODO: clone select2 select
    super.initStickyHeader()
  }

  renderStickyHeader () {
    super.renderStickyHeader()
  }
}
