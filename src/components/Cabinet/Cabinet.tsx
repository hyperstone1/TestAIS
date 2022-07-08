import { useState, useEffect, useRef } from 'react';
import s from './Cabinet.module.scss';
import styled from 'styled-components';
import { doc, collection, addDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth, updatePassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { removeUser } from 'src/redux/userSlice/userSlice';
import { Link } from 'react-router-dom';

const LiState = styled.li`
  font-weight: 500;
  font-size: 18px;
  color: #676a71;
  padding: 23px 94px 23px 62px;
  cursor: pointer;

  border-radius: 5px;
`;

type Props = {
  localName: string;
  setLocalName: React.Dispatch<React.SetStateAction<string>>;
};

export default function Cabinet({ localName, setLocalName }: Props) {
  const [name, setName] = useState('');
  const [myData, setMyData] = useState(true);
  const [secondName, setSecondName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isChangeType, setIsChangeType] = useState(true);
  const refNewPass = useRef<HTMLInputElement>(null);
  const refConfirmPass = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const isData = myData
    ? {
        border: '1px solid #009cb4',
        color: '#009cb4',
        padding: '22px 51px 23px 41px',
        borderRadius: '5px',
      }
    : { borderBottom: '1px solid #EDEDF4' };

  const fillSvg = myData ? '#009cb4' : '#676A71';

  function sendData() {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        let isUpdate = false;
        querySnapshot.forEach((docum) => {
          const myData = docum.data();
          const queryUpdate = doc(db, 'users', docum.id);

          if (myData.uid.includes(localStorage.getItem('id'))) {
            updateDoc(queryUpdate, {
              uid: localStorage.getItem('id'),
              name: name,
              secondName: secondName,
              patronymic: patronymic,
              country: country,
              city: city,
              phone: phone,
            });
            isUpdate = true;
          }
        });
        if (!isUpdate) {
          const docRef = await addDoc(collection(db, 'users'), {
            uid: localStorage.getItem('id'),
            name: name,
            secondName: secondName,
            patronymic: patronymic,
            country: country,
            city: city,
            phone: phone,
          });
          console.log('Document written with ID: ', docRef.id);
        }
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    }
    updatePass();

    fetchData();
  }

  useEffect(() => {
    async function getData() {
      const querySnapshot = await getDocs(collection(db, 'users'));
      querySnapshot.forEach((doc) => {
        const myData = doc.data();
        if (myData.uid.includes(localStorage.getItem('id'))) {
          setName(myData.name);
          setSecondName(myData.secondName);
          setPatronymic(myData.patronymic);
          setCountry(myData.country);
          setCity(myData.city);
          setPhone(myData.phone);
          setLocalName(myData.name + ' ' + myData.secondName);
        }
      });
    }
    getData();
  }, []);

  const clickMyData = () => {
    myData ? setMyData(false) : setMyData(true);
  };

  const setInfoHandler = () => {
    setLocalName(name + ' ' + secondName);
    sendData();
  };

  const onClickEyeNewPass = () => {
    const changeType = refNewPass.current;
    setIsChangeType(!isChangeType);
    isChangeType ? (changeType.type = 'text') : (changeType.type = 'password');
  };
  const onClickEyeConfirmPass = () => {
    const changeType = refConfirmPass.current;
    setIsChangeType(!isChangeType);
    isChangeType ? (changeType.type = 'text') : (changeType.type = 'password');
  };

  const updatePass = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const newPassword = newPass;
    if (newPass === confirmPass) {
      if (newPass != '') {
        updatePassword(user, newPassword)
          .then(() => {
            Swal.fire({
              title: 'Вы успешно изменили пароль',
              timer: 1500,
              icon: 'success',
              showConfirmButton: false,
            });
          })
          .catch(() => {
            Swal.fire({
              title: 'Ошибка при измении пароля',
              timer: 1500,
              icon: 'error',
              showConfirmButton: false,
            });
          });
      }
    } else {
      Swal.fire({
        title: 'Ошибка',
        text: 'Пароли не совпадают!',
      });
    }
  };
  const handlerExit = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('id');
    setLocalName('');
    dispatch(removeUser());
  };

  return (
    <>
      <div className={s.container}>
        <h2>Личный кабинет</h2>
        <div className={s.cabinet}>
          <div className={s.menu}>
            <ul>
              <LiState onClick={clickMyData} style={isData} className={s.myData}>
                <svg
                  width="20"
                  height="26"
                  viewBox="0 0 20 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.0003 12.6667C13.307 12.6667 16.0003 9.97333 16.0003 6.66667C16.0003 3.36 13.307 0.666666 10.0003 0.666666C6.69366 0.666666 4.00033 3.36 4.00033 6.66667C4.00033 9.97333 6.69366 12.6667 10.0003 12.6667ZM10.0003 3.33333C11.8403 3.33333 13.3337 4.82667 13.3337 6.66667C13.3337 8.50667 11.8403 10 10.0003 10C8.16033 10 6.66699 8.50667 6.66699 6.66667C6.66699 4.82667 8.16033 3.33333 10.0003 3.33333Z"
                    fill={fillSvg}
                  />
                  <path
                    d="M14.0003 14H6.00033C3.05366 14 0.666992 16.3867 0.666992 19.3333V20.6667C0.666992 23.6133 3.05366 26 6.00033 26H14.0003C16.947 26 19.3337 23.6133 19.3337 20.6667V19.3333C19.3337 16.3867 16.947 14 14.0003 14ZM16.667 20.6667C16.667 22.1333 15.467 23.3333 14.0003 23.3333H6.00033C4.53366 23.3333 3.33366 22.1333 3.33366 20.6667V19.3333C3.33366 17.8667 4.53366 16.6667 6.00033 16.6667H14.0003C15.467 16.6667 16.667 17.8667 16.667 19.3333V20.6667Z"
                    fill={fillSvg}
                  />
                </svg>
                Мои данные
              </LiState>
              <LiState className={s.notifications}>
                <svg
                  width="22"
                  height="28"
                  viewBox="0 0 22 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21.6267 17.8133L20.8667 12.2666C20.2401 7.63995 16.6667 4.05329 12.3201 3.43995V2.01336C12.3201 1.28002 11.7201 0.680023 10.9868 0.680023C10.2534 0.680023 9.65342 1.28002 9.65342 2.01336V3.43995C5.30675 4.06662 1.76007 7.63995 1.12007 12.2666L0.360083 17.8133C0.160083 19.2533 0.586736 20.6934 1.5334 21.76C2.42674 22.7734 3.69342 23.36 5.02675 23.36H6.42675C6.72009 25.5866 8.61341 27.32 10.9201 27.32C13.2267 27.32 15.1201 25.5866 15.4134 23.36H16.9201C18.2534 23.36 19.5201 22.7734 20.4134 21.76C21.3601 20.68 21.7867 19.24 21.5867 17.8133H21.6267ZM10.9468 24.6667C10.1068 24.6667 9.4134 24.12 9.16007 23.3733H12.7334C12.4801 24.12 11.7868 24.6667 10.9468 24.6667ZM18.4401 20.0134C18.0534 20.4534 17.5201 20.7066 16.9468 20.7066H5.04008C4.46674 20.7066 3.94675 20.4667 3.54675 20.0134C3.12008 19.52 2.92007 18.84 3.0134 18.1734L3.77341 12.6266C4.28008 8.8533 7.38674 6.00001 11.0001 6.00001C14.6134 6.00001 17.7067 8.8533 18.2267 12.6266L18.9867 18.1734C19.0801 18.84 18.8801 19.52 18.4534 20.0134H18.4401Z"
                    fill="#676A71"
                  />
                </svg>
                Уведомления
              </LiState>
              <LiState className={s.registries}>
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.3467 0H6.66667C2.98667 0 0 2.98667 0 6.66667V17.3467C0 21.0267 2.98667 24.0133 6.66667 24.0133H17.3467C21.0267 24.0133 24.0133 21.0267 24.0133 17.3467V6.66667C24.0133 2.98667 21.0267 0 17.3467 0ZM11.16 11.96L9.33333 12.8534V2.66667H14.68V12.8534L12.8533 11.96C12.32 11.6933 11.6933 11.6933 11.16 11.96ZM21.3467 17.3333C21.3467 19.5333 19.5467 21.3333 17.3467 21.3333H6.66667C4.46667 21.3333 2.66667 19.5333 2.66667 17.3333V6.65332C2.66667 4.45332 4.45332 2.66665 6.65332 2.65332V14.0533C6.65332 14.7066 6.98667 15.3067 7.54667 15.6667C8.12 16.0267 8.81333 16.0534 9.41333 15.7734L11.9867 14.52L14.56 15.7734C14.8266 15.9067 15.12 15.9733 15.4 15.9733C15.76 15.9733 16.1067 15.88 16.4267 15.68C16.9867 15.3333 17.32 14.7333 17.32 14.0666V2.66667C19.52 2.66667 21.32 4.46667 21.32 6.66667V17.3467L21.3467 17.3333Z"
                    fill="#676A71"
                  />
                </svg>
                Реестры
              </LiState>
              <LiState className={s.metadata}>
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M23.84 7.61328L17.2666 1.03996C16.6 0.373291 15.6933 0 14.7466 0H8.89331C4.47998 0 0.893311 3.58667 0.893311 8V16C0.893311 20.4133 4.47998 24 8.89331 24H16.8933C21.3066 24 24.8933 20.4133 24.8933 16V10.1466C24.8933 9.19998 24.52 8.29329 23.8533 7.62663L23.84 7.61328ZM16.5466 4.09334L20.8 8.34668H18.68C17.5066 8.34668 16.5466 7.45335 16.5466 6.34668V4.09334ZM16.88 21.32H8.87996C5.9333 21.32 3.54663 18.9333 3.54663 15.9867V7.98665C3.54663 5.03999 5.9333 2.65332 8.87996 2.65332H13.8666V6.34668C13.8666 8.92001 16.0266 11.0133 18.6666 11.0133H22.2V15.9867C22.2 18.9333 19.8133 21.32 16.8666 21.32H16.88Z"
                    fill="#676A71"
                  />
                </svg>
                Метаданные
              </LiState>
              <LiState className={s.security}>
                <svg
                  width="22"
                  height="28"
                  viewBox="0 0 22 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.5999 10H16.3333V6.00002C16.3333 3.05335 13.9466 0.666687 10.9999 0.666687C8.05325 0.666687 5.66658 3.05335 5.66658 6.00002V10H5.3999C2.5999 10 0.333252 12.28 0.333252 15.0667V22.2534C0.333252 25.0534 2.61324 27.32 5.3999 27.32H16.5866C19.3866 27.32 21.6532 25.04 21.6532 22.2534V15.0667C21.6532 12.2667 19.3733 10 16.5866 10H16.5999ZM8.33325 6.00002C8.33325 4.53335 9.53325 3.33335 10.9999 3.33335C12.4666 3.33335 13.6666 4.53335 13.6666 6.00002V10H8.33325V6.00002ZM18.9999 22.2667C18.9999 23.5867 17.9199 24.6667 16.5999 24.6667H5.41325C4.09325 24.6667 3.01326 23.5867 3.01326 22.2667V15.08C3.01326 13.76 4.09325 12.68 5.41325 12.68H16.5999C17.9199 12.68 18.9999 13.76 18.9999 15.08V22.2667Z"
                    fill="#676A71"
                  />
                </svg>
                Безопасность
              </LiState>
              <LiState className={s.downloads}>
                <svg
                  width="22"
                  height="28"
                  viewBox="0 0 22 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.79986 21.48C9.98652 21.6666 10.2132 21.7866 10.4532 21.8666C10.6265 21.9466 10.8132 22 11.0132 22C11.2132 22 11.3999 21.9466 11.5599 21.8666C11.7999 21.7866 12.0265 21.6666 12.2132 21.48L19.2132 14.4666C19.7332 13.9466 19.7332 13.1066 19.2132 12.5866C18.6932 12.0666 17.8532 12.0666 17.3332 12.5866L12.3599 17.5866V2.01333C12.3599 1.27999 11.7732 0.679993 11.0265 0.679993C10.2799 0.679993 9.69319 1.27999 9.69319 2.01333V17.5866L4.70652 12.5999C4.18652 12.0799 3.34652 12.0799 2.82652 12.5999C2.30652 13.1199 2.30652 13.96 2.82652 14.48L9.82652 21.4933L9.79986 21.48Z"
                    fill="#676A71"
                  />
                  <path
                    d="M20.3333 22C19.5999 22 18.9999 22.6 18.9999 23.3333C18.9999 24.2133 18.1999 24.68 17.4532 24.68H4.51992C3.75992 24.68 2.99992 24.2133 2.99992 23.3333C2.99992 22.6 2.39992 22 1.66659 22C0.933252 22 0.333252 22.6 0.333252 23.3333C0.333252 25.5867 2.17325 27.3467 4.51992 27.3467H17.4532C19.8132 27.3467 21.6666 25.5867 21.6666 23.3333C21.6666 22.6 21.0666 22 20.3333 22Z"
                    fill="#676A71"
                  />
                </svg>
                Мои загрузки
              </LiState>
              <Link to="/">
                <LiState onClick={handlerExit} style={{ color: '#E0371F' }}>
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.6667 16C13.9333 16 13.3333 16.6 13.3333 17.3333V18.6667C13.3333 20.1067 12.4133 21.3333 11.3333 21.3333H4.66667C3.58667 21.3333 2.66667 20.1067 2.66667 18.6667V5.33333C2.66667 3.89333 3.58667 2.66667 4.66667 2.66667H11.3333C12.4133 2.66667 13.3333 3.89333 13.3333 5.33333V6.66667C13.3333 7.4 13.9333 8 14.6667 8C15.4 8 16 7.4 16 6.66667V5.33333C16 2.38667 13.9067 0 11.3333 0H4.66667C2.09333 0 0 2.38667 0 5.33333V18.6667C0 21.6133 2.09333 24 4.66667 24H11.3333C13.9067 24 16 21.6133 16 18.6667V17.3333C16 16.6 15.4 16 14.6667 16Z"
                      fill="#E0371F"
                    />
                    <path
                      d="M23.9997 12C23.9997 11.8134 23.9597 11.6267 23.8797 11.4667C23.7997 11.2533 23.693 11.0667 23.533 10.9067L19.5197 6.90668C18.9997 6.38668 18.1597 6.38668 17.6397 6.90668C17.1197 7.42668 17.1197 8.26665 17.6397 8.78665L19.5197 10.6533H6.66634C5.93301 10.6533 5.33301 11.2533 5.33301 11.9867C5.33301 12.72 5.93301 13.32 6.66634 13.32H19.5197L17.653 15.1866C17.133 15.7066 17.133 16.5467 17.653 17.0667C17.9197 17.3333 18.253 17.4533 18.5997 17.4533C18.9464 17.4533 19.2797 17.32 19.5463 17.0667L23.5463 13.08C23.7063 12.92 23.8264 12.72 23.893 12.52C23.9597 12.36 24.013 12.1733 24.013 11.9867L23.9997 12Z"
                      fill="#E0371F"
                    />
                  </svg>
                  Выход
                </LiState>
              </Link>
            </ul>
          </div>
          {myData === true ? (
            <div className={s.info}>
              <div className={s.name}>
                <img src="images/user.png" alt="User" />
                <h3>Здравствуйте, {localName}!</h3>
              </div>
              <div className={s.userData}>
                <h4>Основные данные</h4>

                <div className={s.mainData}>
                  <div className={s.containerInput}>
                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" />
                    <label htmlFor="">Имя</label>
                  </div>

                  <div className={s.containerInput}>
                    <input
                      onChange={(e) => setSecondName(e.target.value)}
                      value={secondName}
                      type="text"
                    />
                    <label htmlFor="">Фамилия</label>
                  </div>
                  <div className={s.containerInput}>
                    <input
                      onChange={(e) => setPatronymic(e.target.value)}
                      value={patronymic}
                      type="text"
                    />
                    <label htmlFor="">Отчество</label>
                  </div>
                  <div className={s.containerInput}>
                    <input
                      onChange={(e) => setCountry(e.target.value)}
                      value={country}
                      type="text"
                    />
                    <label htmlFor="">Страна</label>
                  </div>
                  <div className={s.containerInput}>
                    <input onChange={(e) => setCity(e.target.value)} value={city} type="text" />
                    <label htmlFor="">Город</label>
                  </div>
                  <div className={s.containerInput}>
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" />
                    <label htmlFor="">Мобильный телефон</label>
                  </div>
                </div>

                <h4>Пароль</h4>

                <div className={s.password}>
                  <div className={s.containerInput}>
                    <input
                      ref={refNewPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      value={newPass}
                      type="password"
                    />
                    <label htmlFor="">Новый пароль</label>
                    <img
                      onClick={onClickEyeNewPass}
                      className={s.eye}
                      src="../images/closedEye.svg"
                      alt="closed-eye"
                    />
                  </div>
                  <div className={s.containerInput}>
                    <input
                      ref={refConfirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      value={confirmPass}
                      type="password"
                    />
                    <label htmlFor="">Подтверждение пароля</label>
                    <img
                      onClick={onClickEyeConfirmPass}
                      className={s.eye}
                      src="../images/closedEye.svg"
                      alt="closed-eye"
                    />
                  </div>
                </div>
                <button onClick={setInfoHandler} className={s.btnSave}>
                  Сохранить
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
}
