import * as Utilities from "./utilities";

type selectionCallback = (from: Ranking, to: Ranking, numberOfRanks: number) => void;

export class Form {
  // Function to format dates in the format for drop-downs.
  private static getDropDownDate(date: Date): string {
    return date.toDateString().substring(4);
  }

  private static setUpFormToggle(): void {
    document.querySelector(".flyout .toggle").addEventListener("click", () => {
      document.querySelector(".flyout .body").classList.toggle("hidden");
    });
  }

  private data: Rankings;
  private onSelection: selectionCallback;

  private highestNumberOfRanks: number;

  private dateFromElement: HTMLSelectElement = document.querySelector("#dateFrom") as HTMLSelectElement;
  private dateToElement: HTMLSelectElement = document.querySelector("#dateTo") as HTMLSelectElement;
  private topNRanksElement: HTMLSelectElement = document.querySelector("#topNRanks") as HTMLSelectElement;

  constructor(allData: Rankings, onSelection: selectionCallback) {
    this.data = allData;
    this.onSelection = onSelection;

    // Find the highest number of ranks.
    this.highestNumberOfRanks = 0;
    this.data.rankings.forEach((ranking) => {
      this.highestNumberOfRanks = Math.max(this.highestNumberOfRanks, ranking.ranks.length);
    });

    Form.setUpFormToggle();

    this.setUpDropDowns();
    this.setUpAllDataButton();
    this.setUpDefaultDataButton();

    this.showDefaultData();
  }

  // Function to update the top n ranks dropdown.
  private dropDownRanks(selected) {
    const addRank = (rankNumber: number) => {
      const option = document.createElement("option");
      const rankString = rankNumber.toString();
      option.text = rankString;
      option.value = rankString;
      option.selected = selected === rankNumber;
      this.topNRanksElement.add(option);
    };

    Utilities.emptyElement(this.topNRanksElement);

    for (let i = 1; i <= this.highestNumberOfRanks; i++) {
      addRank(i);
    }
  }

  // Function to update the dates dropdown list and re-display the graph.
  private setDropDownDates(first: Ranking, last: Ranking) {
    const addDateToSelector = (date: Date, selector: HTMLSelectElement, isSelected: boolean, isEnabled: boolean) => {
      const option = document.createElement("option");
      const dateString = Form.getDropDownDate(date);
      option.text = dateString;
      option.value = dateString;
      option.selected = isSelected;
      option.disabled = !isEnabled;
      selector.add(option);
    };

    Utilities.emptyElement(this.dateFromElement);
    Utilities.emptyElement(this.dateToElement);

    this.data.rankings.forEach((ranking) => {
      addDateToSelector(ranking.date as Date, this.dateFromElement, ranking === first, ranking.date < last.date);
      addDateToSelector(ranking.date as Date, this.dateToElement, ranking === last, ranking.date > first.date);
    });
  }

  private setUpDefaultDataButton(): void {
    document.querySelector("#showDefaultData").addEventListener("click", () => {
      this.showDefaultData();
    });
  }

  private setUpAllDataButton(): void {
    document.querySelector("#showAllData").addEventListener("click", () => {
      this.showAllData();
    });
  }

  private setUpDropDowns(): void {
    const setUpChangeListener = (dropDown: HTMLSelectElement) => {
      dropDown.addEventListener("change", () => this.showSelectedData());
    };

    setUpChangeListener(this.dateFromElement);
    setUpChangeListener(this.dateToElement);
    setUpChangeListener(this.topNRanksElement);
  }

  // Function to assess dropdowns and reload the graph.
  private showSelectedData() {
    const findRanking = (dateString: string) => {
      return this.data.rankings.find((ranking) => {
        return Form.getDropDownDate(ranking.date as Date) === dateString;
      });
    };

    this.updateGraph(
      findRanking(this.dateFromElement.value),
      findRanking(this.dateToElement.value),
      parseInt(this.topNRanksElement.value, 10),
    );
  }

  private showDefaultData() {
    this.updateGraph(
      this.data.rankings[this.data.rankings.length - 11],
      this.data.rankings[this.data.rankings.length - 1],
      10,
    );
  }

  private showAllData() {
    this.updateGraph(
      this.data.rankings[0],
      this.data.rankings[this.data.rankings.length - 1],
      this.highestNumberOfRanks,
    );
  }

  private updateGraph(from: Ranking, to: Ranking, numberOfRanks: number): void {
    this.dropDownRanks(numberOfRanks);
    this.setDropDownDates(from, to);
    this.onSelection(from, to, numberOfRanks);
  }
}
