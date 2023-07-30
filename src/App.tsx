import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  Box,
  Checkbox,
  Container,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Typography,
  styled,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TranslateIcon from '@mui/icons-material/Translate';
import azureTranslate, { apiLanguage, deepl } from './translate';
import convertJapanese from './kana';
import dotenv from 'dotenv';
// import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

interface Language {
  nativeLang: string;
  targetLang: string;
  kana: string;
  checked: boolean;
}

type FocusFlag = 'off' | 'left' | 'right';

dotenv.config();

const StrikethroughInput = styled(OutlinedInput)(
  ({ strikethru }: { strikethru: boolean }) => ({
    textDecoration: strikethru ? 'line-through' : 'none',
  })
);

//const authKey: string = process.env.REACT_APP_KEY as string;
const authKey: string = process.env.REACT_APP_AZURE as string;

export default function App() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }} alignItems="center" justifyContent="center">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          textAlign={'center'}
        >
          Babel List
        </Typography>
        <CheckboxList />
      </Box>
    </Container>
  );
}

function CheckboxList() {
  const [list, setList] = useState<Language[]>([
    {
      nativeLang: 'Cheese',
      targetLang: 'チーズ',
      kana: '',
      checked: false,
    },
    {
      nativeLang: 'Milk',
      targetLang: 'ミルク',
      kana: '',
      checked: false,
    },
    {
      nativeLang: 'Chocolate',
      targetLang: 'チョコ',
      kana: '',
      checked: false,
    },
  ]);

  // Input references for focus()

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [focusFlag, setFocusFlag] = useState<FocusFlag>('off');

  useEffect(() => {
    const index: number = currentIndex;
    switch (focusFlag) {
      case 'off':
        break;
      case 'left':
        inputRefs.current[index + 1]?.querySelector('input')?.focus();
        break;
      case 'right':
        inputRefs2.current[index + 1]
          ?.querySelector('input')
          ?.focus();
        break;
    }
    setFocusFlag('off');
  }, [currentIndex, focusFlag]);

  const inputRefs = useRef<Array<HTMLInputElement>>([]);
  const inputRefs2 = useRef<Array<HTMLInputElement>>([]);
  const inputRefs3 = useRef<Array<HTMLInputElement>>([]);

  // Other functions

  const handleToggle = (index: number) => () => {
    const newList = [...list];
    newList[index].checked = !newList[index].checked;
    setList(newList);
  };

  const handleListChange = (newList: Language[]) => {
    setList(newList);
  };

  const addListItem = (prevList: Language[]) => {
    setList((prevList) => [
      ...prevList,
      { nativeLang: '', targetLang: '', kana: '', checked: false },
    ]);
  };

  const removeItem = (index: number) => () => {
    setList((prevList) => {
      const newList = [...prevList];
      newList.splice(index, 1);
      return newList;
    });
  };

  const handleKeyPress =
    (index: number, flag: FocusFlag) =>
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        console.log('Enter key pressed');
        setList((prevList) => {
          const blankLine = {
            nativeLang: '',
            targetLang: '',
            kana: '',
            checked: false,
          };
          const newList = [...prevList];
          newList.splice(index + 1, 0, blankLine);
          return newList;
        });
        setCurrentIndex(index);
        setFocusFlag(flag);
      }
    };

  const initialLanguages: {
    source: apiLanguage;
    target: apiLanguage;
  } = {
    source: { language: 'EN', name: 'English' },
    target: { language: 'JA', name: 'Japanese' },
  };

  const translateItem = (index: number) => () => {
    const newList = [...list];
    const item = newList[index];
    azureTranslate(authKey, item.nativeLang, 'en', 'ja').then((x) => {
      item.targetLang = x;
      newList.splice(index, 1, item);
      setList(newList);
      return x;
    });
    // .then((x) => {
    //   convertJapanese(x).then((kuroshiroResult) => {
    //    item.kana = kuroshiroResult;
    //     newList.splice(index, 1, item);
    //     setList(newList);
    //   });
  };

  function testKana() {
    console.log('testKana called');
    convertJapanese('犬').then((result) => {
      console.log(result);
    });
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <List
        sx={{
          width: 'fit-content',
          maxWidth: 720,
          bgcolor: 'background.paper',
        }}
      >
        {list.map((item, index) => {
          const labelId = `checkbox-list-label-${item.checked}`;

          return (
            <ListItem key={index} disablePadding>
              <ListItem role={undefined} dense>
                <StrikethroughInput
                  value={item.nativeLang}
                  size="small"
                  //autoFocus={true}
                  ref={(el) =>
                    (inputRefs.current[index] =
                      el as HTMLInputElement)
                  }
                  inputProps={{ 'aria-labelledby': labelId }}
                  onKeyPress={handleKeyPress(index, 'left')}
                  strikethru={item.checked}
                  onChange={(e) => {
                    const newList = [...list];
                    newList[index].nativeLang = e.target.value;
                    handleListChange(newList);
                  }}
                />
                <StrikethroughInput
                  value={item.targetLang}
                  size="small"
                  ref={(el) =>
                    (inputRefs2.current[index] =
                      el as HTMLInputElement)
                  }
                  inputProps={{ 'aria-labelledby': labelId }}
                  onKeyPress={handleKeyPress(index, 'right')}
                  strikethru={item.checked}
                  onChange={(e) => {
                    const newList = [...list];
                    newList[index].targetLang = e.target.value;
                    handleListChange(newList);
                  }}
                />
                <StrikethroughInput
                  value={item.kana}
                  size="small"
                  ref={(el) =>
                    (inputRefs3.current[index] =
                      el as HTMLInputElement)
                  }
                  inputProps={{ 'aria-labelledby': labelId }}
                  onKeyPress={handleKeyPress(index, 'right')}
                  strikethru={item.checked}
                  onChange={(e) => {
                    const newList = [...list];
                    newList[index].kana = e.target.value;
                    handleListChange(newList);
                  }}
                />
                <Checkbox
                  checked={item.checked}
                  onClick={handleToggle(index)}
                  tabIndex={-1}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={removeItem(index)}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
                <IconButton onClick={translateItem(index)}>
                  <TranslateIcon />
                </IconButton>
              </ListItem>
            </ListItem>
          );
        })}
        <ListItem alignItems="center">
          <IconButton onClick={() => addListItem(list)}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              azureTranslate(authKey, 'text', 'en', 'ja')
            }
          >
            <TranslateIcon />
          </IconButton>
        </ListItem>
      </List>
    </Box>
  );
}
