import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

export default function convertJapanese(input: string) {
  const kuroshiro = new Kuroshiro();

  // await kuroshiro.init(new KuromojiAnalyzer());
  // const result = await kuroshiro.convert(text, { to: "hiragana" });
  // console.log('convertJapanese called');
  // const initKuroshiro = async () => {
  //   console.log('initKuroshiro called');
  //   const analyzer = new KuromojiAnalyzer({
  //     dictPath: 'url/to/dictFiles',
  //   });
  //   await kuroshiro.init(analyzer);
  // };

  //initKuroshiro();

  const convertToHiragana = (input: string) => {
    console.log('Convert to Hirigana called.');
    return kuroshiro
      .init(new KuromojiAnalyzer({ dictPath: '/dict' }))
      .then(() => {
        console.log('Analyzer Initiated');
        return kuroshiro.convert(input, { to: 'hiragana' });
      });
    // .then((result) => {
    //   console.log('Kuroshiro output:', result);
    // });
    // .catch (error) {
    //   console.error(error);
    // }
  };
  const kuroshiroOutput = convertToHiragana(input);
  return kuroshiroOutput;
}
