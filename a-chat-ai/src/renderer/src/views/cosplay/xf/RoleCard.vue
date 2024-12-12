<script setup>
// 六芒星的 Unicode
// 定义 clipPath，初始值为空
import {Plus} from "@element-plus/icons-vue";

const clipPath = ref('');
function generateRandomClipPath() {
  const numberOfTeeth = Math.floor(Math.random() * 6) + 4; // 随机锯齿数量（至少4个，最多10个）
  let points = ['0% 0%', '80% 0%']; // 顶部两个固定点

  // 随机生成底部锯齿
  for (let i = 0; i < numberOfTeeth; i++) {
    let x = Math.random() * 100; // 随机生成 x 坐标
    let y = 100 - Math.random() * 20; // 随机生成 y 坐标，底部有变化
    points.push(`${x}% ${y}%`);
  }

  // 添加底部闭合点
  points.push('0% 100%');

  // 形成最终的 clip-path 字符串
  return `polygon(${points.join(', ')})`;
}

// 在组件挂载时生成随机 clip-path
onMounted(() => {
  clipPath.value = generateRandomClipPath();
});


import {onMounted, ref, watch} from "vue";

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: {}
  }
});

watch(() => props.data, (b) => {
  console.log(b);
});
</script>

<template>
  <div v-if="type === 'empty'" class="card-box">
    <div>
      <el-skeleton style="--el-skeleton-circle-size: 50px">
        <template #template>
          <el-skeleton-item variant="circle"></el-skeleton-item>
        </template>
      </el-skeleton>
      <span style="font-size: 16px; font-weight: 600; margin-bottom: 10px ;margin-top: 10px">{{ data.title }}</span>
      <el-skeleton></el-skeleton>
    </div>
  </div>


    <div v-if="type === 'role'" class="role-card" :style="{ backgroundImage: 'url(' + data.playerAvatar + ')' }">
     <div v-if="Object.keys(data).length === 0" class="background-overlay-add">
       <el-icon class="create-icon"><Plus /></el-icon>
     </div>
      <div v-else class="background-overlay">
      <el-row >
        <el-col>
          <el-row>
            <el-col :span="3" style="margin-top: 20px">
              <el-avatar :size="50" :src="data.playerAvatar" class="role-avatar"></el-avatar>
            </el-col>
            <el-col :span="15" :offset="6">
              <el-row>
                <el-col>
                  <div class="role-info">
                    <span class="role-name">{{ data.playerName }}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div class="role-info">
                    <span class="role-type">【类】{{ data.playerType }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="role-description">
                <div>【类别描述】{{ data.description}}</div>
                <el-divider style="padding:0;margin:0" border-style="dashed" />
                <div class="identity">【{{ data.senderIdentity }}】</div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
     </div>
   </div>
  <div v-if="type === 'simCard'">
      <div class="card-box-sim">
          <el-row>
             <el-col>
                <el-avatar size="large" :src="data.agentAvatar"></el-avatar>
             </el-col>
          </el-row>
          <el-row>
              <el-col>
                 <span style="font-weight: bold;font-size: 20px">{{data.agentName}}</span>
              </el-col>
          </el-row>
          <el-row style="margin-top: 12px;">
             <el-col>
                <span style="font-size: 14px">{{data.agentIdentity}}</span>
             </el-col>
          </el-row>
      </div>
  </div>
  <div v-if="type=== 'simCard-add'">
    <div class="card-box-sim-add">
      <el-icon class="create-icon-add"><Plus /></el-icon>
    </div>
  </div>
</template>

<style scoped>
.create-icon{
    position: absolute;
    top: 39%;
    left: 39%;
    color: #fff;
    font-size: 40px;
}

.create-icon-add{
    top: 35%;
    left: 43%;
    color: #fff;
    font-size: 50px;
}

.card-box {
  background-image: linear-gradient(135deg, #4f4f4f 25%, #2f2f2f 25%, #3b3b3b 50%, #7e7e7e 50%, #f7f8fa 75%, #d9dbde 75%);
  max-width: 400px;
  max-height: 300px;
  min-width: 350px;
  padding: 10px;
  border: 2px solid #0a0a0a;
  border-radius: 10px;
}

.card-box:hover {
  background-image: linear-gradient(135deg, #797979 25%, #bebebe 25%, #3d3d3d 50%, #3a3a3a 50%, #f7f8fa 75%, #d9dbde 75%);
  cursor: pointer;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, .3);
  transition: all .2s;
  transform: scale(1.05);
  border: 2px solid #54ece0;
  border-radius: 10px;
}


.card-box-sim {
  background-image: linear-gradient(135deg, #4f4f4f 25%, #2f2f2f 25%, #3b3b3b 50%, #7e7e7e 50%,  #2f2f2f 75%, #4f4f4f 85%);
  width: 400px;
  height: 200px;
  padding: 10px;
  border: 2px solid #0a0a0a;
  border-radius: 10px;
}
.card-box-sim-add {
  background-color: #4f4f4f;
  width: 400px;
  height: 200px;
  padding: 10px;
  border: 2px solid #0a0a0a;
  border-radius: 10px;
}

.card-box-sim:hover {
  background-image: linear-gradient(135deg, #797979 25%, #545454 25%, #3d3d3d 50%, #3a3a3a 50%, #3a3a3a 75%, #d9dbde 95%);
  cursor: pointer;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, .3);
  transition: all .2s;
  transform: scale(1.05);
  border: 2px solid #54ece0;
  border-radius: 10px;
}
.card-box-sim-add:hover {
  background-color: #4f4f4f;
  cursor: pointer;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, .3);
  border: 2px solid #54ece0;
  border-radius: 10px;
}


.background-overlay-add{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(8px); /* 兼容Safari */
}
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(8px); /* 兼容Safari */
}

.role-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.background-overlay::before {
  content: '\272F';  /* Unicode 六芒星 */
  font-size: 40px;   /* 控制六芒星的大小 */
  color: white;      /* 设置六芒星的颜色 */
  background: linear-gradient(to right, #684170 0%, #554186 100%);
  position: absolute;
  top: 0;
  right: 0;
  width: 25%;
  height: 65%;
  clip-path: polygon(10% 0%, 90% 0%, 90% 30%, 100% 30%, 90% 40%, 100% 50%, 100% 60%, 90% 70%, 100% 85%, 0% 90%);  /* 旗帜底部锯齿状 */
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;  /* 使六芒星更突出 */
}

.role-avatar {
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.role-info {
  margin-top: 10px;
}

.role-name {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
}

.role-type {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.role-description {
  border-left: 5px solid rgba(255, 255, 255, 0.3);
  border-right: 5px solid rgba(255, 255, 255, 0.3);
  padding: 10px;
  margin-top: 25px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.identity {
  margin-top: 10px;
  font-style: italic;
  color: #d9dbde;
}
</style>
