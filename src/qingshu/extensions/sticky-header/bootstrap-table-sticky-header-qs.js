import '../../../extensions/sticky-header/bootstrap-table-sticky-header.js'

$.BootstrapTable = class extends $.BootstrapTable {
  initHeader () {
    super.initHeader()
    // for element selector, like id selector, in table header
    this.$tableBody.find('.sticky-header-container').insertAfter(this.$tableBody.find('.sticky_anchor_end'))
  }

  initStickyHeader () {
    // TODO: clone select2 select
    super.initStickyHeader()
  }

  renderStickyHeader () {
    const top = $(window).scrollTop()
    const start = this.$stickyBegin.offset().top - this.options.stickyHeaderOffsetY
    const end = this.$stickyEnd.offset().top - this.options.stickyHeaderOffsetY - this.$header.height()

    if (top > start && top <= end) {
      if (this.$stickyContainer.is(':empty')) {
        super.renderStickyHeader()
      }
    } else {
      this.$stickyContainer.removeClass('fix-sticky').hide().empty()
    }
  }
}
