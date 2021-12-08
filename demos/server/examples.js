/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * examples for projects
 */

const projects = {
  bootstrap_table: {
    data(req, res) {
      const offset = +req.query.offset || 0
      const limit = +req.query.limit || 0
      const search = req.query.search
      const name = req.query.sort
      const order = req.query.order || 'asc'
      const total = req.query.total || 800
      const filter = JSON.parse(req.query.filter || '{}')
      const sleep = req.query.sleep || 0
      let i
      let max = offset + limit
      let rows = []

      const result = {
        total,
        totalNotFiltered: total,
        rows: []
      }

      for (i = 0; i < result.total; i++) {
        rows.push({
          id: i,
          name: `Item ${i}`,
          price: `$${i}`
        })
      }
      if (search) {
        rows = rows.filter(item => item.name.includes(search))
      }
      if (Object.keys(filter).length) {
        for (const [key, value] of Object.entries(filter)) {
          rows = rows.filter(item => item[key].includes(value))
        }
      }
      if (['id', 'name', 'price'].includes(name)) {
        rows = rows.sort((a, b) => {
          let c = a[name]
          let d = b[name]

          if (name === 'price') {
            c = +c.substring(1)
            d = +d.substring(1)
          }
          if (c < d) {
            return order === 'asc' ? -1 : 1
          }
          if (c > d) {
            return order === 'asc' ? 1 : -1
          }
          return 0
        })
      }

      if (max > rows.length) {
        max = rows.length
      }

      result.total = rows.length
      if (max === 0) {
        result.rows = rows
      } else {
        for (i = offset; i < max; i++) {
          result.rows.push(rows[i])
        }
      }
      setTimeout(() => {
        res.json(result)
      }, sleep * 1000)
    },
    qs(req, res) {
      const pageNumber = +req.query.pageNumber || 1
      const pageSize = +req.query.pageSize || 20
      const offset = (pageNumber - 1) * pageSize
      const limit = pageSize
      const cols = +req.query.cols || 10
      const total = req.query.total || 800
      const sleep = req.query.sleep || 0.01
      const data = []

      for (let i = offset, max = Math.min(offset + limit, total); i < max; i++) {
        const row = {}
        for (let j = 0; j < cols; j++) {
          row['field' + j] = 'Row-' + i + '-' + j
        }
        data.push(row)
      }
      setTimeout(() => {
        res.json({
          total,
          rows: data
        })
      }, sleep)
    }
  }
}

module.exports = (req, res) => {
  projects[req.params.project][req.params.func](req, res)
}
