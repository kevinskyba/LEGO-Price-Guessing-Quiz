import FirebaseService from '~/services/firebaseService'

export default defineNuxtPlugin((ctx) => {
  const firebaseService = new FirebaseService();
  return {
    provide: {
      firebaseService: firebaseService
    }
  }
});