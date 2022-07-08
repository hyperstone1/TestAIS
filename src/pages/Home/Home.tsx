import { useState, useEffect, useContext } from 'react';
import Registries from '../../components/Registries/Registries';
import News from '../../components/News/News';
import Documents from '../../components/Documents/Documents';
import { listType } from '../../utils/constants';
import { Pagination } from '@mui/material';
import axios from 'axios';
import usePagination from '../../utils/pagination';
import Search from '../../components/Search/Search';
import { SearchContext } from '../../App';
import { CSSTransition } from 'react-transition-group';
import './transition.css';
import { PER_PAGE, nbPages } from '../../utils/constants';

export default function Home() {
  const [items, setItems] = useState([]);
  const [news, setNews] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [imgClick, setImgClick] = useState(false);
  const [page, setPage] = useState(1);

  const count = Math.ceil(items.length / PER_PAGE);
  const _DATA = usePagination(items, PER_PAGE);
  const { searchValue }: any = useContext(SearchContext);
  const [nameSort, setNameSort] = useState('id');

  const order = nameSort.includes('-') ? 'desc' : 'asc';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, p: number) => {
    setPage(p);
    _DATA.jump(p);
  };

  const styleForPlus = !imgClick
    ? { transform: '', transition: 'transform 0.3s' }
    : { transform: 'rotate(-45deg)', transition: 'all 0.3s' };

  useEffect(() => {
    axios
      .get(`https://62bedd9f0bc9b12561613263.mockapi.io/documents`)
      .then((res) => setDocuments(res.data));
    axios.get(`https://62bedd9f0bc9b12561613263.mockapi.io/news`).then((res) => setNews(res.data));
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://62bedd9f0bc9b12561613263.mockapi.io/itemsTest?sortBy=${nameSort.replace(
          '-',
          '',
        )}&order=${order}`,
      )
      .then((res) => setItems(res.data));
    if (nbPages < page) {
      setPage(1);
    }
  }, [nameSort]);

  const renderItems = () => {
    const filtredItems = _DATA
      .currentData()
      .filter((item) => item.nameSoft.toLowerCase().includes(searchValue.toLowerCase()));
    return filtredItems.map((item: any, id) => <Registries key={id} {...item} />);
  };

  const onClickHandler = (name: string) => {
    setNameSort(name);
    nameSort === name ? setNameSort(`-${name}`) : setNameSort(name);
  };

  return (
    <>
      <div className="container">
        <div className="startBlock">
          <div className="information">
            <div className="title">РЕЕСТР ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ</div>
            <div className="description description_1">
              Единый реестр программ для электронных вычислительных машин и баз данных
            </div>
            <div className="description description_2">
              Включено ПО в реестр:<b> 13 438</b> Правообладателей: <b>4 272</b>
            </div>
            <Search />
          </div>
          <div className="imgBlock">
            <img src="images/3dOffice.png" />
          </div>
        </div>
      </div>
      <div className="registries">
        <div className="container">
          <div className="registerTitle">
            <h2 id="registries">
              {searchValue ? `Поиск реестра по запросу "${searchValue}"` : 'Реестры'}
            </h2>
            <div className="filters">
              <img src="images/filter.svg" />
              <img src="images/see_more.svg" />
            </div>
          </div>

          <div className="registerList">
            <div className="registerListHeader">
              {listType.map((item, i) => (
                <div
                  key={i}
                  onClick={() => onClickHandler(item.name)}
                  className="rowNumber rowNumber_1">
                  {item.title}
                </div>
              ))}
              <div className="rowNumber rowNumber_3">Код класса</div>
              <div className="rowNumber rowNumber_4">Класс программного обеспечения</div>
              <div className="rowNumber rowNumber_5">Дата регистрации</div>
              <div className="rowNumber rowNumber_6">Адрес сайта</div>
            </div>
          </div>

          <div id="registries" className="registerList listItem">
            {renderItems()}
          </div>

          <Pagination
            sx={{ marginY: 4, magrinX: 'auto', display: 'flex', justifyContent: 'center' }}
            count={count}
            page={page}
            onChange={handleChange}
            shape="rounded"
            showFirstButton
            showLastButton
          />

          <div className="newsRegisterList">
            <h2 id="news">Новости реестра</h2>
            <div className="newsRegisters">
              {news.map((item, id) => (
                <News key={id} {...item} />
              ))}
            </div>

            <button className="showAll">Показать все</button>
          </div>
        </div>
      </div>

      <div>
        <div className="documents">
          <div className="container">
            <h2 id="documents">Документы</h2>
            <p>
              Всего: <b>{documents.length}</b>
            </p>
            <div className="documentsGrid">
              <div className="item itemHeader">
                <div className="category">Категория</div>
                <div className="name">Наименование</div>
                <div className="date">Дата</div>
                <div className="id">Номер</div>
                <div className="content">Содержание</div>
              </div>
              {documents.map((item, id) => (
                <Documents key={id} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div className="questionAnswer">
          <div className="container">
            <h2 id="questions">Вопрос-ответ</h2>
            <div className="list">
              <ul className="questions">
                <div className="item">
                  <img
                    src="images/plus.svg"
                    onClick={() => setImgClick(!imgClick)}
                    style={styleForPlus}
                  />
                  <div>
                    <li className="question">Для подачи заявления необходимо подготовить</li>
                    <CSSTransition in={imgClick} classNames="alert" timeout={200} unmountOnExit>
                      <div className="answer">
                        <ul>
                          <li>1. Данные для авторизации в личном кабинете</li>
                          <li>
                            2. Квалифицированный сертификат ключа проверки электронной подписи.
                          </li>
                          <li>
                            3. Сведения, документы и материалы в соответствии с Методическими
                            рекомендациями.
                          </li>
                          <li>
                            4. Установить специализированное ПО для подписания документов
                            электронной подписью. Подписание производится с использованием усиленной
                            квалифицированной (отсоединяемой) электронной подписи.
                          </li>
                        </ul>
                      </div>
                    </CSSTransition>
                  </div>
                </div>
                <div className="item">
                  <img src="images/plus.svg" />
                  <li className="question">Связь с оператором реестра</li>
                </div>
                <div className="item">
                  <img src="images/plus.svg" />
                  <li className="question">
                    Как подать заявление на включение программного обеспечения в реестр
                  </li>
                </div>
                <div className="item">
                  <img src="images/plus.svg" />
                  <li className="question">Где можно подать заявление</li>
                </div>
                <div className="item">
                  <img src="images/plus.svg" />
                  <li className="question">Как узнать мне причину отказа</li>
                </div>
                <div className="item">
                  <img src="images/plus.svg" />
                  <li className="question">Что делать, если Вам отказали</li>
                </div>
                <div className="item">
                  <img src="images/plus.svg" />
                  <li className="question">Изменение реестревой записи</li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
