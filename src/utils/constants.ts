export const PER_PAGE = 8;
export const nbPages = 50;
export const regPass = /^[A-Za-zА-Яа-яЁё]{5,20}(?!.* $)/;
export const regEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
export const listType = [
  {
    name: 'id',
    title: 'Регистрационные номер',
  },
  {
    name: 'nameSoft',
    title: 'Наименование программного обеспечения',
  },
];
