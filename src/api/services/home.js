import api from "./instance"

export const getCityWeather = city => api.get(`/weatherInfo?city=${ city }&key=5bf889bb83f7cddf30607dd513192679&extensions=all`)