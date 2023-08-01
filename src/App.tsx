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
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
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
import azureTranslate from './translate';
import dotenv from 'dotenv';

interface Language {
  nativeLang: string;
  targetLang: string;
  translit: string;
  checked: boolean;
}

type FocusFlag = 'off' | 'left' | 'right';

dotenv.config();

const StrikethroughInput = styled(OutlinedInput)(
  ({ strikethru }: { strikethru: boolean }) => ({
    textDecoration: strikethru ? 'line-through' : 'none',
  })
);

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
  const [list, setList] = useState<Language[]>(() => {
    const storedLanguage = localStorage.getItem('user-list');
    return storedLanguage
      ? JSON.parse(storedLanguage)
      : [
          {
            nativeLang: 'Cheese',
            targetLang: 'チーズ',
            translit: '',
            checked: false,
          },
          {
            nativeLang: 'Milk',
            targetLang: 'ミルク',
            translit: '',
            checked: false,
          },
          {
            nativeLang: 'Chocolate',
            targetLang: 'チョコ',
            translit: '',
            checked: false,
          },
        ];
  });

  React.useEffect(() => {
    localStorage.setItem('user-list', JSON.stringify(list));
  }, [list]);

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
      {
        nativeLang: '',
        targetLang: '',
        translit: '',
        checked: false,
      },
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
            translit: '',
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

  const translateItem = (index: number) => () => {
    const newList = [...list];
    const item = newList[index];
    azureTranslate(authKey, item.nativeLang, 'en', 'ja').then((x) => {
      item.targetLang = x[0].translations[0].text;
      item.translit = x[0].translations[0].transliteration.text;
      newList.splice(index, 1, item);
      setList(newList);
      return x;
    });
  };

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
                <FormControl>
                  <InputLabel htmlFor="result-input">
                    {item.translit}
                  </InputLabel>
                  <StrikethroughInput
                    id="result-input"
                    value={item.targetLang}
                    size="small"
                    label={item.translit}
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
                </FormControl>
                {/* <StrikethroughInput
                  value={item.translit}
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
                    newList[index].translit = e.target.value;
                    handleListChange(newList);
                  }}
                /> */}
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
