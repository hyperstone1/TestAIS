import s from './Header.module.scss';
import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './transition.css';
import { useDispatch } from 'react-redux';
// import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { removeUser } from '../../redux/userSlice/userSlice';
import { Link } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';

type Props = {
  localName: string;
  setLocalName: React.Dispatch<React.SetStateAction<string>>;
};

export default function Header({ localName, setLocalName }: Props) {
  const [isLogged, setIsLogged] = useState(false);
  const [isClickArrow, setIsClickArrow] = useState(false);
  const dispatch = useDispatch();
  const { isAuth } = useAuth();
  useEffect(() => {
    if (isAuth) {
      localStorage.setItem('isAuth', 'yes');
    }
    if (localStorage.getItem('isAuth') === 'yes') {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
    async function getData() {
      const querySnapshot = await getDocs(collection(db, 'users'));
      querySnapshot.forEach((doc) => {
        console.log(`Пришло с бд: ${doc.id} => ${JSON.stringify(doc.data())}`);
        const myData = doc.data();
        if (myData.uid.includes(localStorage.getItem('id'))) {
          setLocalName(myData.name + ' ' + myData.secondName);
        }
      });
    }
    getData();
  }, [isAuth]);

  const handlerExit = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('id');
    setLocalName('');
    dispatch(removeUser());
  };

  return (
    <header onMouseLeave={() => setIsClickArrow(false)}>
      <div className={s.container}>
        <div className={s.logo_searchbar}>
          <Link to="/">
            <img src="images/logo.svg" alt="" />
          </Link>
          <div className={s.searchBar}>
            <input className={s.search} type="text" placeholder="Поиск" />
          </div>
        </div>
        <div className={s.navigations}>
          <div className={s.icons}>
            <div className={s.icon}>
              <img src="images/calendar.svg" alt="" />
            </div>
            <div className={s.icon + ' ' + s.icon1}>
              <img src="images/notifications.svg" alt="" />
            </div>
            <div className={s.icon_line}></div>
          </div>
          {isLogged ? (
            <div className={s.user}>
              <Link to="/cabinet">
                <img className={s.userImg} src="images/user.png" alt="" />
              </Link>
              {localName !== '' ? (
                <div className={s.user_name}>{localName}</div>
              ) : (
                <div className={s.user_name}>Новый пользователь</div>
              )}
              <div style={{ cursor: 'pointer' }} onMouseEnter={() => setIsClickArrow(true)}>
                <img src="images/arrow_bottom_user.svg" alt="" />
              </div>
              <CSSTransition in={isClickArrow} classNames="alert" timeout={300} unmountOnExit>
                <div className={s.userMenu}>
                  <ul>
                    <Link to="/cabinet" onClick={() => setIsClickArrow(!isClickArrow)}>
                      <li>Личный кабинет</li>
                    </Link>
                    <Link to="/" onClick={() => setIsClickArrow(!isClickArrow)}>
                      <li onClick={handlerExit}>Выйти</li>
                    </Link>
                  </ul>
                </div>
              </CSSTransition>
            </div>
          ) : (
            <div className={s.user}>
              <img className={s.userImg} src="images/user_photo.svg" alt="" />
              <div className={s.user_name}>Вход в аккаунт</div>
              <div style={{ cursor: 'pointer' }} onMouseEnter={() => setIsClickArrow(true)}>
                <img src="images/arrow_bottom_user.svg" alt="" />
              </div>
              <CSSTransition in={isClickArrow} classNames="alert" timeout={300} unmountOnExit>
                <div className={s.userMenu} style={{ marginTop: '-2px', marginLeft: '-34px' }}>
                  <ul>
                    <Link to="/signin" onClick={() => setIsClickArrow(!isClickArrow)}>
                      <li>Войти</li>
                    </Link>
                    <Link to="/signup" onClick={() => setIsClickArrow(!isClickArrow)}>
                      <li onClick={handlerExit}>Зарегистрироваться</li>
                    </Link>
                  </ul>
                </div>
              </CSSTransition>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
