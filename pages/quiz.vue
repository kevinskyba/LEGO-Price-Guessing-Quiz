<template>
  <div  v-if="set !== undefined" class="w-full lg:w-2/3 px-16 lg:px-0 mx-auto">
    <div class="items-center justify-center pt-16 pb-16">
      <div class="text-l lg:text-2xl">
        <h1 class="text-2xl lg:text-4xl text-center mb-4 font-bold">
          {{ set.setName }} ({{ set.setNumber }})
        </h1>
        <div class="flex justify-center gap-x-5">
          <p>
            <strong class="font-bold">Anzahl Teile: </strong>
            <span class="font-normal block lg:inline">{{ set.numberOfParts }}</span>
          </p>
          <p>
            <strong class="font-bold">Kollektion: </strong>
            <span class="font-normal block lg:inline">{{ set.collection }}</span>
          </p>
        </div>
      </div>
      <swiper
        :space-between="16"
        :navigation="true"
        :modules="modules" 
        class="p-4 h-64 lg:h-96 mt-16">
        <swiper-slide
          v-for="(image, index) in set.images"
          :key="index"
          style="display: flex;"
          class="align-middle justify-center"
        >
          <vue-load-image class="flex align-middle justify-center" >
            <template v-slot:image>
              <img :src="image" class="max-h-full max-w-full object-contain"/>
            </template>
            <template v-slot:preloader> 
              Loading Image...
            </template>
          </vue-load-image>
        </swiper-slide>
      </swiper>
      <h2
        v-if="result === null"
        class="text-2xl lg:text-3xl mt-16 mb-2 font-semibold text-center"
      >
        Rate den Preis:
      </h2>
      <div class="pt-28 w-full">
        <div class="relative h-36">
          <div
            :style="{
              left: `calc(${(price / 1000) * 100}% - ${
                -1.9 + 3.8 * (price / 1000)
              }rem)`,
            }"
            class="pill absolute -top-4 transform -translate-x-1/2 -translate-y-full p-8 border-black text-black text-2xl font-bold text-center"
          >
            {{ price }}€
          </div>
          <div
            v-if="result !== null"
            :style="{
              left: `calc(${(set.actualPrice / 1000) * 100}% - ${
                -2 + 3.5 * (set.actualPrice / 1000)
              }rem)`,
            }"
            class="pill-upside-down absolute top-36 transform -translate-x-1/2 -translate-y-full p-8 border-black text-black text-2xl font-bold text-center"
          >
            {{ Math.round(set.actualPrice) }} €
          </div>
          <input
            :disabled="result !== null"
            type="range"
            v-model="price"
            min="0"
            max="1000"
            step="1"
            class="slider w-full h-2 outline-none appearance-none mt-6"
            @input="moveBubble"
          />
        </div>
        <div v-if="result === null">
          <button
            @click="confirmSelection"
            class="w-full bg-red-600 hover:bg-yellow-400 text-white hover:text-red-600 font-bold py-2 px-4 rounded"
          >
            Preis bestätigen
          </button>
          <button
            @click="moveToNextRandomSet"
            class="w-full hover:bg-yellow-400 text-white hover:text-red-600 font-bold py-2 px-4 rounded"
          >
            Anderes Set
          </button>
        </div>
        <div v-if="result !== null" class="text-center text-2xl lg:text-4xl">
          Die UVP lautet
          <strong class="font-bold">{{ set.actualPrice }}€</strong>.
        </div>
        <div v-if="result !== null" class="text-center text-2xl lg:text-4xl">
          {{ resultText }}
        </div>
        <button
          v-if="result !== null"
          @click="moveToNextRandomSet"
          class="w-full bg-red-600 hover:bg-yellow-400 text-white hover:text-red-600 font-bold my-6 py-2 px-4 rounded"
        >
          Nächstes Set
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import _ from 'underscore';
import { useRouter, useRoute } from 'vue-router';

import legoData from "~/static/lego_sets.json";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/navigation';

import VueLoadImage from 'vue-load-image'

export default {
  components: { Swiper, SwiperSlide, 'vue-load-image': VueLoadImage },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const price = ref(0);
    const result = ref(null);
    
    const setID = computed(() => route.query.setID);
    
    const set = computed(() => {
      if (setID.value === undefined)
        return undefined;

      return _.find(legoData, (item) => {
        return item.id == setID.value;
      });
    });
    
    const resultText = computed(() => {
      return result.value ? "Du liegst richtig!" : "Du lagst falsch!";
    });

    const checkForValidSet = () => {
      if (set.value === undefined) {
        moveToNextRandomSet();
      }
    };

    const resetData = () => {
      price.value = 0;
      result.value = null;
    };

    const maximizeImage = (image) => {
      selectedImage.value = image;
    };

    const confirmSelection = () => {
      evaluateResult();
    };

    const evaluateResult = () => {
      const difference = Math.abs(price.value - set.value.actualPrice);
      result.value = difference < set.value.actualPrice * 0.1;
    };

    const moveToNextRandomSet = () => {
      let randomSet = _.sample(legoData);
      router.push({
        query: {
          setID: randomSet.id,
        },
      });
    };

    onMounted(checkForValidSet);

    watchEffect(() => {
      checkForValidSet();
      resetData();
    });

    return {
      price,
      result,
      setID,
      set,
      resultText,
      checkForValidSet,
      resetData,
      maximizeImage,
      confirmSelection,
      evaluateResult,
      moveToNextRandomSet,
      modules: [Navigation],
    };
  },
};
</script>

<style scoped>
.slider {
  background: linear-gradient(to right, #ffff00 0%, #ff1d1d 100%);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 60px;
  height: 60px;
  background: url("img/brick.png");
  background-size: cover;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 60px;
  height: 60px;
  background: url("img/brick.png");
  background-size: cover;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
}

.pill {
  background-image: url("img/price_pill.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.pill-upside-down {
  background-image: url("img/price_pill_180.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

</style>