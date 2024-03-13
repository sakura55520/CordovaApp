<script>
import draggable from 'vuedraggable'
import render from './render'
import renderPDA from './renderPDA'


const layouts = {
  colFormItem(h, element, index, parent,formObj,params) {
    let className = this.activeId === element.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    return (
      <el-col span={element.span} class={className}>
        <el-form-item label-width={element.labelWidt ? `${element.labelWid}px` : '100px' }
          label={element.label} prop={element.vModel}>
          {
            !element.ComponentsType 
            ? 
            <render key={element.renderKey} conf={element} formObj={formObj} onInput={ event => {
              this.$set(element, 'value', event)
              this.$set(formObj, element.vModel, event)
            }} />
            :
            <renderPDA componentData = { element } isGetData = { true } formObj={formObj} params = { params }/>
          }
        </el-form-item>
      </el-col>
    )
  },
  rowFormItem(h, element, index, parent) {
    const className = this.activeId === element.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (element.type === 'flex') {
      child = <el-row type={element.type} justify={element.justify} align={element.align}>
              {child}
            </el-row>
    }
    return (
      <el-col span={element.span}>
        <el-row gutter={element.gutter} class={className}>
          <span class="component-name">{element.componentName}</span>
          <draggable list={element.children} animation={340} group="componentsGroup" class="drag-wrapper">
            {child}
          </draggable>
        </el-row>
      </el-col>
    )
  }
}

function renderChildren(h, element, index, parent) {
  if (!Array.isArray(element.children)) return null
  return element.children.map((el, i) => {
    const layout = layouts[el.layout]
    if (layout) {
      return layout.call(this, h, el, i, element.children)
    }
    return layoutIsNotFound()
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.element.layout}匹配的layout`)
}

export default {
  components: {
    render,
    renderPDA,
    draggable
  },
  props: [
    'element',
    'index',
    'drawingList',
    'activeId',
    'formConf',
    'operateType',
    'formObj',
    'params'
  ],
  render(h) {
    const layout = layouts[this.element.layout]
    if (layout) {
      return layout.call(this, h, this.element, this.index, this.drawingList,this.formObj,this.params)
    }
    return layoutIsNotFound()
  }
}
</script>
