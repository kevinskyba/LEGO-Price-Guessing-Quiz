
export default class StatisticsService {
  constructor(firebaseService) {
    this.firebaseService = firebaseService;
  }

  async saveSelection(setID, value, actualPrice) {
    if (this.firebaseService.isfirebaseAvailable === false) return;

    await this.firebaseService.addDocumentToCollection('selections', {
      selectedPrice: parseFloat(value),
      setID: setID,
      actualPrice: actualPrice,
      timestamp: this.firebaseService.serverTimestamp
    });
  }
};