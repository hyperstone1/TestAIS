import { useState } from 'react';
import { setUser } from '../../redux/userSlice/userSlice';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
// import { useAppDispatch } from '../../hooks/redux-hooks';
import { useDispatch } from 'react-redux';
import s from './SignUp.module.scss';
import Swal from 'sweetalert2';

import { regPass, regEmail } from '../../utils/constants';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passDirty, setPassDirty] = useState(false);
  const [emailDirty, setEmailDirty] = useState(false);
  const [passError, setPassError] = useState('Пароль не может быть пустым');
  const [emailError, setEmailError] = useState('E-mail не может быть пустым');
  const inputValues = [
    {
      id: 1,
      label: 'Email',
      value: email,
      name: 'email',
      error: emailError,
      dirty: emailDirty,
      type: 'text',
      placeholder: 'Введите email',
    },
    {
      id: 2,
      label: 'Пароль',
      value: pass,
      name: 'pass',
      error: passError,
      dirty: passDirty,
      type: 'password',
      placeholder: 'Введите пароль',
    },
  ];

  const onBlurInput = (
    e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>,
  ) => {
    switch (e.target.name) {
      case 'email':
        setEmailDirty(true);
        break;
      case 'pass':
        setPassDirty(true);
        break;
    }
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        if (!regEmail.test(String(e.target.value).toLowerCase())) {
          setEmailError('Некорректный e-mail');
          if (!e.target.value) {
            setEmailError('E-mail не может быть пустым.');
          }
        } else {
          setEmailError('');
        }
        break;

      case 'pass':
        setPass(e.target.value);
        if (!regPass.test(String(e.target.value).toLowerCase())) {
          setPassError('Некорректные пароль.');
          if (!e.target.value) {
            setPassError('Пароль не может быть пустым.');
          }
        } else {
          setPassError('');
        }
        break;
    }
  };

  const handleRegister = (email: string, password: string) => {
    if (email === '' || pass === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Заполните обязательные поля',
        icon: 'error',
        confirmButtonText: 'Cool',
      });
      setEmailError('E-mail не может быть пустым.');
      setPassError('Пароль не может быть пустыми.');
    }
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        console.log(user);
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.refreshToken,
          }),
        );
        navigate('/');
        Swal.fire({
          title: 'Вы успешно зарегистрировались и вошли в аккаунт!',
          timer: 1500,
          icon: 'success',
          showConfirmButton: false,
        });
      })
      .catch(() =>
        Swal.fire({
          icon: 'error',
          title: 'Упс...',
          text: 'Произошла ошибка при регистрации аккаунта!',
        }),
      );
  };

  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleRegister(email, pass);
  }

  return (
    <div className={s.container}>
      <div className={s.returnMain}>
        <Link to="/">
          <img src="images/arrow-left-login.svg" alt="" />
          <p>Главная</p>
        </Link>
      </div>
      <div className={s.login}>
        <p className={s.autorization}>Регистрация</p>
        <form onSubmit={submitHandler} className={s.form}>
          {inputValues.map((item, id) => (
            <div
              key={id}
              className={
                (item.error && item.dirty && `${s.correctImg} ${s.containerInput}`) ||
                `${s.containerInput} ${s.correctImg}`
              }>
              {item.dirty && item.error === '' && (
                <div style={{ position: 'absolute', right: '-32px', top: '40px' }}>
                  <img
                    src="./images/validationOk.svg"
                    style={{ color: 'red', paddingTop: '0px' }}
                  />
                </div>
              )}
              {item.dirty && item.error && <div className={s.error}>{item.error}</div>}

              <input
                className={
                  (item.dirty && item.error === '' && `${s.correct}`) ||
                  (item.dirty && item.error && `${s.uncorrect}`) ||
                  `${s.default}`
                }
                type={item.type}
                name={item.name}
                value={item.value}
                onChange={(e) => onChangeInput(e)}
                onBlur={(e) => onBlurInput(e)}
                // onChange={(e) => setEmail(e.target.value)}
                placeholder={item.placeholder}
              />
              <label htmlFor="">{item.label}</label>
            </div>
          ))}
          <button className={s.butLogin}>Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
