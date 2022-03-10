<template>
  <div class="home" :style="{ backgroundImage: 'url(' + coverImgUrl + ')'}">
    <div class="weather-box">
      <el-cascader 
        size="medium"
        separator=">"
        :options="options"
        placeholder="请选择/搜索"
        v-model="selectedOptions"
        :props="{ expandTrigger: 'hover' }"
        filterable
        @change="selectCity"
      />
      <div class="now-cond" v-if="Object.keys(weathData).length">
        <p class="address">
          <i class="el-icon-place" />{{ this.weathData.city }}
        </p>
        <p class="upTime">{{ this.weathData.reporttime }}</p>
        <i class="condTxt">{{ this.weathData.today.dayweather }}</i>
        <p class="wind">{{ this.weathData.today.nightwind }}风</p>
        <p class="tmp">
          {{ this.weathData.today.nighttemp }}℃~
          {{ this.weathData.today.daytemp }}℃
        </p>
        <h1>未来3日天气预报</h1>
        <el-table
        :data="weathData.casts"
          border
          style="width: 100%"
          stripe
        >
          <el-table-column label="日期" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px"> {{ scope.row.date }} </span>
            </template>
          </el-table-column>
          <el-table-column prop="dayweather" label="天气" />
          <el-table-column prop="nighttemp" label="最低温度(℃)" width="120"/>  
          <el-table-column prop="daytemp" label="最高温度(℃)" width="120"/>
          <el-table-column prop="daywind" label="风向" />
        </el-table>
      </div>
      <div class="tip" v-else>
        <h1>选择城市开始查询吧</h1>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

// 城市选择
import { regionData, CodeToText } from "element-china-area-data";

export default {
  name: 'Home',
  data() {
    return {
      coverImgUrl: require("@/assets/img/bg.jpg"),
      selectedOptions: [],
      addressAll: [],
      weathData: {},
      address: "",
      options: regionData
    }
  },
  methods: {
    selectCity() {
      this.addressAll = []
      this.selectedOptions.forEach(city => {
        this.addressAll.push(CodeToText[city])
      })
      this.inquireWeather()
    },
    async inquireWeather() {
      if (this.addressAll[2] == "市辖区" || this.addressAll.length == 2) { // 针对香港澳门
        this.address = this.addressAll[1] // 如果选市辖区就定位到二级地址 
      } else {
        this.address = this.addressAll[2] // 区域码所对应的属性值即中文地址
      }
      // 开始请求接口
      const res1 = await this.$api.getCityWeather(this.address)
      this.weathData = res1

      this.$notify({
        title: "查询成功",
        type: "success"
      })
      
      this.bgChange()
    },
    bgChange() {
      this.coverImgUrl = require(`@/assets/img/${ this.weathData.today.dayweather }.jpg`)
    }
  }
}
</script>

<style lang="scss" scoped>
  @mixin font($size, $fw: bold, $color: #fff) {
    font-size: $size;
    font-weight: $fw;
    color: $color;
  }

.home {
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  .weather-box {
    position: absolute;
    text-align: center;
    z-index: 999;
    top: 5%;
    left: 50%;
    transform: translateX(-50%);
  }
  .weather-box {
    width: 800px;
  }
  .now-cond {
    h1 {
      font-size: 20px;
      color: #fff;
      font-weight: bold;
    }
    .address, 
    .upTime {
      @include font(20px);
      text-shadow: 5px 5px 5px rgba(0, 0, 0, .5)
    }

    .condTxt {
      @include font(80px, bolder);
      text-shadow: 5px 5px 5px #ccc;
    }

    .wind,
    .tmp {
      @include font(20px, bolder, #000);
      text-shadow: 2px 2px 5px rgb(144, 149, 216)
    }
  }
}
.tip {
  font-size: 30px;
  font-weight: bolder;
  color: #fff;
  text-shadow: 2px 2px 5px rgb(144, 149, 216)
}
</style>