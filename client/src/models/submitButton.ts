class SubmitButtonModel {
  text: string;
  customClass: string;
  isLoading: boolean;

  constructor(text: string, customClass: string, isLoading: boolean) {
    this.text = text;
    this.customClass = customClass;
    this.isLoading = isLoading;
  }
}

export default SubmitButtonModel;
