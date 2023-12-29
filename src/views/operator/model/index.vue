<template>
  <!--  <el-button type="primary" style="margin: 20px" @click="updateModel">{{ model }}</el-button>-->
  <div class="model">
    <div class="shape">
      <div class="outer-border">
        <div class="inner-border" @click="updateModel">
          <div class="copy">
            <h2>运行模式</h2>
            <h1>{{ model }}</h1>
            <h2>点击修改</h2>
          </div>
        </div>
      </div>
    </div>

    <div v-hasPermi="['system:model:refresh']" class="shape">
      <div class="outer-border">
        <div class="inner-border" @click="updateRefresh">
          <div class="copy">
            <h1>刷新看板</h1>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { model, updateModel, updateRefresh } from '@/api/system/model'
export default {
  name: 'Model',
  data() {
    return {
      model: undefined
    }
  },
  created() {
    this.getModel()
  },
  methods: {
    // 查询运行模式
    getModel() {
      model().then(res => {
        this.model = res.data
      })
    },
    // 修改运行模式
    updateModel() {
      updateModel().then(res => {
        this.model = res.data
      })
    },
    updateRefresh() {
      updateRefresh().then(res => {
        this.msgSuccess(res.msg)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.model{
  height: calc(100vh - 102px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.shape {
  display: table-cell;
  vertical-align: middle;
  margin-right: 100px;
}
.outer-border {
  width: 500px;
  height: 500px;
  cursor: pointer;
  position: relative;
  margin: 0 auto;
  background-color: #FFF;
  -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
.outer-border:before {
  content: "";
  display: block;
  width: 496px;
  height: 496px;
  background-color: #333;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
.outer-border:after {
  content: "";
  display: block;
  width: 476px;
  height: 476px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background-color: #FFF;
}
.inner-border {
  width: 452px;
  height: 452px;
  position: absolute;
  display: table;
  text-align: center;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 2;
  background-color: rgba(51,51,51,1);
  -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
.outer-border:hover {
  //&:before {
  //   background-color: rgba(51,51,51,.9);
  // }
  .inner-border {
    background-color: rgba(51,51,51,.9);
  }
}
.copy {
  display: table-cell;
  vertical-align: middle;
  font-family: 'Nunito';
  color: #fff;
}
h1 {
  font-family: 'Oswald';
  font-weight: normal;
  letter-spacing: -2px;
  font-size: 56px;
}
h2 {
  font-weight: 300;
  font-size: 24px;
  margin: 0.5em;
}
</style>
