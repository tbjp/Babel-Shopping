import { DeepL } from 'deepl-client';

interface TranslationProps {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
}

interface TranslationState {
  translatedText: string;
}

class Translation extends React.Component<
  TranslationProps,
  TranslationState
> {
  constructor(props: TranslationProps) {
    super(props);
    this.state = {
      translatedText: '',
    };
  }

  async componentDidMount() {
    const deepL = new DeepL('YOUR_AUTH_KEY');
    const translationResult = await deepL.translate({
      text: this.props.text,
      sourceLang: this.props.sourceLanguage,
      targetLang: this.props.targetLanguage,
    });
    this.setState({
      translatedText: translationResult.translations[0].text,
    });
  }

  render() {
    return (
      <div>
        <p>Source Language: {this.props.sourceLanguage}</p>
        <p>Target Language: {this.props.targetLanguage}</p>
        <p>Text: {this.props.text}</p>
        <p>Translated Text: {this.state.translatedText}</p>
      </div>
    );
  }
}

export default Translation;
