import { request } from './request'
import Qs from 'qs'

export function getUserDesignatedTasks(params) {
  return request({
    url: '/DesignatedTasks/getUserDesignatedTasks',
    method: 'GET',
    params,
  })
}
export function getCompleteDesignatedTasks(params) {
  return request({
    url: '/DesignatedTasks/getCompleteDesignatedTasks',
    method: 'GET',
    params,
  })
}
export function getDesignatedTasks(params) {
  return request({
    url: '/DesignatedTasks/getDesignatedTasks',
    method: 'GET',
    params,
  })
}
export function getAddDesignatedTasks(params) {
  return request({
    url: '/DesignatedTasks/getAddDesignatedTasks',
    method: 'GET',
    params,
  })
}
export function getUserIndex(params) {
  return request({
    url: '/Index/index',
    method: 'GET',
    params,
  })
}

export function addDesignatedTasks(data) {
  return request({
    url: '/DesignatedTasks/addDesignatedTasks',
    method: 'POST',
    data: Qs.stringify(data),
  })
}
export function uploadImage(data) {
  return request({
    url: '/materiel/uploadImage2',
    method: 'POST',
    data,
  })
}
export function editUser(data) {
  return request({
    url: '/login/editUser',
    method: 'POST',
    data,
  })
}
export function getCompleteOrderProduct(params) {
  return request({
    url: '/DeliverGoods/getCompleteOrderProduct',
    method: 'GET',
    params,
  })
}
export function changeProductStatus(params) {
  return request({
    url: '/DeliverGoods/changeProductStatus',
    method: 'GET',
    params,
  })
}
export function deleteDesignatedTasks(data) {
  return request({
    url: '/DesignatedTasks/deleteDesignatedTasks',
    method: 'POST',
    data: Qs.stringify(data),
  })
}
export function getEditDesignatedTasks(params) {
  return request({
    url: '/DesignatedTasks/getEditDesignatedTasks',
    method: 'GET',
    params,
  })
}
export function editDesignatedTasks(data) {
  return request({
    url: '/DesignatedTasks/editDesignatedTasks',
    method: 'POST',
    data: Qs.stringify(data),
  })
}
export function getAddUserValuationWages(params) {
  return request({
    url: '/Wages/getAddUserValuationWages',
    method: 'GET',
    params,
  })
}

export function addUserValuationWages(data) {
  return request({
    url: '/Wages/addUserValuationWages',
    method: 'POST',
    data: Qs.stringify(data),
  })
}

export function getUserValuationWagesList(params) {
  return request({
    url: '/Wages/getUserValuationWagesList',
    method: 'GET',
    params,
  })
}

export function getProcessPieceWorkWagesList(params) {
  return request({
    url: '/Wages/getProcessPieceWorkWagesList',
    method: 'GET',
    params,
  })
}

export function getAddProcessPieceWorkWages(params) {
  return request({
    url: '/Wages/getAddProcessPieceWorkWages',
    method: 'GET',
    params,
  })
}

export function addProcessPieceWorkWages(data) {
  return request({
    url: '/Wages/addProcessPieceWorkWages',
    method: 'POST',
    data: Qs.stringify(data),
  })
}

export function getProcessPieceWorkWagesMoney(params) {
  return request({
    url: '/Wages/getProcessPieceWorkWagesMoney',
    method: 'GET',
    params,
  })
}

export function getSimplePieceWorkWagesList(params) {
  return request({
    url: '/Wages/getSimplePieceWorkWagesList',
    method: 'GET',
    params,
  })
}

export function addSimplePieceWorkWages(data) {
  return request({
    url: '/Wages/addSimplePieceWorkWages',
    method: 'POST',
    data: Qs.stringify(data),
  })
}

export function getMySimplePieceWorkWagesList(params) {
  return request({
    url: '/Wages/getMySimplePieceWorkWagesList',
    method: 'GET',
    params,
  })
}

export function getMyValuationWagesList(params) {
  return request({
    url: '/Wages/getMyValuationWagesList',
    method: 'GET',
    params,
  })
}

export function getMyProcessPieceWorkWagesList(params) {
  return request({
    url: '/Wages/getMyProcessPieceWorkWagesList',
    method: 'GET',
    params,
  })
}

export function getMonthWagesList(params) {
  return request({
    url: '/Wages/getMonthWagesList',
    method: 'GET',
    params,
  })
}

export function delMonthWages(data) {
  return request({
    url: '/Wages/delMonthWages',
    method: 'POST',
    data: Qs.stringify(data),
  })
}

export function toExamine(data) {
  return request({
    url: '/Wages/toExamine',
    method: 'POST',
    data: Qs.stringify(data),
  })
}

export function cacnelToExamine(data) {
  return request({
    url: '/Wages/cacnelToExamine',
    method: 'POST',
    data: Qs.stringify(data),
  })
}

export function addMonthWages(data) {
  return request({
    url: '/Wages/addMonthWages',
    method: 'POST',
    data: Qs.stringify(data),
  })
}
