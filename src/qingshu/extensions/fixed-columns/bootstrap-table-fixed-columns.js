import '../../../extensions/fixed-columns/bootstrap-table-fixed-columns.js'
import { normalizeWheel } from '../../../utils/wheel.js'

$.BootstrapTable = class extends $.BootstrapTable {
  /**
   * inherit from bootstrap-table-fixed-columns
   * remove duplicate listener of tr
   */
  initFixedColumnsEvents () {
    const toggleHover = (e, toggle) => {
      const tr = `tr[data-index="${$(e.currentTarget).data('index')}"]`
      let $trs = this.$tableBody.find(tr)

      if (this.$fixedBody) {
        $trs = $trs.add(this.$fixedBody.find(tr))
      }
      if (this.$fixedBodyRight) {
        $trs = $trs.add(this.$fixedBodyRight.find(tr))
      }

      $trs.css('background-color', toggle ? $(e.currentTarget).css('background-color') : '')
    }

    this.$tableBody.find('tr').off('mouseenter mouseleave').hover(e => {
      toggleHover(e, true)
    }, e => {
      toggleHover(e, false)
    })

    const isFirefox = typeof navigator !== 'undefined' &&
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    const mousewheel = isFirefox ? 'DOMMouseScroll' : 'mousewheel'
    const updateScroll = (e, fixedBody) => {
      const normalized = normalizeWheel(e)
      const deltaY = Math.ceil(normalized.pixelY)
      const top = this.$tableBody.scrollTop() + deltaY

      if (
        deltaY < 0 && top > 0 ||
        deltaY > 0 && top < fixedBody.scrollHeight - fixedBody.clientHeight
      ) {
        e.preventDefault()
      }

      this.$tableBody.scrollTop(top)
      if (this.$fixedBody) {
        this.$fixedBody.scrollTop(top)
      }
      if (this.$fixedBodyRight) {
        this.$fixedBodyRight.scrollTop(top)
      }
    }

    if (this.needFixedColumns && this.options.fixedNumber) {
      this.$fixedBody[0].addEventListener(mousewheel, e => {
        updateScroll(e, this.$fixedBody[0])
      })
    }

    if (this.needFixedColumns && this.options.fixedRightNumber) {
      this.$fixedBodyRight.off('scroll').on('scroll', () => {
        const top = this.$fixedBodyRight.scrollTop()

        this.$tableBody.scrollTop(top)
        if (this.$fixedBody) {
          this.$fixedBody.scrollTop(top)
        }
      })
    }

    if (this.options.filterControl) {
      $(this.$fixedColumns).off('keyup change').on('keyup change', e => {
        const $target = $(e.target)
        const value = $target.val()
        const field = $target.parents('th').data('field')
        const $coreTh = this.$header.find(`th[data-field="${field}"]`)

        if ($target.is('input')) {
          $coreTh.find('input').val(value)
        } else if ($target.is('select')) {
          const $select = $coreTh.find('select')

          $select.find('option[selected]').removeAttr('selected')
          $select.find(`option[value="${value}"]`).attr('selected', true)
        }

        this.triggerSearch()
      })
    }
  }

  /**
   * inherit from bootstrap-table-fixed-columns
   * overwrite fixed column position and width
   */
  renderFixedStickyHeader () {
    if (!this.options.stickyHeader) {
      return
    }

    const coords = this.$tableBody[0].getBoundingClientRect()
    let stickyHeaderOffsetLeft = this.options.stickyHeaderOffsetLeft
    let stickyHeaderOffsetRight = this.options.stickyHeaderOffsetRight

    if (!stickyHeaderOffsetLeft) {
      stickyHeaderOffsetLeft = coords.left
    }
    if (!stickyHeaderOffsetRight) {
      stickyHeaderOffsetRight = `calc(100% - ${coords.right}px)`
    }
    if (this.$el.closest('.bootstrap-table').hasClass('fullscreen')) {
      stickyHeaderOffsetLeft = 0
      stickyHeaderOffsetRight = 0
    }

    if (this.needFixedColumns && this.options.fixedNumber) {
      this.$fixedColumns.css('z-index', 101)
        .find('.sticky-header-container')
        .css({ right: '', left: stickyHeaderOffsetLeft })
        .width(this.$fixedColumns.outerWidth())
    }

    if (this.needFixedColumns && this.options.fixedRightNumber) {
      const $stickyHeaderContainerRight = this.$fixedColumnsRight.find('.sticky-header-container')

      this.$fixedColumnsRight.css('z-index', 101)
      $stickyHeaderContainerRight.css({ left: '', right: stickyHeaderOffsetRight })
        .width(this.$fixedColumnsRight.outerWidth())
        .scrollLeft($stickyHeaderContainerRight.find('.table').outerWidth())
    }
  }
}
