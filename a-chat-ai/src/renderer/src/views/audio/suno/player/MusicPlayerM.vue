
<template>
  <div class="main-page">
    <audio :src="songInfo.url" id="music" autoplay="autoplay"></audio>
    <div
      class="background-flitter"
      :style="`background-image: url(${songInfo.cover})`"
    ></div>
    <div class="play-mini">
      <div class="progress-bar" @click="handleProgressClick" ref="track">
        <div
          class="progress-box"
          :style="{ width: audioProgressPercent }"
        ></div>
      </div>
      <div class="songInfo">
        <img class="poster" :src="songInfo.cover" alt="" />
        <!-- 歌名、歌手名 -->
        <div class="info">
          <p style="font-weight: 600; color: #fff;">{{ songInfo.name }}</p>
          <p style="font-size: 14px; color: #fff">{{ songInfo.artistsName }}</p>
        </div>
      </div>


      <div class="controls">
        <!-- 上一首提示 -->
        <Tooltip content="上一首" theme="light" :delay="1500">
          <svg
            style="fill: currentColor;cursor: pointer ;overflow: hidden; width: 1.5em; height: 1.5em;"
            aria-hidden="true"
            @click="skipBack"
          >
            <use :xlink:href="`#icon-xiayishou-copy-copy-copy`"></use>
          </svg>
        </Tooltip>
        <!-- 播放暂停 -->
        <Tooltip content="播放暂停" theme="light" :delay="1500">
          <img
            @click="playMusic"
            class="status"
            v-show="!playing"
            src="../../../../assets/img/puse2.png"
            alt=""
          />
          <img
            class="status"
            @click="playMusic"
            v-show="playing"
            src="../../../../assets/img/puse.png"
            alt=""
          />
        </Tooltip>
        <!-- 下一首提示 -->
        <Tooltip content="下一首" theme="light" :delay="1500">
          <svg
            style="fill: currentColor;cursor: pointer ;overflow: hidden; width: 1.5em; height: 1.5em;"
            aria-hidden="true"
            @click="skipForward"
          >
            <use :xlink:href="`#icon-xiayishou-copy-copy`"></use>
          </svg>
        </Tooltip>
      </div>
      <div class="right-botton">
        <div class="text-div"></div>
        <!-- 音量 -->
          <svg
            style="fill: currentColor;cursor: pointer ;overflow: hidden; width: 1.5em; height: 1.5em;"
            aria-hidden="true"
            @click="volumeChange"
          >
            <use :xlink:href="`#${volumeType}`"></use>
          </svg>
        <div class="text-div"></div>
        <el-slider
          style="width: 80px; z-index: 99999"
          @change="changeVolum"
          v-model="volume"
        ></el-slider>
        <div class="text-div"></div>
        <div class="text-div"></div>
        <div class="text-div"></div>
        <!-- 歌曲播放类型 -->
        <Tooltip :content="showPlayType" theme="light" :delay="1500">
          <svg
            style="fill: currentColor;cursor: pointer ;overflow: hidden; width: 1.5em; height: 1.5em;"
            aria-hidden="true"
            @click="playTypeChange"
          >
            <use :xlink:href="`#${playStatus}`"></use>
          </svg>
        </Tooltip>
        <div class="text-div"></div>
        <div class="text-div"></div>
        <div class="playlist">
          <!-- 播放列表 -->
          <Tooltip content="列表" theme="light" :delay="1500">
            <svg
              style="fill: currentColor;cursor: pointer ;overflow: hidden; width: 1.5em; height: 1.5em;"
              aria-hidden="true"
              @click="drawer = true"
            >
              <use :xlink:href="`#icon-liebiao601`"></use>
            </svg>
          </Tooltip>
        </div>
      </div>
    </div>
    <div class="song-cover-lyric">
      <div class="disc-continer">
        <div class="poster" ref="rotate">
          <img :src="songInfo.cover" alt="" />
        </div>
        <div class="song-name">{{ songInfo.name }}</div>
        <div class="song-artistsName">{{ songInfo.artistsName }}</div>
      </div>
      <div class="lyric">
        <mscroll
          ref="lyric"
          :color="color"
          :colorLight="colorLight"
          :lineHeight="lineHeight"
          :paddingTop="paddingTop"
          :fontSize="fontSize"
          :lyricIndex="lyricIndex"
          :lyricsList="lyricInfo"
        ></mscroll>
      </div>
    </div>
    <el-drawer
      v-model="drawer"
      title="播放列表"
      :visible.sync="drawer"
      direction="rtl"
      :size="'25%'"
      :show-close="false"
    >
      <div class="song-list-rtl">
        <el-row
          v-for="(item, index) in songList"
          :key="index"
          @click="PlayListMusic(index)"
          style="margin-bottom: 60px; align-items: center;border-bottom: 1px solid #575757;cursor: pointer"
        >
          <el-col :span="7">
            <el-image
              fit="cover"
              :src="item.cover"
              style="border-radius: 5px; width: 60px; height: 60px;"
            ></el-image>
          </el-col>
          <el-col :span="15">
            <el-row>
              <div style="font-weight: bold; font-size: 14px;">歌曲名：{{ item.name }}</div>
            </el-row>
            <el-row style="margin-top: 25px;">
              <div style="color: #666; font-size: 12px;">作者：{{ item.artistsName }}</div>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import Message from '../../../../utils/Message'
import Mscroll from "./lyricScroll.vue";
import {TimeToString, TimeToSeconds } from './timeConversion'
import axios from "axios";
export default {
  data() {
    return {
      volumeNum: 80, //暂存的音量
      volumeStatus: true, //音量图标的变化
      volumeType: "icon-yinliang", //音量图标
      playStatus: "icon-liebiaoxunhuan", //播放类型图标
      playing: false,
      drawer: false,
      playIndex: 0,
      songInfo: {},
      songList: [],
      volume: 80, // 音量
      lyricInfo: [],
      playType: 1, // 播放类型：1-列表循环，2-随机播放，3-单曲循环
      showPlayType: "列表循环",
      audioProgress: 0,
      thumbTranslateX: 0,
      lyricIndex: 0,
      color: "#fff", //歌词默认颜色
      colorLight: "#40ce8f", //歌词高亮色
      fontSize: "16px", //歌词字体大小
      lineHeight: "42", //每段行高
      paddingTop: "300px", //高亮歌词部分居中
    };
  },
  props:{
    songListProps: {
       type: Array,
       default: () => []
    },
    songInfoProps: {
       type: Object,
       default: () => {}
    },
    lyricInfoProps: {
       type: Array,
       default: () => []
    }
  },
  created() {},
  components: {
    Mscroll,
  },
  computed: {
    audioProgressPercent() {
      return `${this.audioProgress * 100}%`;
    },
  },
  mounted() {
    const music = document.getElementById("music");
    if (this.$route.query.play) {
      this.ClickPlay();
    } else {
      this.GetSongList();
    }

    if (this.playing) {
      // 播放中,点击则为暂停
      this.playing = false;
      this.$refs.rotate.style.animationPlayState = "paused";
      music.pause();
    } else {
      // 暂停中,点击则为播放
      this.playing = true;
      this.$refs.rotate.style.animationPlayState = "running";
      music.play();
    }
  },
  methods: {
    //音量变化
    volumeChange() {
      if (this.volumeStatus) {
        this.volumeStatus = false;
        this.volumeNum = this.volume;
        this.volume = 0;
        this.volumeType = "icon-jingyin";
      } else {
        this.volumeStatus = true;
        this.volume = this.volumeNum;
        this.volumeType = "icon-yinliang";
      }
    },
    //歌曲播放类型变化
    playTypeChange() {
      if (this.playType == 1) {
        this.playType = 2;
        this.showPlayType = "随机播放";
        this.playStatus = "icon-suijibofang";
        return;
      }
      if (this.playType == 2) {
        this.playType = 3;
        this.showPlayType = "单曲循环";
        this.playStatus = "icon-danquxunhuan";
        return;
      }
      if (this.playType == 3) {
        this.playType = 1;
        this.showPlayType = "列表循环";
        this.playStatus = "icon-liebiaoxunhuan";
        return;
      }
    },
    ClickPlay() {
      this.audioInit();
      this.getMusicList(this.songInfo.id);
      this.$refs.rotate.style.animationPlayState = "running";
      this.playing = true;
      setTimeout(() => {
        music.play();
      }, 100);
    },
    GetSongList() {
      this.songList  = this.songListProps;
      this.GetSongListInfo(this.songList)
    },
    GetSongListInfo(res) {
      let myList;
      if (res.length > 0) {
        myList = res;
      } else {
        console.log("没查到数据");
      }
      this.songList = myList;
      this.songInfo = this.songList[0];
      this.getMusicList(this.songInfo.id); //通过正在播放的歌曲id获取歌曲播放的URL歌词信息
      this.audioInit();
    },
    audioInit() {
      let that = this;
      let progressL = this.$refs.track.offsetWidth; // 进度条总长
      music.addEventListener("timeupdate", () => {
        // 当前播放时间
        let compareTime = music.currentTime;
        for (let i = 0; i < that.lyricInfo.length; i++) {
          if (compareTime > parseInt(that.lyricInfo[i].time)) {
            const index = that.lyricInfo[i].index;
            if (i === parseInt(index)) {
              that.lyricIndex = i;
            }
          }
        }
        that.currentTime = TimeToString(music.currentTime);
        that.audioProgress = music.currentTime / music.duration;
        that.thumbTranslateX = (that.audioProgress * progressL).toFixed(3);
      });
      music.addEventListener("ended", () => {
        switch (parseInt(that.playType)) {
          case 1: // 列表循环
            that.playIndex =
              that.playIndex + 1 >= that.songList.length
                ? 0
                : that.playIndex + 1;
            break;
          case 2: // 随机播放
            that.playIndex = Math.floor(Math.random() * that.songList.length);
            break;
          case 3: // 单曲循环
            break;
        }
        that.songInfo = that.songList[that.playIndex];
        this.getMusicList(that.songInfo.id);
        setTimeout(() => {
          this.$refs.rotate.style.animationPlayState = "running";
          music.play();
        }, 200);
      });
    },
    //播放与暂停
    playMusic() {
      if (this.playing) {
        // 播放中,点击则为暂停
        this.playing = false;
        this.$refs.rotate.style.animationPlayState = "paused";
        music.pause();
      } else {
        // 暂停中,点击则为播放
        this.playing = true;
        this.$refs.rotate.style.animationPlayState = "running";
        music.play();
      }
    },
    PlayListMusic(index) {
      this.playIndex = index;
      this.songInfo = this.songList[this.playIndex];
      this.getMusicList(this.songInfo.id);
      this.playing = true;
      this.drawer = false;
      setTimeout(() => {
        this.$refs.rotate.style.animationPlayState = "running";
        music.play();
      }, 200);
    },
    //点击进度条
    handleProgressClick(event) {
      let progressL = this.$refs.track.offsetWidth; // 进度条总长
      let clickX = event.offsetX;
      let time = (clickX / progressL).toFixed(2);
      this.setProgress(time);
    },
    setProgress(x) {
      music.currentTime = music.duration * x;
    },
    // 上一首
    skipBack() {
      this.skipFn("skipBack");
    },
    // 下一首
    skipForward() {
      this.skipFn("skipForward");
    },
    //上下首封装
    skipFn(type) {
      switch (parseInt(this.playType)) {
        case 2: // 随机播放
          this.playIndex = Math.floor(Math.random() * this.songList.length);
          break;
        default:
          if (type == "skipBack") {
            this.playIndex - 1 >= 0 ? this.playIndex-- : 0;
          } else {
            this.playIndex =
              this.playIndex + 1 >= this.songList.length
                ? this.songList.length - 1
                : this.playIndex + 1;
          }
          break;
      }
      this.songInfo = this.songList[this.playIndex];
      this.getMusicList(this.songInfo.id);
      this.playing = true;
      setTimeout(() => {
        this.$refs.rotate.style.animationPlayState = "running";
        music.play();
      }, 200);
    },
    //调节音量
    changeVolum(c) {
      music.volume = c / 100;
      if (music.volume == 0) {
        this.volumeType = "icon-jingyin";
      } else {
        this.volumeType = "icon-yinliang";
      }
    },
    //获取歌曲播放的URL信息
    getMusicList(id) {
      let that = this;
      axios.get("/musicController/getMusicURLInfo/" + id).then(function (res) {
        switch (res.code) {
          case "0000":
            that.songInfo.url = res.data.url;
            that.GetLyricList(res.data.lyric);
            break;
          case "1111":
            Message.warning("获取歌曲播放地址失败！");
            break;
        }
      });
    },
    GetLyricList(lrc) {
      let lyricsObjArr = [];
      const regNewLine = /\n/;
      const lineArr = lrc.split(regNewLine); // 每行歌词的数组
      const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;
      lineArr.forEach((item) => {
        if (item === "") return;
        const obj = {};
        const time = item.match(regTime);

        obj.lyric =
          item.split("]")[1].trim() === "" ? "" : item.split("]")[1].trim();
        obj.time = time
          ? TimeToSeconds(time[0].slice(1, time[0].length - 1))
          : 0;
        obj.uid = Math.random().toString().slice(-6);
        if (obj.lyric === "") {
          console.log("这一行没有歌词");
        } else {
          lyricsObjArr.push(obj);
        }
      });
      this.lyricInfo = lyricsObjArr.map((item, index) => {
        item.index = index;
        return {
          ...item,
        };
      });
    },
  },
};
</script>

<style lang="less" scoped>
.song-list-rtl :hover{
    background: #2a243f;
}
.main-page {
  width: 100%;
  height: calc(100vh - 115px);
  position: absolute;
  background: rgba(15, 15, 15, 0.4);
  overflow: hidden;
  .background-flitter {
    position: absolute;
    z-index: 0;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: cover;
    background-position: 50%;
    filter: blur(8px);
    // margin: -20px;
    opacity: 0.7;
    overflow: hidden;
    box-sizing: border-box;
  }
  .play-mini {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 72px;
    // background: #fff;
    display: flex;
    align-items: center;
    padding: 6px 0;
    box-sizing: border-box;
    z-index: 10;
    .songInfo {
      min-width: 45%;
      position: relative;
      padding: 0 18px;
      box-sizing: border-box;
      display: flex;
      .poster {
        width: 52px;
        height: 52px;
        border-radius: 5px;
        margin-top: 26px;
        margin-right: 20px;
      }
      .info {
        min-width: 280px;
        height: 100%;
        line-height: 30px;
        font-size: 16px;
      }
    }
    .controls {
      width: 280px;
      height: 100%;
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
      .status {
        width: 40px;
        height: 40px;
        margin-left: 36px;
        margin-right: 36px;
        cursor: pointer;
      }
    }
    .progress-bar {
      position: absolute;
      z-index: 10;
      top: -5px;
      width: 100%;
      height: 5px;
      background: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      .progress-box {
        height: 100%;
        background: linear-gradient(to right, #da7192 0%, #895ff3 100%);
        position: relative;
      }
    }
    .right-botton {
      position: relative;
      width: 420px;
      height: 100%;
      display: flex;
      align-items: center;
      .text-div {
        color: #fff;
        height: 100%;
        line-height: 60px;
        margin-left: 5px;
        margin-right: 5px;
      }
      .playlist {
        position: absolute;
        right: 0px;
      }
      a {
        color: #333;
      }
    }
  }
  .song-cover-lyric {
    position: relative;
    width: 100%;
    height: 100%;
    padding-bottom: 72px;
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    .disc-continer {
      width: 50%;
      height: 100%;
      position: relative;
      .poster {
        position: relative;
        width: 280px;
        height: 280px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        left: 50%;
        top: 100px;
        margin-left: -140px;
        box-shadow: 0 0 0 12px rgba(255, 255, 255, 0.4);
        animation: animations1 12s linear infinite forwards;
        animation-play-state: paused;
        overflow: hidden;
        margin-bottom: 160px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .song-name {
        width: 100%;
        height: 40px;
        text-align: center;
        font-size: 32px;
        font-weight: 600;
        color: #fff;
        line-height: 40px;
      }
      .song-artistsName {
        width: 100%;
        height: 40px;
        text-align: center;
        font-size: 28px;
        font-weight: 600;
        color: #fff;
        line-height: 40px;
        margin-top: 24px;
      }
      @keyframes animations1 {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
    .lyric {
      width: 50%;
      height: calc(100vh);
      position: relative;
      overflow: hidden;
    }
  }
}
</style>
<style lang="less">
.el-drawer.rtl{
  background: #000000;
}
.el-drawer__body ::-webkit-scrollbar{
  display: none;
}
*{
  scrollbar-width: none;
}
.ivu-drawer-body {
  .list-container {
    width: 100%;
    height: 100%;
    position: relative;
    .songInfo {
      width: 100%;
      height: 42px;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      cursor: pointer;
      img {
        width: 36px;
        height: 36px;
        border-radius: 5px;
        margin-right: 12px;
      }
      .info {
        position: relative;
        width: 240px;
        height: 36px;
        line-height: 18px;
        .name {
          width: 100%;
          height: 18px;
          font-size: 14px;
          font-weight: 600;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          line-height: 18px;
        }
        .singer {
          width: 100%;
          height: 18px;
          font-size: 12px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          line-height: 18px;
        }
      }
    }
  }
}
</style>


