import s from './Autorization.module.scss';
import { useEffect, useState } from 'react';
import { setUser } from '../../redux/userSlice/userSlice';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { regPass, regEmail } from '../../utils/constants';

type Props = {
  localName: string;
  setLocalName: React.Dispatch<React.SetStateAction<string>>;
};

export default function Autorization({ localName, setLocalName }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passDirty, setPassDirty] = useState(false);
  const [emailDirty, setEmailDirty] = useState(false);
  const [passError, setPassError] = useState('Пароль не может быть пустым');
  const [emailError, setEmailError] = useState('E-mail не может быть пустым');
  const [isChecked, setIsChecked] = useState(false);
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

  useEffect(() => {
    const emailStorage = localStorage.getItem('email');
    if (emailStorage !== '') {
      setEmail(emailStorage);
    }
  }, []);

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

  const handleLogin = (email: string, password: string) => {
    if (email === '' || pass === '') {
      alert('Заполните обязательные поля');
      setEmailError('E-mail не может быть пустым.');
      setPassError('Пароль не может быть пустыми.');
    }
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        const obj = { email: user.email, id: user.uid, token: user.refreshToken };
        dispatch(setUser(obj));
        localStorage.setItem('id', user.uid);
        Swal.fire({
          title: 'Вы успешно вошли в аккаунт',
          timer: 1500,
          icon: 'success',
          showConfirmButton: false,
        });
        rememberMeHandler(email);
        navigate('/');
      })
      .catch(() =>
        Swal.fire({
          icon: 'error',
          title: 'Упс...',
          text: 'Не получилось войти в аккаунт',
        }),
      );
  };

  const rememberMeHandler = (email: string) => {
    isChecked && localStorage.setItem('email', email);
  };

  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleLogin(email, pass);
  }

  return (
    <>
      <div className={s.container}>
        <div className={s.returnMain}>
          <Link to="/">
            <img src="images/arrow-left-login.svg" alt="" />
            <p>Главная</p>
          </Link>
        </div>
        <div className={s.login}>
          <p className={s.autorization}>Авторизация</p>
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
                  placeholder={item.placeholder}
                />
                <label htmlFor="">{item.label}</label>
              </div>
            ))}

            <div className="rememberMe">
              <input
                onClick={() => setIsChecked(!isChecked)}
                className={s.remMeInput}
                type="checkBox"
              />
              <label className={s.remMeLabel} htmlFor="">
                Запомнить меня на этом компьютере
              </label>
            </div>
            <button type="submit" className={s.butLogin}>
              Вход
            </button>
            <Link className={s.forgotPass} to="/signup">
              Забыли свой пароль?
            </Link>
          </form>
          <div className={s.autorizationWith}>
            <p>Авторизация с использованием ЕС ИФЮЛ</p>
            <p className={s.autorizWithMSI}>Авторизация с использованием МСИ</p>
          </div>
          <div className={s.withoutAcc}>
            <p>У вас нет аккаунта?</p>
            <Link to="/signup">Нажмите сюда, чтобы создать</Link>
          </div>
        </div>
      </div>
    </>
  );
}
