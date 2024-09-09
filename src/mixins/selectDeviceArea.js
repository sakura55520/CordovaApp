export default {
  data() {
    return {
      is_show_mask: false,
      box_screen_left: 0,
      box_screen_top: 0,
      box_screen_width: 0,
      box_screen_height: 0,
      start_x: 0,
      start_y: 0,
      end_x: 0,
      end_y: 0,
      boxRef: null,
      idRAF: 0,
      calc_style: {
        transform: 'scale(0, 0)'
      }
    }
  },
  computed: {
    mask_width() {
      return `${Math.abs(this.end_x - this.start_x)}px`
    },
    mask_height() {
      return `${Math.abs(this.end_y - this.start_y)}px`
    },
    mask_left() {
      return `${Math.min(this.start_x, this.end_x) - this.box_screen_left}px`
    },
    mask_top() {
      return `${Math.min(this.start_y, this.end_y) - this.box_screen_top}px`
    }
  },
  methods: {
    handleMouseDown(event) {
      event.stopPropagation()
      this.boxRef = this.$refs['select-area-box']
      if (!this.boxRef) {
        return new Error('缺少refs[\'select-area-box\']')
      }
      this.calc_style = {
        transform: 'scale(0, 0)'
      }
      this.resSetXY()
      const { left, top, width, height } = this.boxRef.getBoundingClientRect()
      // console.log('left, top, width, height', left, top, width, height)
      this.box_screen_left = left
      this.box_screen_top = top
      this.box_screen_width = width
      this.box_screen_height = height
      this.is_show_mask = true
      this.start_x = event.clientX
      this.start_y = event.clientY
      this.end_x = event.clientX
      this.end_y = event.clientY
      this.boxRef.addEventListener('mousemove', this.handleMouseMove)
      this.boxRef.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseMove(event) {
      event.stopPropagation()
      window.cancelAnimationFrame(this.idRAF)
      this.idRAF = window.requestAnimationFrame(() => {
        this.end_x = event.clientX
        this.end_y = event.clientY
        const left = this.mask_left
        const top = this.mask_top
        if (this.start_x === this.end_x || this.start_y === this.end_y || parseFloat(left) < 0 || parseFloat(top) < 0) {
          this.calc_style = {
            transform: 'scale(0, 0)'
          }
          return
        }
        const scaleX = parseFloat(this.mask_width) / this.box_screen_width
        const scaleY = parseFloat(this.mask_height) / this.box_screen_height
        this.calc_style = {
          transform: `translate3d(${left},${top},0) scale(${scaleX},${scaleY})`
        }
      })
    },
    handleMouseUp(event) {
      event.stopPropagation()
      this.boxRef.removeEventListener('mousemove', this.handleMouseMove)
      this.boxRef.removeEventListener('mouseup', this.handleMouseUp)
      this.is_show_mask = false
      this.calc_style = {
        transform: 'scale(0, 0)'
      }
      this.handleDomSelect()
      this.resSetXY()
      this.boxRef = null
    },
    handleDomSelect() {
      const dom_mask = this.boxRef.querySelector('.select-area-mask')
      const rect_select = dom_mask.getClientRects()[0]
      const add_list = []
      const del_list = []
      this.boxRef
        .querySelectorAll('.el-checkbox-group .el-checkbox')
        .forEach((node, index) => {
          const rects = node.getClientRects()[0]
          if (this.collide(rects, rect_select)) {
            const id = Number(node.dataset.id)
            if (this.arrCheckedDeviceIds.includes(id)) {
              del_list.push(id)
            } else {
              add_list.push(id)
            }
          }
        })
      this.arrCheckedDeviceIds = this.arrCheckedDeviceIds
        .concat(add_list)
        .filter((item) => !del_list.includes(item))
    },
    collide(rect1, rect2) {
      const maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width)
      const maxY = Math.max(
        rect1.y + rect1.height,
        rect2.y + rect2.height,
      )
      const minX = Math.min(rect1.x, rect2.x)
      const minY = Math.min(rect1.y, rect2.y)
      if (
        maxX - minX <= rect1.width + rect2.width &&
        maxY - minY <= rect1.height + rect2.height &&
        !(
          rect1.x <= rect2.x &&
          rect1.x + rect1.width >= rect2.x + rect2.width &&
          rect1.y <= rect2.y &&
          rect1.y + rect1.height >= rect2.y + rect2.height
        )
      ) {
        return true
      } else {
        return false
      }
    },
    resSetXY() {
      this.start_x = 0
      this.start_y = 0
      this.end_x = 0
      this.end_y = 0
      this.box_screen_left = 0
      this.box_screen_top = 0
    }
  }
}
