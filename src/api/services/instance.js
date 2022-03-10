import axios from "axios"
import { Message, Loading } from "element-ui"

const url = "https://restapi.amap.com/v3/weather"

// 创建axios实例
let instance = axios.create({
    time: 1000 * 60,
    baseURL: url
})

let loadingInstance

instance.interceptors.request.use(
    config => {
        loadingInstance = Loading.service({
            text: "拼命加载中~"
        })
        return config
    },
    error => {
        loadingInstance.close()
        Message.error({ message: "请求超时！" })
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response => {
        loadingInstance.close()
        // 对数据做预处理/格式化
        let forecasts = response.data.forecasts[0]
        const data = {
            city: forecasts.city,
            reporttime: forecasts.reporttime,
            casts: forecasts.casts,
            today: forecasts.casts[0]
        }

        let status = response.status
        if (status === 200) {
            return data
        } else {
            Message.error({ message: "服务器好像出了些问题~" })
            return Promise.reject(response)
        }
    },
    error => {}
)

export default instance
