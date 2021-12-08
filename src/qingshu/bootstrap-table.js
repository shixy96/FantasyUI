import '../bootstrap-table.js'
import '../locale/bootstrap-table-zh-CN.js'

$.extend($.fn.bootstrapTable.locales['zh-CN'], {
  formatShowingRows (pageFrom, pageTo, totalRows) {
    return `共${totalRows}条数据`
  },
  formatSRPaginationPageText (page) {
    return `\u7B2C${page}\u9875`
  },
  formatDetailPagination (totalRows) {
    return `\u603B\u5171 ${totalRows} \u6761\u8BB0\u5F55`
  },
  formatNoMatches () {
    return '暂无内容'
  }
})

$.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN'], {
  cache: false,
  classes: 'table table-hover',
  pageSize: 20,
  pageList: [20],
  queryParamsType: 'page',
  paginationSuccessivelySize: 11,
  paginationPagesBySide: 1
})

$.BootstrapTable = class extends $.BootstrapTable {
  getPaginationFromTo () {
    const opts = this.options
    let from
    let to

    if (this.totalPages < opts.paginationSuccessivelySize) {
      from = 1
      to = this.totalPages
    } else {
      from = opts.pageNumber < opts.paginationSuccessivelySize - 1 ? 1 : opts.pageNumber - (Math.floor(opts.paginationSuccessivelySize / 2))
      to = from + opts.paginationSuccessivelySize - 1
    }

    if (opts.pageNumber < (opts.paginationSuccessivelySize - 1)) {
      to = opts.paginationSuccessivelySize - 1
    }

    if (opts.paginationSuccessivelySize > this.totalPages - from) {
      from = from - (opts.paginationSuccessivelySize - (this.totalPages - from + 1)) + 1
    }
    if (opts.paginationSuccessivelySize >= this.totalPages - opts.pageNumber + 3) {
      from = this.totalPages - opts.paginationSuccessivelySize + 2
      to = this.totalPages
    }

    if (from < 1) {
      from = 1
    }

    if (to > this.totalPages) {
      to = this.totalPages
    }

    return { from, to }
  }

  initPagination () {
    super.initPagination()
    const opts = this.options

    if (this.totalRows < 1) {
      this.$pagination.hide()
      return
    }

    $(`<span class="transfer-info">到第<input id="target-page-num" value="${opts.pageNumber}">页<button class="transfer-btn btn btn-sx btn-gb">确定</button></span></ul></div>`)
      .appendTo(this.$pagination.find('ul'))

    if (!opts.onlyInfoPagination) {
      const $pageFirstSeparator = this.$pagination.find('.page-first-separator')
      const $pageLastSeparator = this.$pagination.find('.page-last-separator')
      const $transferBtn = this.$pagination.find('.transfer-btn')

      $pageFirstSeparator.off('click').on('click', e => this.onPagePrevSuccessively(e))
      $pageLastSeparator.off('click').on('click', e => this.onPageNextSuccessively(e))
      $transferBtn.off('click').on('click', e => this.onPageJump(e))
    }
  }

  onPagePrevSuccessively (event) {
    if (this.options.pageNumber - this.options.paginationSuccessivelySize <= 0) {
      this.options.pageNumber = this.options.totalPages
    } else {
      this.options.pageNumber -= this.options.paginationSuccessivelySize
    }
    this.updatePagination(event)
    return false
  }

  onPageNextSuccessively (event) {
    if (this.options.pageNumber + this.options.paginationSuccessivelySize > this.options.totalPages) {
      this.options.pageNumber = 1
    } else {
      this.options.pageNumber += this.options.paginationSuccessivelySize
    }
    this.updatePagination(event)
    return false
  }

  onPageJump (event) {
    const targetNum = +$('#target-page-num').val()

    if (!targetNum || this.options.pageNumber === targetNum) {
      return
    }

    this.options.pageNumber = targetNum
    this.updatePagination(event)
    return false
  }

  initServer (silent, query, url) {
    super.initServer(silent, query, url)
    if (this.options.hideLoading) {
      this.hideLoading()
    }
  }
}
