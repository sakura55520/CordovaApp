/* eslint-disable */
import { Message, Loading } from 'element-ui'

let loadingUpdate;
window.addEventListener('load', () => {
    // 开始检测更新
    setTimeout(() => {
        try {
            let chcp = window.chcp;
            if (typeof chcp === 'undefined') return
            loadingUpdate = Loading.service({ background: "rgba(0, 0, 0, 0.8)", text: "正在检测新版本..." })
            // 检测更新
            chcp.fetchUpdate((error, data) => {
                // 表示没有更新版本，或者其他错误，详情的信息参考上面的chcp error链接
                if (error) {
                    if (error.code == 2 || error.code == 1) {
                        Message({ message: "当前为最新版本", type: 'success', duration: 5 * 1000 })
                    } else {
                        Message({ message: "新版本检测出错：【" + error.code + "】" + error.description, type: 'error', duration: 5 * 1000 })
                        console.log('--fetchUpdate error--', error.code, error.description);
                    }
                    loadingUpdate.close();
                    return;
                }
                loadingUpdate.close();
                // 这次更新的版本信息
                console.log('--fetchUpdate--', data, data.config);
                // 检测是否是否可以进行安装了，双重判断吧，有时候会出现有更新版本但是暂时无法安装的情况（也可以去掉这一层）
                chcp.isUpdateAvailableForInstallation((error, data) => {
                    if (error) {
                        console.log('No update was loaded => nothing to install');
                    } else {
                        // 询问用户是否更新
                        if (window.confirm('检测到新版本，是否更新')) {
                            // 更新中
                            loadingUpdate = Loading.service({ background: "rgba(0, 0, 0, 0.8)", text: "正在努力更新中..." })
                            chcp.installUpdate((error) => {
                                if (error) {
                                    // 更新失败
                                    console.log('Failed to install the update with error code: ' + error.code);
                                    console.log(error.description);
                                    window.alert('更新失败');
                                } else {
                                    // 更新成功
                                    window.alert('更新成功');
                                }
                                loadingUpdate.close();
                            });
                        } else {
                            window.alert('您已拒绝更新');
                        }

                        // 对比版本号
                        console.log('Current content version: ' + data.currentVersion);
                        console.log('Ready to be installed:' + data.readyToInstallVersion);
                    }

                });
            });
        } catch (error) {
            console.log("update catch error:", error)
            loadingUpdate && loadingUpdate.close();
        }
    }, 100);
})
