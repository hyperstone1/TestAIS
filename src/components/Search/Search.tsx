import { useRef, useState, MutableRefObject } from 'react';
import styles from './Search.module.scss';
import { useContext } from 'react';
import { SearchContext } from '../../App';

const Search = () => {
  const { setSearchValue }: any = useContext(SearchContext);
  const inputRef: MutableRefObject<HTMLInputElement | undefined> = useRef<HTMLInputElement>();
  const [value, setValue] = useState('');
  const onClickClear = () => {
    setSearchValue('');
    setValue('');
    inputRef.current.focus();
  };

  const onChangeInput = () => {
    setSearchValue(value);
  };

  return (
    <div className="logoSearchBar">
      <div className="searchBar">
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          //   onChange={getRegistrName}
          className="search"
          type="text"
          placeholder="Искать реестр..."
        />
        {value && (
          <svg
            className={styles.clearIcon}
            onClick={onClickClear}
            height="512px"
            version="1.1"
            viewBox="0 0 512 512"
            width="512px"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" />
          </svg>
        )}
        <button onClick={onChangeInput} className="searchButton">
          Искать
        </button>
      </div>
    </div>
  );
};
export default Search;
