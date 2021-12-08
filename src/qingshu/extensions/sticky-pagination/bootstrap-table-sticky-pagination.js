$.extend($.fn.bootstrapTable.defaults, {
  paginationFixed: true
})

const Utils = $.fn.bootstrapTable.utils

$.BootstrapTable = class extends $.BootstrapTable {
  initPagination () {
    super.initPagination()

    if (!this.options.paginationFixed) {
      return
    }
    const resizeEvent = Utils.getEventName('resize.sticky-header-table', this.$el.attr('id'))
    const scrollEvent = Utils.getEventName('scroll.sticky-pagination', this.$el.attr('id'))

    $(window).off(resizeEvent).on(resizeEvent, () => this.renderStickyPagination())
    $(window).off(scrollEvent).on(scrollEvent, () => this.renderStickyPagination())
  }

  resetView (...arg) {
    super.resetView(...arg)
    this.renderStickyPagination()
  }

  renderStickyPagination () {
    const $window = $(window)
    const windowHeight = $window.height()
    const paginationHeight = this.$pagination.height()
    const top = $window.scrollTop()
    const start = this.$stickyBegin.offset().top - this.options.stickyHeaderOffsetY + this.$header.height() + paginationHeight
    const end = this.$stickyEnd.offset().top - this.options.stickyHeaderOffsetY
    const tableWidth = this.$tableBody[0].getBoundingClientRect().width

    if (start - top < windowHeight && end + paginationHeight - top > windowHeight) {
      this.$pagination.css({
        position: 'fixed',
        bottom: '0',
        width: `${tableWidth}px`
      })
    } else {
      this.$pagination.css({
        position: 'relative',
        bottom: 'initial',
        width: `${tableWidth}px`
      })
    }
  }
}
