<template>
<div>
  <GmapMap
    :center="{lat: lat, lng: lng}"
    :zoom="14"
    :options="{
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: false,
    disableDefaultUi: false
  }"
    map-type-id="satellite"
    style="width: 100%; height: 80%"
  >
    <GmapMarker
      :position="position"
      :clickable="true"
      :draggable="false"
    />
  </GmapMap>

  <div class="myTeam">
    <a-button type="warning"  @click="visible = true">
      Моя комманда
    </a-button>
  </div>
  <a-modal v-model="visible" :title="data.name" @ok="visible = false">
    <p v-for="(el, key) in data.members" :key="key">
      {{key+1}}. {{el}}
    </p>
    <template slot="footer">
      <a-button key="submit" type="primary" @click="visible = false">
        Понятненько
      </a-button>
    </template>
  </a-modal>
  <div class="blocks">
    <div> Задачи: {{data.solved.length}}/5 | {{data.name}} | Score: {{data.score}} </div>
    <div>
      <a-button type="primary" v-if="data.solved.length === 0" @click="getQuest">
        Старт
      </a-button>
      <div v-else-if="quest.startTime && quest.comePoint === 0 && quest.daration === 0">
        <p>Когда придете на точку нажмите на кнопку</p>
        <a-button style="background: orange; color: white" @click="comeInPoint">
            Пришли на точку!
        </a-button>
      </div>
       <div v-else-if="quest.startTime && quest.comePoint && quest.daration === 0">
        <a-button style="background: green; color: white" @click="startQuest">
            Начать задание
        </a-button>
      </div>
      <div v-else-if="quest.startTime && quest.comePoint && quest.daration === -1">
        <a-input-search placeholder="Ваш флаг" size="default" @search="onSearch" style="width: 80%">
          <a-button slot="enterButton">
            Сдать
          </a-button>
        </a-input-search>
        <div>
          <a-button type="danger" @click="skipQuest" size="small" style="margin-top: 10px; font-size: 14px">
            Пропустить задачу
          </a-button>
        </div>
      </div>
      <div v-else>
        <a-button type="primary" @click="getQuest">
           Следующее задание
        </a-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ApiService from '@/api/service'

export default {
  data () {
    return {
      visible: false,
      quest: {},
      data: {
        members: [],
        name: '',
        score: 0,
        solved: []
      },
      position: { lat: -1, lng: -1 },
      lat: 55.733510,
      lng: 36.825376,
      location:null,
      gettingLocation: false,
      errorStr:null,
      teamName: 'Серо-голубые'
    }
  },
  methods: {
    async getActualQuest () {
      ApiService.get('actualQuest')
        .then(({data}) => {
          this.quest = data
        })
    },
    async getActualInfo () {
      ApiService.get('teams')
        .then(({data}) => {
          this.data = data
        })
    },
    startQuest() {
      const q = this.quest
      const self = this
      this.$confirm({
        title: `Начало задания ${q.name}`,
        okText: 'Погнали!',
        cancelText: 'Назад',
        content: () => q.descr,
        onOk() {
          ApiService.put('questions', {
            questId: q.questId,
            daration: -1,
            taskTime: new Date()
          })
            .then(() =>{
              self.getActualInfo()
              self.getActualQuest()
            })
        },
        onCancel() {},
        class: 'test',
      })
    },
    comeInPoint () {
      ApiService.put('questions', {
        questId: this.quest.questId,
        comePoint: new Date()
      })
        .then(() =>{
          this.getActualInfo()
          this.getActualQuest()
        })
    },
    async getQuest () {
      ApiService.get('questions')
        .then(({data}) => {
          if (data.status && data.status === 'done') {
            console.log('okk')
            alert('Вы прошли всем точки! Возвращайтесь :3')
          } else {
            this.position.lat = data.coords[0]
            this.position.lng = data.coords[1]
            this.quest = data
            this.getActualInfo()
            this.getActualQuest()
          }
        })
    },
    onSearch (value) {
      if (value) {
      ApiService.post('flag', {
        questId: this.quest.questId,
        flag: value
      })
        .then(async ({data}) =>{
          if (data.status === 'ok') {
            this.$message.success('Флаг успешно сдан!');
            await this.getQuest()
            await this.getActualInfo()
            await this.getActualQuest()
          } else {
            this.$message.warning('Флаг неверный!');
          }
        })
      } else {
        this.$message.warning('Флаг пустой')
      }
    },
    async getLocation() {
      
      return new Promise((resolve, reject) => {

        if(!("geolocation" in navigator)) {
          reject(new Error('Geolocation is not available.'));
        }

        navigator.geolocation.getCurrentPosition(pos => {
          resolve(pos);
        }, err => {
          reject(err);
        });

      });
    },
    async locateMe() {
      this.gettingLocation = true;
      try {
        this.gettingLocation = false;
        this.location = await this.getLocation();
        this.lat = this.location.coords.latitude
        this.lng = this.location.coords.longitude
      } catch(e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
      }
      
    },
    skipQuest () {
      const q = this.quest
      const self = this
      this.$confirm({
        title: `Вы действительно хотите закончить квест ${q.name} ?`,
        okText: 'Да',
        cancelText: 'Отмена',
        content: () => 'Если вы отмените пропустите задание, в последующем вы не сможете вернуться к нему',
        onOk() {
          ApiService.put('questions', {
            questId: q.questId,
            daration: new Date(),
            score: 0
          })
            .then(() =>{
              self.getActualInfo()
              self.getActualQuest()
            })
        },
        onCancel() {},
        class: 'test',
      })
    }
  },
  async mounted () {
    await this.locateMe()
    await this.getActualInfo()
    await this.getActualQuest()
  }
}
</script>

<style scoped>
  .blocks {
    position: absolute;
    top: 80%;
    width: 100%;
  }
  .blocks div {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .vue-map-container {
    position: absolute;
  }
  .myTeam {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translate(-50%, 0px);
  }
</style>