import React from 'react';

type RegistriesProps = {
  id: number;
  nameSoft: string;
  idClass: number;
  softwareClass: string;
  date: string;
  link: string;
};

const Registries: React.FC<RegistriesProps> = ({
  id,
  nameSoft,
  idClass,
  softwareClass,
  date,
  link,
}) => {
  return (
    <>
      <div className="registerListHeader listItemHeader">
        <div className="rowNumber rowNumber_1">{id}</div>
        <div className="rowNumber rowNumber_2">{nameSoft}</div>
        <div className="rowNumber rowNumber_3">{idClass}</div>
        <div className="rowNumber rowNumber_4">{softwareClass}</div>
        <div className="rowNumber rowNumber_5">{date}</div>
        <div className="rowNumber rowNumber_6">{link}</div>
      </div>
    </>
  );
};

export default Registries;
