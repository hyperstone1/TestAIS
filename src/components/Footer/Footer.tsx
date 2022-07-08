import { Link } from 'react-router-dom';
import s from './Footer.module.scss';

export default function Footer() {
  return (
    <div className={s.footer}>
      <div className={s.container}>
        <div className={s.footerInfo}>
          <div className={s.logo}>
            <img src="images/logo.svg" alt="" />
            <p className={s.begin}>
              Открытое акционерное общество «Реестр ПО» начало практическую деятельность с 1 марта
              2014 г
            </p>
            <div className={s.developer}>
              <h5>Разработчик</h5>
              <p className={s.company}>github.com/hyperstone1</p>
              <p className={s.address}>Минск, улица Клары Цеткин, 24</p>
            </div>
          </div>
          <div className={s.information}>
            <h3>Информация</h3>
            <ul>
              <li>
                <a href="#registries">Реестры</a>
              </li>
              <li>
                <a href="#news">Новости</a>
              </li>
              <li>
                <a href="#documents">Документы</a>
              </li>
              <li>
                <a href="#questions">Вопросы</a>
              </li>
            </ul>
          </div>
          <div className={s.techSupport}>
            <h3>Техническая поддержка</h3>
            <p className={s.timeWork}>
              Ежедневно с 8.00 до 19.00, за исключением выходных (суббота, воскресенье) и
              праздничных дней.
            </p>
            <p>+375 25 111 22 33 </p>
            <p>+375 29 222 44 55</p>
            <p>ReestrPOsupport@mail.ru</p>
          </div>

          <div className={s.contacts}>
            <h3>Контакты</h3>
            <p>+375 33 112 22 45</p>
            <p>+375 29 222 44 88</p>
            <p>ReesrtPO@mail.ru</p>
            <p>220004 г. Минск, ул. Карла Маркса, 38</p>
            <p>
              <Link to="#">Связаться с поддержкой</Link>
            </p>
          </div>
        </div>
      </div>
      <div className={s.copyright}>
        <p>© Copyright 2022 — ОАО «РеестрПО». Все права защищены.</p>
      </div>
    </div>
  );
}
