import request from '@/utils/request'


/**
 * 备份文件
 * @param data
 * @returns {*}
 */
export function backupCreate(data) {
    return request({
        url: '/file/backup/create',
        method: 'post',
        headers: {
            bucketId: data.bucketId,
        },
        data
    })
}


/**
 * 删除文件
 * @param data
 * @returns {*}
 */
export function backupDelete(data) {
    return request({
        url: '/file/backup/delete',
        method: 'post',
        headers: {
            bucketId: data.bucketId,
        },
        data
    })
}


/**
 * 删除文件
 * @param data
 * @returns {*}
 */
export function backupRecover(data) {
    return request({
        url: '/file/backup/recover',
        method: 'post',
        headers: {
            bucketId: data.bucketId,
        },
        data
    })
}