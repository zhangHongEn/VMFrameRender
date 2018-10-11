import {throttle} from '../../plugins/util'

/**
 * 节流
 * @param {*} cb 
 */
const _nextFrame = throttle(function (cb = function(){}) {
  cb()
}, 16.666)

/**
 * 一个vm对应一个VMFrameRender
 */
export default class VMFrameRender {

  constructor (vm) {
    /**
     * 小程序的page或者component实例
     */
    this.vm = vm
    
    this.setDataObj = {
      /**
       * 多次setData合起来的数据
       */
      data: {},
      /**
       * 每次调用setData的callback
       */
      cbs: []
    }
    
    /**
     * vm的setData方法
     */
    this.vmSetData = this.vm.setData

    this._VMMountSetData()

  }

  /**
   * 在vm上挂载一个$setData方法
   */
  _VMMountSetData () {
    
    this.vm.$setData = (...params) => {
      this.addSetData(...params)
    }
  }

  // /**
  //  * {
  //  *  [vm]: {
  //  *    [key]: value,
  //  *    ...
  //  *  }
  //  * }
  //  */
  // vmMap = null

  /**
   * 添加一个setData
   * @param {*} appVm 
   * @param {*} setDataObj 
   */
  addSetData (setDataObj = {}, cb) {
    Object.keys(setDataObj).forEach(key => {
      let value = setDataObj[key]
      this.replaceRepeatKey(key, value)
    })
    if (typeof cb === 'function') {
      this.setDataObj.cbs.push(cb)
    }
    
    _nextFrame(() => {
      this.setData()
    })
  }

  /**
   * 替换重复修改的key
   * 1. setDataObj = {}
   *    replaceRepeatKey(setDataObj, 'person.name', 'name')
   *    setDataObj -> {'person.name': 'name'}
   * 2. replaceRepeatKey(setDataObj, 'person', {})
   *    setDataObj -> {'person': {}}
   * @param {*} setDataObj 
   * @param {*} key 
   * @param {*} value 
   */
  replaceRepeatKey (key = '', value) {
    let setDataObj = this.setDataObj.data

    let repeatKey = Object.keys(setDataObj).find(_key => _key.startsWith(key))
    if (repeatKey) {
      delete setDataObj[repeatKey]
    }
    setDataObj[key] = value
  }

  /**
   * 调用vm的setData, 使用this.setDataObj.data, 并清空setDataObj
   */
  setData () {
    let setDataObj = this.setDataObj
    this.vm.setData(setDataObj.data, () => {
      setDataObj.cbs.forEach(cb => {
        cb.apply(this.vm)
      })
    })
    this.setDataObj = {
      data: {},
      cbs: []
    }
  }


}