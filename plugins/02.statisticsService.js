import StatisticsService from '~/services/statisticsService'

export default defineNuxtPlugin((ctx) => {
  const statisticsService = new StatisticsService(ctx.$firebaseService);
  return {
    provide: {
      statisticsService: statisticsService
    }
  }
});